import { ScrollArea, Text } from "@mantine/core"
import { ReactNode, useEffect, useRef, useState } from "react"

export function OverflowTextPreview(props: { children: ReactNode }) {
	const textRef = useRef<HTMLDivElement>(null)
	const [height, setHeight] = useState<number>(0)
	useEffect(() => {
		if (textRef.current) setHeight(textRef.current.getBoundingClientRect().height)
	}, [textRef])
	return (
		<ScrollArea style={{ height: height > 150 ? 150 : "" }} type="auto" offsetScrollbars>
			<Text ref={textRef}>{props.children}</Text>
		</ScrollArea>
	)
}
