import Search from "antd/lib/input/Search"
import Title from "antd/lib/typography/Title"
import { useEffect, useState } from "react"
import { createUseStyles } from "react-jss"
import CardSet from "../components/CardSet"
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
					sets.map((set) => (
						<CardSet
							id={set.id}
							key={set.id}
							title={set.title}
							description={set.description}
							created_date={set.created_date}
							last_updated_date={set.last_updated_date}
							cards={set.cards}
						/>
					))}
			</div>
		</div>
	)
}
