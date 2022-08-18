import { Card, Group, Text } from "@mantine/core"
import { createUseStyles } from "react-jss"
import { ICard } from "../utils/interfaces"
import { parseCardText } from "../utils/utils"
import { OverflowTextPreview } from "./OverflowTextPreview"

const useStyles = createUseStyles({
	container: {
		display: "flex",
		alignItems: "stretch",
	},
	card: {
		flex: 1,
		marginBottom: 30,
		paddingTop: 0,
	},
})

export default function CardView(props: { card: ICard }) {
	const classes = useStyles()
	return (
		<Group className={classes.container}>
			<Card shadow="sm" className={classes.card} withBorder>
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
			<Card shadow="sm" className={classes.card} withBorder>
				<Text>{parseCardText(props.card.definition)}</Text>
			</Card>
		</Group>
	)
}
