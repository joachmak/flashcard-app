import { useEffect, useState } from "react"
import { createUseStyles } from "react-jss"
import { ICard, ISet } from "../utils/interfaces"
import { useNavigate, useParams } from "react-router-dom"
import {
	createManyCards,
	createSet,
	deleteManyCards,
	getSet,
	patchImage,
	patchManyCards,
	patchSet,
} from "../utils/fetch"
import {
	ActionIcon,
	Button,
	Container,
	FileButton,
	Group,
	Stack,
	Textarea,
	TextInput,
	Title,
} from "@mantine/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDownload, faPlus, faSave, faUpload, faXmark } from "@fortawesome/free-solid-svg-icons"
import { showNotification } from "@mantine/notifications"
import CardInputGroup from "../components/CardInputGroup"

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
	const [file, setFile] = useState<File | null>(null)
	const params = useParams()

	useEffect(() => {
		if (params.id) {
			getSet(parseInt(params.id)).then((res: ISet) => {
				setCards(res.cards || [])
				setSetTitle(res.title)
				setSetDescription(res.description)
				setSetBackup(res)
				setIsEditing(true)
				console.log(res.cards)
			})
		}
	}, [params])

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
	const updateCard = (idx: number, card: ICard) => {
		if (cards[idx]) {
			setCards((cards) => {
				cards[idx] = card
				return [...cards]
			})
		}
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
					.then((res) => res.json())
					.then((res: ICard[]) => {
						// for each card, for each image, set image's card to the appropriate card id
						console.log(res)
						console.log(nonEmptyCards)
						res.forEach((card: ICard, idx: number) => {
							if (nonEmptyCards[idx].images_definition) {
								nonEmptyCards[idx].images_definition!.forEach((image) => {
									console.log("patching term image with id " + image.id)
									image.card = card.id
									console.log(image)
									patchImage({ id: image.id, card: card.id })
								})
							}
							if (nonEmptyCards[idx].images_term) {
								nonEmptyCards[idx].images_term!.forEach((image) => {
									patchImage({ id: image.id, card: card.id })
								})
							}
						})
						navigate("/")
					})
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
		const setId: number | undefined = setBackup?.id

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
			{cards.map((card, index) => (
				<CardInputGroup
					card={card}
					deleteFunc={deleteCard}
					idx={index}
					totalCardCount={cards.length}
					addCard={addCard}
					updateCard={updateCard}
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
