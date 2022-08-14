import { Typography } from "antd"
import Search from "antd/lib/input/Search"
import Title from "antd/lib/typography/Title"
import { useContext, useEffect, useState } from "react"
import { createUseStyles } from "react-jss"
import { Link, useNavigate } from "react-router-dom"
import { AppContext } from "../App"
import SetCard from "../components/SetCard"
import { getSets } from "../utils/fetch"
import { ISet } from "../utils/interfaces"

const useStyles = createUseStyles({
	setContainer: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
	},
})

export default function Home() {
	const context = useContext(AppContext)
	const navigate = useNavigate()
	const [sets, setSets] = useState<ISet[] | undefined>(undefined)
	const classes = useStyles()
	useEffect(() => {
		getSets()
			.then((res) => setSets(res))
			.catch((err) => console.log(err))
	}, [])

	return (
		<div style={{ padding: 5 }}>
			<Title level={2}>Set and folder overview</Title>
			<Search placeholder="Search sets/folders" style={{ width: 250, marginBottom: 5 }} />
			<Title level={3}>Sets</Title>
			<div className={classes.setContainer}>
				{sets &&
					context &&
					sets.map((set) => (
						<SetCard
							key={set.id}
							set={set}
							onClick={() => {
								context.setSet(set || [])
								navigate("/view_set")
							}}
						/>
					))}
				{sets && sets.length === 0 && (
					<Typography>
						There are no sets. <Link to={"/add_set"}>Create a new set</Link>
					</Typography>
				)}
			</div>
		</div>
	)
}
