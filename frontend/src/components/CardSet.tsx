import { FileTextOutlined, DeleteOutlined } from "@ant-design/icons"
import { Button, Card, Col, Typography } from "antd"
import { deleteSet } from "../utils/fetch"
import { ISet } from "../utils/interfaces"

export default function CardSet(props: ISet) {
	let styles = {
		date: {
			margin: 0,
		},
	}
	return (
		<Col span={6}>
			<Card
				title={props.title}
				extra={
					<>
						<FileTextOutlined /> {Math.floor(Math.random() * 100)} cards
					</>
				}
			>
				<Typography>
					<i>"{props.description}"</i>
				</Typography>
				<div>
					<Typography style={styles.date}>
						<b>Date added:</b> {new Date(props.created_date).toLocaleDateString("no-NB")}
					</Typography>
					<Typography style={styles.date}>
						<b>Last edited:</b>{" "}
						{new Date(props.last_updated_date).toLocaleDateString("no-NB", {
							year: "numeric",
							month: "numeric",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</Typography>
					<Button
						onClick={() => {
							if (props.id) {
								deleteSet(props.id).then(() => window.location.reload())
							}
						}}
						danger
						icon={<DeleteOutlined />}
						type="text"
					/>
				</div>
			</Card>
		</Col>
	)
}
