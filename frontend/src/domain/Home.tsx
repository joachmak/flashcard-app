import { Container, Grid, Text, Title } from "@mantine/core"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AppContext } from "../App"
import SetCard from "../components/SetCard"
import { getSets } from "../utils/fetch"
import { ISet } from "../utils/interfaces"
import { assignSetContext } from "../utils/utils"

export default function Home() {
	const context = useContext(AppContext)
	const navigate = useNavigate()
	const [sets, setSets] = useState<ISet[]>()
	useEffect(() => {
		getSets()
			.then((res) => setSets(res))
			.catch((err) => console.log(err))
	}, [])
	return (
		<Container>
			<Title order={1} mb="sm">
				Sets
			</Title>
			<Grid grow>
				{sets?.map((set) => (
					<Grid.Col span={6}>
						<SetCard
							key={set.id}
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
