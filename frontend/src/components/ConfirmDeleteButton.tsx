import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, ButtonVariant, Group, Popover, Text } from "@mantine/core"
import { useState } from "react"

interface Props {
	onDelete: () => void
	deleteBtnText: string
	buttonVariant?: ButtonVariant
}

export default function ConfirmDeleteButton(props: Props) {
	const [isOpen, setIsOpen] = useState(false)
	return (
		<Popover
			onChange={setIsOpen}
			opened={isOpen}
			width={300}
			trapFocus
			position="top"
			withArrow
			shadow="md"
		>
			<Popover.Target>
				<Button
					onClick={() => setIsOpen(true)}
					leftIcon={<FontAwesomeIcon icon={faTrash} />}
					variant={props.buttonVariant || "outline"}
					color="red"
				>
					{props.deleteBtnText}
				</Button>
			</Popover.Target>
			<Popover.Dropdown
				sx={(theme) => ({
					background: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
				})}
			>
				<Text style={{ textAlign: "center" }} pb="sm">
					Confirm delete
				</Text>
				<Group position="center" spacing="xs">
					<Button onClick={() => setIsOpen(false)} variant="filled">
						Cancel
					</Button>
					<Button
						onClick={() => {
							setIsOpen(false)
							props.onDelete()
						}}
						color="red"
						variant="outline"
						leftIcon={<FontAwesomeIcon icon={faTrash} />}
					>
						Delete
					</Button>
				</Group>
			</Popover.Dropdown>
		</Popover>
	)
}
