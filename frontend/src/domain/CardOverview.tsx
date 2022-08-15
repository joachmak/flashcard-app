import { Button } from "antd"
import { Content } from "antd/lib/layout/layout"
import Title from "antd/lib/typography/Title"
import { useContext } from "react"
import { createUseStyles } from "react-jss"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../App"
import CardView from "../components/CardView"

const useStyles = createUseStyles({
	container: {
		padding: 10,
	},
})

export default function CardOverview() {
	const context = useContext(AppContext)
	const classes = useStyles()
	const navigate = useNavigate()
	return (
		<Content className={classes.container}>
			<Title level={2}>{context?.set?.title}</Title>
			<Title level={5}>{context?.set?.description}</Title>
			{context &&
				context.set &&
				context.set.cards &&
				context.set.cards.map((card) => <CardView key={card.term} card={card} />)}
			<Button type="primary" onClick={() => navigate("/practice")}>
				Practice this set
			</Button>
		</Content>
	)
}
