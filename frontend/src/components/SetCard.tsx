import { faCopy, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ActionIcon, Card, Group, Text } from "@mantine/core"
import { deleteSet } from "../utils/fetch"
import { ISet } from "../utils/interfaces"

interface Props {
	set: ISet
	onClick: () => void
}

export default function SetCard(props: Props) {
	let styles = {
		date: {
			margin: 0,
		},
	}
	return (
		<Card shadow="sm" p="lg" radius="sm" withBorder>
			<Card.Section>
				<Group position="apart" pt="sm" px="lg">
					<Text size="xl" weight="bold" component="a" variant="link" onClick={props.onClick}>
						{props.set.title}
					</Text>
					<Group spacing="xs">
						<FontAwesomeIcon icon={faCopy} /> {props.set.cards ? props.set.cards.length : 0} card
						{props.set.cards?.length !== 1 && "s"}
					</Group>
				</Group>
			</Card.Section>
			<Text pt="sm">"{props.set.description}"</Text>
			<Group spacing="xl" py="sm">
				<Text style={styles.date}>
					<b>Date added</b>
					<br />
					{new Date(props.set.created_date).toLocaleDateString("no-NB")}
				</Text>
				<Text style={styles.date}>
					<b>Last edited</b>
					<br />
					{new Date(props.set.last_updated_date).toLocaleDateString("no-NB", {
						year: "numeric",
						month: "numeric",
						day: "numeric",
						hour: "2-digit",
						minute: "2-digit",
					})}
				</Text>
			</Group>
			<ActionIcon
				onClick={() => {
					if (props.set.id) deleteSet(props.set.id).then(() => window.location.reload())
				}}
				color="red"
			>
				<FontAwesomeIcon icon={faTrash} />
			</ActionIcon>
		</Card>
	)
}
