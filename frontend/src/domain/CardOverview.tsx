import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../App"
import CardView from "../components/CardView"
import { Button, Container, Group, Stack, Title } from "@mantine/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChalkboardTeacher, faPencil } from "@fortawesome/free-solid-svg-icons"
import { deleteSet } from "../utils/fetch"
import ConfirmDeleteButton from "../components/ConfirmDeleteButton"

export default function CardOverview() {
	const context = useContext(AppContext)
	const navigate = useNavigate()
	return (
		<Container>
			<Group position="apart">
				<Stack spacing="xs">
					<Title order={2}>{context?.set?.title}</Title>
					<Title mb="lg" order={5}>
						{context?.set?.description}
					</Title>
				</Stack>
				<Group>
					<Button
						leftIcon={<FontAwesomeIcon icon={faChalkboardTeacher} />}
						variant="outline"
						onClick={() => navigate("/practice")}
					>
						Practice set
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
					<ConfirmDeleteButton
						onDelete={() => {
							if (context?.set?.id)
								deleteSet(context.set.id)
									.then(() => navigate("/"))
									.catch((err) => {
										console.error(err)
									})
						}}
						deleteBtnText="Delete set"
					/>
				</Group>
			</Group>
			{context?.set?.cards?.map((card) => (
				<CardView key={card.term} card={card} />
			))}
		</Container>
	)
}
