import { Container, Grid, Text, Title } from "@mantine/core"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import ErrorMessage from "../components/ErrorMessage"
import Loader from "../components/Loader"
import SetCard from "../components/SetCard"
import { getSets } from "../utils/fetch"
import { ISet } from "../utils/interfaces"

export default function Home() {
	const navigate = useNavigate()
	const [sets, setSets] = useState<ISet[]>()
	const [err, setErr] = useState<string>("")
	useEffect(() => {
		getSets()
			.then((res: ISet[]) => {
				console.log(res)
				setSets(res)
			})
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
			{sets === undefined && !err && <Loader />}
			{err && <ErrorMessage />}
			<Grid grow>
				{sets?.map((set) => (
					<Grid.Col span={6} key={set.id}>
						<SetCard set={set} onClick={() => navigate("/view_set/" + set.id)} />
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
