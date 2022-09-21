import { Group, Stack, Text, Loader as L } from "@mantine/core"

export default function Loader() {
	return (
		<Group position="center">
			<Stack spacing="xs">
				<L variant="bars" style={{ display: "block", margin: "auto" }} />
				<Text>Retrieving data...</Text>
			</Stack>
		</Group>
	)
}
