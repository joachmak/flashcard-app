import Input from "antd/lib/input"
import TextArea from "antd/lib/input/TextArea"
import { Content } from "antd/lib/layout/layout"
import Title from "antd/lib/typography/Title"
import { Dispatch, SetStateAction, useState } from "react"
import { createUseStyles } from "react-jss"
import {
	DeleteOutlined,
	PlusOutlined,
	SaveOutlined,
	DownloadOutlined,
	UploadOutlined,
} from "@ant-design/icons"
import { ICard } from "../utils/interfaces"
import { Button, notification, Tooltip, Upload } from "antd"
import { useNavigate } from "react-router-dom"
import { createManyCards, createSet } from "../utils/fetch"
import type { UploadProps } from "antd"
import { RcFile } from "antd/lib/upload"

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
	icon: {
		cursor: "pointer",
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
	return (
		<div className={classes.cardInputGroupContainer}>
			<div className={classes.termDefinitionContainer}>
				<TextArea
					onChange={(e) => setTerm(e.target.value)}
					value={props.cards[props.idx].term}
					className={classes.textArea}
					placeholder="Term..."
					autoSize={{ minRows: 2, maxRows: 6 }}
				/>
				<TextArea
					onChange={(e) => setDefinition(e.target.value)}
					value={props.cards[props.idx].definition}
					className={classes.textArea}
					placeholder="Definition..."
					autoSize={{ minRows: 2, maxRows: 6 }}
				/>
			</div>
			<div className={classes.actionBar}>
				<Tooltip placement="right" title="Delete card">
					<Button
						danger
						type="text"
						shape="circle"
						icon={<DeleteOutlined />}
						onClick={() => props.deleteFunc(props.idx)}
					/>
				</Tooltip>
			</div>
		</div>
	)
}

export default function AddSet() {
	const classes = useStyles()
	const [setName, setSetName] = useState("")
	const [setDescription, setSetDescription] = useState("")
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
	const [isLoading, setIsLoading] = useState(false)

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

	const createSetWithCards = () => {
		if (setName === "") {
			openErrNotification("You must enter a set name")
			return
		}
		if (setDescription === "") {
			openErrNotification("You must enter a set description")
			return
		}
		setIsLoading(true)
		createSet(setName, setDescription)
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

	return (
		<div>
			<Content className={classes.content}>
				<Title level={2}>Add new set</Title>
				<div className={classes.setTitleContainer}>
					<Input
						onChange={(e) => setSetName(e.currentTarget.value)}
						value={setName}
						placeholder="Set name"
					/>
					<TextArea
						onChange={(e) => setSetDescription(e.currentTarget.value)}
						value={setDescription}
						placeholder="Set description"
					/>
				</div>
				<div className={classes.setContainer}>
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
					onClick={createSetWithCards}
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
