import { useEffect, useState } from "react"
import { Params, useNavigate, useParams } from "react-router-dom"
import CardView from "../components/CardView"
import { Button, Container, Group, Stack, Title } from "@mantine/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChalkboardTeacher, faPencil } from "@fortawesome/free-solid-svg-icons"
import { deleteSet, getSet } from "../utils/fetch"
import ConfirmDeleteButton from "../components/ConfirmDeleteButton"
import { ISet } from "../utils/interfaces"
import Loader from "../components/Loader"

export default function CardOverview() {
	const navigate = useNavigate()
	const params: Readonly<Params<string>> = useParams()
	const [set, setSet] = useState<ISet>()
	useEffect(() => {
		if (params.id)
			getSet(parseInt(params.id)).then((res: ISet) => {
				setSet(res)
			})
	}, [params.id])
	if (!set) return <Loader />
	return (
		<Container>
			<Group position="apart">
				<Stack spacing="xs">
					<Title order={2}>{set.title}</Title>
					<Title mb="lg" order={5}>
						{set.description}
					</Title>
				</Stack>
				<Group>
					<Button
						leftIcon={<FontAwesomeIcon icon={faChalkboardTeacher} />}
						variant="outline"
						onClick={() => navigate("/practice/" + set.id)}
					>
						Practice set
					</Button>
					<Button
						leftIcon={<FontAwesomeIcon icon={faPencil} />}
						variant="subtle"
						onClick={() => {
							navigate("/edit_set/" + set.id)
						}}
					>
						Edit set
					</Button>
					<ConfirmDeleteButton
						onDelete={() => {
							if (set.id)
								deleteSet(set.id)
									.then(() => navigate("/"))
									.catch((err) => {
										console.error(err)
									})
						}}
						deleteBtnText="Delete set"
					/>
				</Group>
			</Group>
			{set.cards?.map((card) => (
				<CardView key={card.term} card={card} />
			))}
		</Container>
	)
}
