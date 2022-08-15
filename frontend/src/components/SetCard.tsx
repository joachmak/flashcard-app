import { FileTextOutlined, DeleteOutlined } from "@ant-design/icons"
import { Button, Card, Col, Typography } from "antd"
import { deleteSet } from "../utils/fetch"
import { ISet } from "../utils/interfaces"

interface Props {
	set: ISet
	onClick: () => void
}

export default function SetCard(props: Props) {
	let styles = {
		date: {
			margin: 0,
		},
	}
	return (
		<Col span={6}>
			<Card
				title={
					<Button style={{ paddingLeft: 0 }} type="link" onClick={props.onClick}>
						{props.set.title}
					</Button>
				}
				extra={
					<>
						<FileTextOutlined /> {props.set.cards ? props.set.cards.length : 0} card
						{props.set.cards?.length !== 1 && "s"}
					</>
				}
				onClick={props.onClick}
			>
				<Typography>
					<i>"{props.set.description}"</i>
				</Typography>
				<div>
					<Typography style={styles.date}>
						<b>Date added:</b> {new Date(props.set.created_date).toLocaleDateString("no-NB")}
					</Typography>
					<Typography style={styles.date}>
						<b>Last edited:</b>{" "}
						{new Date(props.set.last_updated_date).toLocaleDateString("no-NB", {
							year: "numeric",
							month: "numeric",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</Typography>
					<Button
						onClick={() => {
							if (props.set.id) {
								deleteSet(props.set.id).then(() => window.location.reload())
							}
						}}
						danger
						icon={<DeleteOutlined />}
						type="text"
						style={{ transform: "translateX(-8px)" }}
					/>
				</div>
			</Card>
		</Col>
	)
}
