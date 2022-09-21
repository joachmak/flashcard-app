import { faCode } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Group, Popover, Select, Tooltip } from "@mantine/core"
import { MutableRefObject, useState } from "react"
import { CODE_DELIMITER, SUPPORTED_LANGUAGES } from "../utils/constants"

interface Props {
	text: string
	setTextFunction: (txt: string) => void
	textAreaRef: MutableRefObject<HTMLTextAreaElement | null>
}

export default function CodeBlockButton(props: Props) {
	const [isProgrammingPopoverOpen, setIsProgrammingPopoverOpen] = useState<boolean>(false)
	const [programmingLanguage, setProgrammingLanguage] = useState<string | null>(null)
	return (
		<Popover
			withArrow
			position="top"
			opened={isProgrammingPopoverOpen}
			onChange={setIsProgrammingPopoverOpen}
		>
			<Popover.Target>
				<Button
					leftIcon={<FontAwesomeIcon icon={faCode} />}
					tabIndex={1}
					variant="outline"
					onClick={() => setIsProgrammingPopoverOpen((o) => !o)}
				>
					Code block
				</Button>
			</Popover.Target>
			<Popover.Dropdown>
				<Group>
					<Select
						value={programmingLanguage}
						onChange={setProgrammingLanguage}
						placeholder="Coding language"
						searchable
						nothingFound="Not supported ):"
						data={SUPPORTED_LANGUAGES}
						variant="unstyled"
					/>
					<Tooltip label={"Add code block"}>
						<Button
							tabIndex={1}
							disabled={!programmingLanguage}
							onClick={() => {
								props.setTextFunction(
									props.text + CODE_DELIMITER + programmingLanguage + "\n\n" + CODE_DELIMITER
								)
								props.textAreaRef?.current?.focus()
							}}
							variant="subtle"
						>
							Add
						</Button>
					</Tooltip>
				</Group>
			</Popover.Dropdown>
		</Popover>
	)
}
