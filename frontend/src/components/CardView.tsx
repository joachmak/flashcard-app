import { Card, Group, ScrollArea, Text } from "@mantine/core"
import { useEffect, useRef, useState } from "react"
import { createUseStyles } from "react-jss"
import { ICard } from "../utils/interfaces"
import { parseLatex } from "../utils/utils"

const useStyles = createUseStyles({
	container: {
		display: "flex",
		alignItems: "stretch",
	},
	card: {
		flex: 1,
		marginBottom: 30,
		paddingTop: 0,
	},
})

export default function CardView(props: { card: ICard }) {
	const classes = useStyles()
	const textRef = useRef<HTMLDivElement>(null)
	const [height, setHeight] = useState<number>(0)
	useEffect(() => {
		if (textRef.current) setHeight(textRef.current.getBoundingClientRect().height)
	}, [textRef])
	console.log(height)
	return (
		<Group className={classes.container}>
			<Card shadow="sm" className={classes.card} withBorder>
				<ScrollArea style={{ height: height > 150 ? 150 : "" }} type="auto" offsetScrollbars>
					<Text ref={textRef}>{parseLatex(props.card.term)}</Text>
				</ScrollArea>
				<Text>
					<i>Strength score: {props.card.score}</i>
				</Text>
				<Text>
					<i>
						Last practiced:{" "}
						{props.card.last_practiced
							? new Date(props.card.last_practiced).toLocaleString()
							: "Never"}
					</i>
				</Text>
			</Card>
			<Card shadow="sm" className={classes.card} withBorder>
				<Text>{parseLatex(props.card.definition)}</Text>
			</Card>
		</Group>
	)
}
