import { Card } from "antd"
import { createUseStyles } from "react-jss"
import { ICard } from "../utils/interfaces"

const useStyles = createUseStyles({
	container: {
		display: "flex",
		width: "100%",
		gap: 5,
	},
	card: {
		flex: 1,
		marginBottom: 20,
		boxShadow: "0 2px 2px rgba(0,0,0,0.15)",
	},
})

export default function CardView(props: { card: ICard }) {
	const classes = useStyles()
	return (
		<div className={classes.container}>
			<Card className={classes.card}>{props.card.term}</Card>
			<Card className={classes.card}>{props.card.definition}</Card>
		</div>
	)
}
