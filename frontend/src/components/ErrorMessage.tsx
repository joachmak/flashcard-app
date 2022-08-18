import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Avatar, Group, Stack, Title, Text } from "@mantine/core"

export default function ErrorMessage() {
	return (
		<Stack spacing="xs">
			<Group>
				<Avatar color="red" radius="xl">
					<FontAwesomeIcon icon={faXmark} />
				</Avatar>
				<Title order={2}>Oops! Something went wrong...</Title>
			</Group>
			<Text>Refresh the page and cross your fingers</Text>
		</Stack>
	)
}
