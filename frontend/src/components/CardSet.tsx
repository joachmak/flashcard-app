import { FileTextOutlined } from "@ant-design/icons"
import { Card, Col } from "antd"
import { ISet } from "../interfaces"

export default function CardSet(props: ISet) {
	let styles = {
		date: {
			margin: 0,
		},
	}
	return (
		<Col span={6}>
			<a href="/">
				<Card
					title={props.title}
					extra={
						<>
							<FileTextOutlined /> {Math.floor(Math.random() * 100)} cards
						</>
					}
				>
					<p>
						<i>"{props.description}"</i>
					</p>
					<div>
						<p style={styles.date}>
							<b>Date added:</b> {new Date(props.created_date).toLocaleDateString("no-NB")}
						</p>
						<p style={styles.date}>
							<b>Last edited:</b>{" "}
							{new Date(props.last_updated_date).toLocaleDateString("no-NB", {
								year: "numeric",
								month: "numeric",
								day: "numeric",
								hour: "2-digit",
								minute: "2-digit",
							})}
						</p>
					</div>
				</Card>
			</a>
		</Col>
	)
}
