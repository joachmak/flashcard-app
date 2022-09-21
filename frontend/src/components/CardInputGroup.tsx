import { Chip, Divider, Group, Stack, Textarea, Text } from "@mantine/core"
import { Dispatch, SetStateAction, useEffect, useRef, useState, KeyboardEvent } from "react"
import { createUseStyles } from "react-jss"
import { ICard, IImage } from "../utils/interfaces"
import { parseCardText } from "../utils/utils"
import CodeBlockButton from "./CodeBlockButton"
import ConfirmDeleteButton from "./ConfirmDeleteButton"
import ImagePreview from "./ImagePreview"
import ImageUpload from "./ImageUpload"
import { OverflowTextPreview } from "./OverflowTextPreview"
import TexButton from "./TexButton"

const useStyles = createUseStyles({
	cardInputGroupContainer: {
		marginBottom: 20,
		padding: "5px 5px 5px 0",
	},
})

interface Props {
	card: ICard
	deleteFunc: (idx: number) => void
	idx: number
	updateCard: (idx: number, card: ICard) => void
	totalCardCount: number
	addCard: () => void
}

export default function CardInputGroup(props: Props) {
	const classes = useStyles()
	const setTerm = (val: string) => {
		props.card.term = val
		props.updateCard(props.idx, props.card)
	}
	const setDefinition = (val: string) => {
		props.card.definition = val
		props.updateCard(props.idx, props.card)
	}
	const setImagesTerm = (images: IImage[]) => {
		props.card.images_term = images
		props.updateCard(props.idx, props.card)
	}
	const setImagesDefinition = (images: IImage[]) => {
		props.card.images_definition = images
		props.updateCard(props.idx, props.card)
	}
	const [preview, setPreview] = useState<boolean>(false)
	const termRef = useRef<HTMLTextAreaElement>(null)
	const definitionRef = useRef<HTMLTextAreaElement>(null)

	return (
		<div className={classes.cardInputGroupContainer}>
			<Group position="center" pb="sm">
				Card #{props.idx + 1}
			</Group>
			<Group grow align="flex-start">
				<Stack>
					<Group>
						<TexButton text={props.card.term} setTextFunction={setTerm} textAreaRef={termRef} />
						<CodeBlockButton
							text={props.card.term}
							setTextFunction={setTerm}
							textAreaRef={termRef}
						/>
						<ImageUpload
							images={props.card.images_term || []}
							isTermImage={true}
							setImages={setImagesTerm}
						/>
					</Group>
					{preview ? (
						props.card.term.length > 0 ? (
							<OverflowTextPreview>{parseCardText(props.card.term)}</OverflowTextPreview>
						) : (
							<Text color="gray">No text. Toggle preview to start editing.</Text>
						)
					) : (
						<Textarea
							onChange={(e) => setTerm(e.target.value)}
							value={props.card.term}
							placeholder="Term..."
							ref={termRef}
							minRows={2}
							maxRows={5}
							autosize
						/>
					)}
					<ImagePreview
						isEditable={true}
						setImages={setImagesTerm}
						images={props.card.images_term || []}
					/>
				</Stack>
				<Stack>
					<Group>
						<TexButton
							text={props.card.definition}
							setTextFunction={setDefinition}
							textAreaRef={definitionRef}
						/>
						<CodeBlockButton
							text={props.card.definition}
							setTextFunction={setDefinition}
							textAreaRef={definitionRef}
						/>
						<ImageUpload
							images={props.card.images_definition || []}
							isTermImage={false}
							setImages={setImagesDefinition}
						/>
					</Group>
					{preview ? (
						props.card.definition.length > 0 ? (
							parseCardText(props.card.definition)
						) : (
							<Text color="gray">No text. Toggle preview to start editing.</Text>
						)
					) : (
						<Textarea
							onChange={(e) => setDefinition(e.target.value)}
							value={props.card.definition}
							placeholder="Definition..."
							onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
								const isLastCard = props.idx === props.totalCardCount - 1
								if (e.key === "Tab" && !e.shiftKey && isLastCard) {
									e.preventDefault()
									props.addCard()
								}
							}}
							ref={definitionRef}
							autosize
							minRows={2}
							maxRows={5}
						/>
					)}
					<ImagePreview
						isEditable={true}
						setImages={setImagesDefinition}
						images={props.card.images_definition || []}
					/>
				</Stack>
			</Group>
			<Group py="sm">
				<ConfirmDeleteButton
					onDelete={() => {
						setPreview(false)
						props.deleteFunc(props.idx)
					}}
					deleteBtnText={"Delete card"}
					buttonVariant="subtle"
				/>
				<Chip variant="outline" tabIndex={1} checked={preview} onClick={() => setPreview(!preview)}>
					Preview
				</Chip>
			</Group>
			<Divider />
		</div>
	)
}
