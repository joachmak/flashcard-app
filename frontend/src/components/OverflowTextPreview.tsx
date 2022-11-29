import { ScrollArea, Text } from "@mantine/core"
import { ReactNode, useEffect, useRef, useState } from "react"
import {createUseStyles} from "react-jss";

const useStyles = createUseStyles({
	container: {
		"& ul, & ol": {
			margin: "-15px 0",
			lineHeight: 0.5,
		},
		"& li": {
			margin: 0,
			padding: 0,
		},
		"& p": {
			margin: 0,
		}
	}
})

export function OverflowTextPreview(props: { children: ReactNode }) {
	const textRef = useRef<HTMLDivElement>(null)
	const [height, setHeight] = useState<number>(0)
	const classes = useStyles()
	useEffect(() => {
		if (textRef.current) setHeight(textRef.current.getBoundingClientRect().height)
	}, [textRef])
	return (
		<ScrollArea className={classes.container} style={{ height: height > 150 ? 150 : "" }} type="auto" offsetScrollbars>
			<Text ref={textRef}>{props.children}</Text>
		</ScrollArea>
	)
}
