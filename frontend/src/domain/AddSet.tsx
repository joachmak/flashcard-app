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
import { IAppContext, ICard, ISet } from "../utils/interfaces"
import { useNavigate } from "react-router-dom"
import {
	createManyCards,
	createSet,
	deleteManyCards,
	patchManyCards,
	patchSet,
} from "../utils/fetch"
import { LATEX_DELIMITER } from "../utils/constants"
import { parseLatex } from "../utils/utils"
import { AppContext } from "../App"
import {
	ActionIcon,
	Button,
	Chip,
	Container,
	FileButton,
	Group,
	Stack,
	Text,
	Textarea,
	TextInput,
	Title,
	Tooltip,
} from "@mantine/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
	faDownload,
	faPlus,
	faSave,
	faTrash,
	faUpload,
	faXmark,
} from "@fortawesome/free-solid-svg-icons"
import { showNotification } from "@mantine/notifications"

let useStyles = createUseStyles({
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
	const termRef = useRef<HTMLTextAreaElement>(null)
	const definitionRef = useRef<HTMLTextAreaElement>(null)
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
							variant="subtle"
						>
							TeX
						</Button>
						<Chip tabIndex={1} checked={preview} onClick={() => setPreview(!preview)}>
							Preview
						</Chip>
						<Tooltip label="Delete card">
							<ActionIcon
								color="red"
								tabIndex={1}
								onClick={() => {
									setPreview(false)
									props.deleteFunc(props.idx)
								}}
							>
								<FontAwesomeIcon icon={faTrash} />
							</ActionIcon>
						</Tooltip>
					</div>
					{preview ? (
						props.cards[props.idx].term.length > 0 ? (
							parseLatex(props.cards[props.idx].term)
						) : (
							<Text color="gray">No text. Toggle preview to start editing.</Text>
						)
					) : (
						<Textarea
							onChange={(e) => setTerm(e.target.value)}
							value={props.cards[props.idx].term}
							placeholder="Term..."
							ref={termRef}
							minRows={2}
							maxRows={5}
							autosize
						/>
					)}
				</div>
				<div className={classes.textAreaContainer}>
					<div className={classes.cardActionBar}>
						<Tooltip label="LaTeX formatting">
							<Button
								tabIndex={1}
								onClick={() => {
									setDefinition(
										props.cards[props.idx].definition + LATEX_DELIMITER + LATEX_DELIMITER
									)
									definitionRef.current?.focus()
								}}
								variant="subtle"
							>
								TeX
							</Button>
						</Tooltip>
					</div>
					{preview ? (
						props.cards[props.idx].definition.length > 0 ? (
							parseLatex(props.cards[props.idx].definition)
						) : (
							<Text color="gray">No text. Toggle preview to start editing.</Text>
						)
					) : (
						<Textarea
							onChange={(e) => setDefinition(e.target.value)}
							value={props.cards[props.idx].definition}
							placeholder="Definition..."
							onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
								const isLastCard = props.idx === props.cards.length - 1
								if (e.key === "Tab" && !e.shiftKey && isLastCard) {
									e.preventDefault()
									props.setCards([...props.cards, { definition: "", term: "" }])
								}
							}}
							ref={definitionRef}
							autosize
							minRows={2}
							maxRows={5}
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
	const [file, setFile] = useState<File | null>(null)

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
		showNotification({
			title: "Oops!",
			message: message,
			color: "red",
			autoClose: 5000,
			icon: <FontAwesomeIcon icon={faXmark} />,
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

	useEffect(() => {
		// on file change, append cards
		if (file)
			file.text().then((res) => {
				setCards((c) => {
					return c.concat(JSON.parse(res))
				})
			})
	}, [file])

	return (
		<Container pb="lg">
			<Title order={2}>{isEditing ? "Edit set" : "Add new set"}</Title>
			<Stack>
				<TextInput
					onChange={(e) => setSetTitle(e.currentTarget.value)}
					value={setTitle}
					label="Set name"
					placeholder="The name of this set..."
					variant="unstyled"
				/>
				<Textarea
					onChange={(e) => setSetDescription(e.currentTarget.value)}
					value={setDescription}
					label="Set description"
					placeholder="The description of this set..."
					variant="unstyled"
				/>
			</Stack>
			{cards.map((_, index) => (
				<CardInputGroup
					cards={cards}
					setCards={setCards}
					deleteFunc={deleteCard}
					idx={index}
					key={index}
				/>
			))}
			<Group className={classes.addCardBtn}>
				<ActionIcon onClick={addCard} radius="xl" variant="subtle" color="blue" mb="md">
					<FontAwesomeIcon icon={faPlus} />
				</ActionIcon>
			</Group>
			<Group>
				<Button
					leftIcon={<FontAwesomeIcon icon={faSave} />}
					onClick={() => {
						if (isEditing) updateSetWithCards()
						else createSetWithCards()
					}}
					loading={isLoading}
					variant="filled"
				>
					Save set
				</Button>
				<Button
					leftIcon={<FontAwesomeIcon icon={faDownload} />}
					onClick={downloadJson}
					loading={isLoading}
					variant="subtle"
				>
					Download cards
				</Button>
				<FileButton onChange={setFile} accept=".json">
					{(props) => (
						<Button {...props} variant="subtle" leftIcon={<FontAwesomeIcon icon={faUpload} />}>
							Upload cards
						</Button>
					)}
				</FileButton>
			</Group>
		</Container>
	)
}
