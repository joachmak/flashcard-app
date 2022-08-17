import { Card, Text } from "@mantine/core"
import { createUseStyles } from "react-jss"
import { ICard } from "../utils/interfaces"
import { parseLatex } from "../utils/utils"

const useStyles = createUseStyles({
	container: {
		display: "flex",
		width: "100%",
		gap: 5,
	},
	card: {
		flex: 1,
		marginBottom: 30,
	},
})

export default function CardView(props: { card: ICard }) {
	const classes = useStyles()
	return (
		<div className={classes.container}>
			<Card shadow="sm" className={classes.card} withBorder>
				<Text>{parseLatex(props.card.term)}</Text>
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
				<Text>{parseLatex(props.card.definition)}</Text>
			</Card>
		</div>
	)
}
