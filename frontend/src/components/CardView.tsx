import { Card, Group, Stack, Text } from "@mantine/core"
import { createUseStyles } from "react-jss"
import { ICard } from "../utils/interfaces"
import { parseCardText } from "../utils/utils"
import ImagePreview from "./ImagePreview"
import { OverflowTextPreview } from "./OverflowTextPreview"

const useStyles = createUseStyles({
	container: {
		display: "flex",
		alignItems: "stretch",
		flexWrap: "nowrap",
	},
	cardContainer: {
		flex: 1,
		marginBottom: 30,
		paddingTop: 0,
		width: "50%",
	},
	card: {
		height: "100%",
	},
})

export default function CardView(props: { card: ICard }) {
	const classes = useStyles()
	console.log(props.card)
	return (
		<Group className={classes.container}>
			<Stack className={classes.cardContainer}>
				<Card className={classes.card} shadow="sm" withBorder>
					<OverflowTextPreview>{parseCardText(props.card.term)}</OverflowTextPreview>
					<Text>
						<i>Strength score: {props.card.score}</i>
					</Text>
					<Text>
						<i>
							Last practiced:{" "}
							{props.card.last_practiced
								? new Date(props.card.last_practiced).toLocaleString()
								: "Never"}
						</i>
					</Text>
				</Card>
				<ImagePreview
					images={props.card.images_term || []}
					setImages={() => {}}
					isEditable={false}
				/>
			</Stack>
			<Stack className={classes.cardContainer}>
				<Card className={classes.card} shadow="sm" withBorder>
					<OverflowTextPreview>{parseCardText(props.card.definition)}</OverflowTextPreview>
				</Card>
				<ImagePreview
					images={props.card.images_definition || []}
					setImages={() => {}}
					isEditable={false}
				/>
			</Stack>
		</Group>
	)
}
