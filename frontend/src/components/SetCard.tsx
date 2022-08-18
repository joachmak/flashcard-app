import { faCopy } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Card, Group, Text, Transition } from "@mantine/core"
import { useEffect, useState } from "react"
import { createUseStyles } from "react-jss"
import { deleteSet } from "../utils/fetch"
import { ISet } from "../utils/interfaces"
import ConfirmDeleteButton from "./ConfirmDeleteButton"

interface Props {
	set: ISet
	onClick: () => void
}

const useStyles = createUseStyles({
	link: {
		cursor: "pointer",
	},
})

export default function SetCard(props: Props) {
	const classes = useStyles()
	const [mounted, setMounted] = useState(false)
	useEffect(() => {
		setMounted(true)
	}, [])
	return (
		<Transition mounted={mounted} transition="pop" duration={200} timingFunction="ease">
			{(styles) => (
				<Card style={styles} component="div" shadow="sm" p="lg" radius="sm" withBorder>
					<Card.Section>
						<Group position="apart" pt="sm" px="lg">
							<Text
								size="xl"
								weight="bold"
								component="a"
								variant="link"
								className={classes.link}
								onClick={props.onClick}
							>
								{props.set.title}
							</Text>
							<Group spacing="xs">
								<FontAwesomeIcon icon={faCopy} /> {props.set.cards ? props.set.cards.length : 0}{" "}
								card
								{props.set.cards?.length !== 1 && "s"}
							</Group>
						</Group>
					</Card.Section>
					<Text pt="sm">"{props.set.description}"</Text>
					<Group spacing="xl" py="sm">
						<Text>
							<b>Date added</b>
							<br />
							{new Date(props.set.created_date).toLocaleDateString("no-NB")}
						</Text>
						<Text>
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
					<ConfirmDeleteButton
						onDelete={() => {
							if (props.set.id) deleteSet(props.set.id).then(() => window.location.reload())
						}}
						deleteBtnText="Delete set"
					/>
				</Card>
			)}
		</Transition>
	)
}
