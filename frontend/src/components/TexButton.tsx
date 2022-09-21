import { Button, Tooltip } from "@mantine/core"
import { MutableRefObject } from "react"
import { LATEX_DELIMITER } from "../utils/constants"

interface Props {
	text: string
	setTextFunction: (txt: string) => void
	textAreaRef: MutableRefObject<HTMLTextAreaElement | null>
}

export default function TextButton(props: Props) {
	return (
		<Tooltip label="Add LaTeX formatting">
			<Button
				tabIndex={1}
				onClick={() => {
					props.setTextFunction(props.text + LATEX_DELIMITER + " " + LATEX_DELIMITER)
					props.textAreaRef.current?.focus()
				}}
				variant="outline"
			>
				TeX
			</Button>
		</Tooltip>
	)
}
