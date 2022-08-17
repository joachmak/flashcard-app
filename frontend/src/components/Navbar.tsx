import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AppContext } from "../App"
import { IAppContext } from "../utils/interfaces"
import { unassignSetContext } from "../utils/utils"
import { Container, Group, Text } from "@mantine/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse, faPlus } from "@fortawesome/free-solid-svg-icons"
import { createUseStyles } from "react-jss"

const useStyles = createUseStyles({
	link: {
		cursor: "pointer",
	},
})

export default function Navbar() {
	const navigate = useNavigate()
	const classes = useStyles()
	const context = useContext<IAppContext | null>(AppContext)
	return (
		<Container>
			<Group py="md" spacing={"lg"}>
				<Text
					className={classes.link}
					component="a"
					variant="link"
					onClick={() => {
						unassignSetContext(context)
						navigate("/")
					}}
				>
					<Group spacing="xs">
						<FontAwesomeIcon icon={faHouse} /> Home
					</Group>
				</Text>
				<Text
					className={classes.link}
					component="a"
					variant="link"
					onClick={() => {
						unassignSetContext(context)
						navigate("/add_set")
					}}
				>
					<Group spacing="xs">
						<FontAwesomeIcon icon={faPlus} /> Add new set
					</Group>
				</Text>
			</Group>
		</Container>
	)
}
