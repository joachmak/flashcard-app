import Input from "antd/lib/input"
import TextArea from "antd/lib/input/TextArea"
import { Content } from "antd/lib/layout/layout"
import Title from "antd/lib/typography/Title"
import {
	Dispatch,
	KeyboardEvent,
	SetStateAction,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react"
import { createUseStyles } from "react-jss"
import {
	DeleteOutlined,
	PlusOutlined,
	SaveOutlined,
	DownloadOutlined,
	UploadOutlined,
} from "@ant-design/icons"
import { IAppContext, ICard, ISet } from "../utils/interfaces"
import { Button, notification, Tooltip, Upload } from "antd"
import { useNavigate } from "react-router-dom"
import {
	createManyCards,
	createSet,
	deleteManyCards,
	patchManyCards,
	patchSet,
} from "../utils/fetch"
import type { UploadProps } from "antd"
import { RcFile } from "antd/lib/upload"
import { LATEX_DELIMITER } from "../utils/constants"
import { parseLatex } from "../utils/utils"
import { AppContext } from "../App"

let useStyles = createUseStyles({
	content: {
		padding: 20,
	},
	setTitleContainer: {
		width: 300,
		marginBottom: 20,
		display: "flex",
		flexDirection: "column",
		gap: 10,
	},
	setContainer: {
		display: "flex",
		flexDirection: "column",
	},
	cardInputGroupContainer: {
		marginBottom: 20,
		padding: "5px 5px 5px 0",
	},
	termDefinitionContainer: {
		display: "flex",
		flexWrap: "nowrap",
		gap: 5,
	},
	cardInput: {
		width: "50%",
		border: "1px solid rgba(0,0,0,0.3)",
	},
	actionBar: {
		display: "flex",
		marginTop: 10,
	},
	cardActionBar: {
		display: "flex",
		gap: 10,
		marginBottom: 5,
		alignItems: "center",
	},
	icon: {
		cursor: "pointer",
	},
	textAreaContainer: {
		width: "100%",
	},
	textArea: {
		border: "1px solid rgba(0,0,0,0.3)",
	},
	addCardBtn: {
		width: "100%",
		display: "flex",
		justifyContent: "center",
	},
})

interface CardInputGroupProps {
	deleteFunc: (idx: number) => void
	idx: number
	setCards: Dispatch<SetStateAction<ICard[]>>
	cards: ICard[]
}

function CardInputGroup(props: CardInputGroupProps) {
	const classes = useStyles()
	const setTerm = (val: string) => {
		props.cards[props.idx].term = val
		props.setCards([...props.cards])
	}
	const setDefinition = (val: string) => {
		props.cards[props.idx].definition = val
		props.setCards([...props.cards])
	}
	const [preview, setPreview] = useState<boolean>(false)
	const [cardLength, setCardLength] = useState<number>()
	const termRef = useRef<HTMLElement>(null)
	const definitionRef = useRef<HTMLElement>(null)
	useEffect(() => {
		if (cardLength === undefined) setCardLength(props.cards.length)
		else if (cardLength !== props.cards.length) {
			// set focus to newly added card term
			const cardContainer: HTMLElement = document.getElementById("cardContainer")?.lastChild
				?.firstChild?.firstChild?.lastChild as HTMLElement
			if (cardContainer) cardContainer.focus()
			setCardLength(props.cards.length)
		}
	}, [props.cards, cardLength])
	return (
		<div className={classes.cardInputGroupContainer}>
			<div className={classes.termDefinitionContainer}>
				<div className={classes.textAreaContainer}>
					<div className={classes.cardActionBar}>
						<Button
							tabIndex={1}
							onClick={() => {
								setTerm(props.cards[props.idx].term + LATEX_DELIMITER + LATEX_DELIMITER)
								termRef.current?.focus()
							}}
							type="ghost"
						>
							TeX
						</Button>
						<Button tabIndex={1} onClick={() => setPreview(!preview)} type="ghost">
							Toggle preview
						</Button>
						<Tooltip placement="right" title="Delete card">
							<Button
								tabIndex={1}
								danger
								type="text"
								shape="circle"
								icon={<DeleteOutlined />}
								onClick={() => {
									setPreview(false)
									props.deleteFunc(props.idx)
								}}
							/>
						</Tooltip>
					</div>
					{preview ? (
						props.cards[props.idx].term.length > 0 ? (
							parseLatex(props.cards[props.idx].term)
						) : (
							"No text. Toggle preview to start editing."
						)
					) : (
						<TextArea
							onChange={(e) => setTerm(e.target.value)}
							value={props.cards[props.idx].term}
							className={classes.textArea}
							placeholder="Term..."
							autoSize={{ minRows: 2, maxRows: 6 }}
							ref={termRef}
						/>
					)}
				</div>
				<div className={classes.textAreaContainer}>
					<div className={classes.cardActionBar}>
						<Tooltip placement="right" title="LaTeX formatting">
							<Button
								tabIndex={1}
								onClick={() => {
									setDefinition(
										props.cards[props.idx].definition + LATEX_DELIMITER + LATEX_DELIMITER
									)
									definitionRef.current?.focus()
								}}
								type="ghost"
							>
								TeX
							</Button>
						</Tooltip>
					</div>
					{preview ? (
						props.cards[props.idx].definition.length > 0 ? (
							parseLatex(props.cards[props.idx].definition)
						) : (
							"No text. Toggle preview to start editing."
						)
					) : (
						<TextArea
							onChange={(e) => setDefinition(e.target.value)}
							value={props.cards[props.idx].definition}
							className={classes.textArea}
							placeholder="Definition..."
							autoSize={{ minRows: 2, maxRows: 6 }}
							onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
								const isLastCard = props.idx === props.cards.length - 1
								if (e.key === "Tab" && !e.shiftKey && isLastCard) {
									e.preventDefault()
									props.setCards([...props.cards, { definition: "", term: "" }])
								}
							}}
							ref={definitionRef}
						/>
					)}
				</div>
			</div>
		</div>
	)
}

export default function AddSet() {
	const classes = useStyles()
	const [setTitle, setSetTitle] = useState<string>("")
	const [setDescription, setSetDescription] = useState<string>("")
	const [setBackup, setSetBackup] = useState<ISet>()
	const [isEditing, setIsEditing] = useState<boolean>(false)
	const [cards, setCards] = useState<ICard[]>([
		{
			term: "",
			definition: "",
		},
		{
			term: "",
			definition: "",
		},
		{
			term: "",
			definition: "",
		},
	])
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const context = useContext<IAppContext | null>(AppContext)

	const uploadProps: UploadProps = {
		name: "file",
		accept: ".json",
		showUploadList: false,
		beforeUpload(file: RcFile) {
			file.text().then((res) => {
				// add file content to end of set
				setCards(cards.concat(JSON.parse(res)))
			})
			return false // prevent POST request
		},
	}

	const addCard = () => {
		setCards((prevState) => [...prevState, { term: "", definition: "" }])
	}
	const deleteCard = (idx: number) => {
		const cardClone = cards.map((a, idx) => {
			return { ...a }
		})
		cardClone.splice(idx, 1)
		setCards(cardClone)
	}
	const openErrNotification = (message: string) => {
		notification.error({
			message: message,
			placement: "topLeft",
			duration: 5,
		})
	}
	/**
	 * Download JSON backup of non-empty cards contained within this set
	 */
	const downloadJson = () => {
		const nonEmptyCards = cards.filter((card) => card.definition !== "" || card.term !== "")
		const text = JSON.stringify(nonEmptyCards)
		let element = document.createElement("a")
		element.setAttribute("href", "data:text/plain;charset=utf-8, " + encodeURIComponent(text))
		element.setAttribute("download", "setBackup.json")
		document.body.appendChild(element)
		element.click()
		document.body.removeChild(element)
	}

	const isValid = (): boolean => {
		if (setTitle === "") {
			openErrNotification("You must enter a set name")
			return false
		}
		if (setDescription === "") {
			openErrNotification("You must enter a set description")
			return false
		}
		return true
	}

	const createSetWithCards = () => {
		if (!isValid()) return
		setIsLoading(true)
		createSet(setTitle, setDescription)
			.then((res) => res.json())
			.then((res) => {
				// only include non-empty cards
				const nonEmptyCards = cards.filter((card) => card.definition !== "" && card.term !== "")
				nonEmptyCards.map((card) => {
					card["score"] = 0
					card["set"] = res.id
					return card
				})
				createManyCards(nonEmptyCards)
					.then(() => navigate("/"))
					.catch((err) => {
						throw err
					})
			})
			.catch((err) => {
				console.error(err)
				openErrNotification("Something went wrong. Try saving again and start praying.")
				setIsLoading(false)
			})
	}

	const updateSetWithCards = () => {
		if (!isValid) return
		setIsLoading(true)
		let cardsWithId: Partial<ICard>[] = []
		let cardsWithoutId: ICard[] = []
		let idsToDelete: { [key: number]: boolean } = {} // use dictionary for constant lookup, val has no purpose
		const setId: number | undefined = context?.set?.id

		if (!setId) return
		setBackup?.cards?.forEach((card) => {
			// initially, include all cards that were in the set previously
			if (card.id) idsToDelete[card.id] = true
		})
		cards.forEach((card) => {
			if (card.definition === "" && card.term === "") return // skip empty cards
			if (card.id) {
				delete idsToDelete[card.id] // don't delete card with this id as it is still in the set
				cardsWithId.push(card)
				return
			}
			card.set = setId
			card.score = 0
			cardsWithoutId.push(card)
		})

		patchManyCards(cardsWithId)
			.then(() => {
				createManyCards(cardsWithoutId).then(() =>
					deleteManyCards(
						// create list of dict keys that were in backupSet but are not in the current set
						Object.entries(idsToDelete).map((keyValPair) => parseInt(keyValPair[0]))
					).then(() => {
						patchSet(setId, { last_updated_date: new Date() }).then(() => navigate("/"))
					})
				)
			})
			.catch((err) => {
				console.error(err)
				openErrNotification("Something went wrong. Try saving again and start praying.")
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

	useEffect(() => {
		if (context?.set?.cards) {
			setIsEditing(true)
			setSetTitle(context.set.title)
			setSetDescription(context.set.description)
			setCards(context.set.cards)
			setSetBackup(context.set)
		}
	}, [context])

	return (
		<div>
			<Content className={classes.content}>
				<Title level={2}>{isEditing ? "Edit set" : "Add new set"}</Title>
				<div className={classes.setTitleContainer}>
					<Input
						onChange={(e) => setSetTitle(e.currentTarget.value)}
						value={setTitle}
						placeholder="Set name"
					/>
					<TextArea
						onChange={(e) => setSetDescription(e.currentTarget.value)}
						value={setDescription}
						placeholder="Set description"
					/>
				</div>
				<div id="cardContainer" className={classes.setContainer}>
					{cards.map((_, index) => (
						<CardInputGroup
							cards={cards}
							setCards={setCards}
							deleteFunc={deleteCard}
							idx={index}
							key={index}
						/>
					))}
				</div>
				<div className={classes.addCardBtn}>
					<Tooltip title="Add card">
						<Button
							loading={isLoading}
							type="text"
							shape="circle"
							icon={<PlusOutlined onClick={addCard} />}
						/>
					</Tooltip>
				</div>
				<Button
					icon={<SaveOutlined />}
					onClick={() => {
						if (isEditing) updateSetWithCards()
						else createSetWithCards()
					}}
					loading={isLoading}
					type="primary"
				>
					Save set
				</Button>
				<Button
					icon={<DownloadOutlined />}
					onClick={downloadJson}
					loading={isLoading}
					type="ghost"
					style={{ marginLeft: 10 }}
				>
					Download cards
				</Button>
				<Upload {...uploadProps}>
					<Button style={{ marginLeft: 10 }} icon={<UploadOutlined />}>
						Upload cards
					</Button>
				</Upload>
			</Content>
		</div>
	)
}
