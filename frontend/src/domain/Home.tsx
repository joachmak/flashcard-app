import { Container, Grid, Group, Loader, Stack, Text, Title } from "@mantine/core"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AppContext } from "../App"
import ErrorMessage from "../components/ErrorMessage"
import SetCard from "../components/SetCard"
import { getSets } from "../utils/fetch"
import { ISet } from "../utils/interfaces"
import { assignSetContext } from "../utils/utils"

export default function Home() {
	const context = useContext(AppContext)
	const navigate = useNavigate()
	const [sets, setSets] = useState<ISet[]>()
	const [err, setErr] = useState<string>("")
	useEffect(() => {
		getSets()
			.then((res) => setSets(res))
			.catch((err) => {
				setErr(err.toString())
				console.error(err)
			})
	}, [])
	return (
		<Container>
			<Title order={1} mb="sm">
				Sets
			</Title>
			{sets === undefined && !err && (
				<Group position="center">
					<Stack spacing="xs">
						<Loader variant="bars" style={{ display: "block", margin: "auto" }} />
						<Text>Retrieving sets...</Text>
					</Stack>
				</Group>
			)}
			{err && <ErrorMessage />}
			<Grid grow>
				{sets?.map((set) => (
					<Grid.Col span={6} key={set.id}>
						<SetCard
							set={set}
							onClick={() => {
								assignSetContext(context, set)
								navigate("/view_set")
							}}
						/>
					</Grid.Col>
				))}
				{sets?.length === 0 && (
					<Text>
						There are no sets. <Link to={"/add_set"}>Create a new set</Link>
					</Text>
				)}
			</Grid>
		</Container>
	)
}
