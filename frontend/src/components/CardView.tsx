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
		marginBottom: 30,
	},
	infotext: {
		color: "rgba(0,0,0,0.5)",
	},
})

export default function CardView(props: { card: ICard }) {
	const classes = useStyles()
	return (
		<div>
			<div className={classes.container}>
				<Card className={classes.card}>
					{props.card.term}
					<br />
					<i className={classes.infotext}>Strength score: {props.card.score}</i>
					<br />
					<i className={classes.infotext}>
						Last practiced:{" "}
						{props.card.last_practiced
							? new Date(props.card.last_practiced).toLocaleString()
							: "Never"}
					</i>
				</Card>
				<Card className={classes.card}>{props.card.definition}</Card>
			</div>
		</div>
	)
}
