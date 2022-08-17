import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../App"
import CardView from "../components/CardView"
import { Button, Container, Group, Title } from "@mantine/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil } from "@fortawesome/free-solid-svg-icons"

export default function CardOverview() {
	const context = useContext(AppContext)
	const navigate = useNavigate()
	return (
		<Container>
			<Title order={2}>{context?.set?.title}</Title>
			<Title mb="lg" order={5}>
				{context?.set?.description}
			</Title>
			{context?.set?.cards?.map((card) => (
				<CardView key={card.term} card={card} />
			))}
			<Group>
				<Button variant="outline" onClick={() => navigate("/practice")}>
					Practice this set
				</Button>
				<Button
					leftIcon={<FontAwesomeIcon icon={faPencil} />}
					variant="subtle"
					onClick={() => {
						navigate("/add_set")
					}}
				>
					Edit set
				</Button>
			</Group>
		</Container>
	)
}
