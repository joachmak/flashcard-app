import { Container, Stack, Text, Title } from "@mantine/core"
import { useNavigate } from "react-router-dom"

export default function PageNotFound() {
	const navigate = useNavigate()
	return (
		<Container>
			<Stack>
				<Title>Hmmmm...</Title>
				<Text>
					Nothing here, pal. I think you took a wrong turn.{" "}
					<Text
						variant="link"
						component="span"
						style={{ cursor: "pointer" }}
						onClick={() => navigate("/")}
					>
						Go home
					</Text>
					, perhaps you're drunk.
				</Text>
			</Stack>
		</Container>
	)
}
