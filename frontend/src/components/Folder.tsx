import { Row, Collapse } from "antd"
import { useState } from "react"
import { IFolder, ISet } from "../interfaces"
import CardSet from "./CardSet"
import Navbar from "./Navbar"

const { Panel } = Collapse

export default function Folder(props: IFolder) {
	const [sets] = useState<ISet[]>([])
	let childrenCount = 0
	return (
		<>
			<Navbar />
			<Collapse style={{ marginBottom: 5 }}>
				<Panel header={"Folder name (" + childrenCount + " sets)"} key="1">
					<Row gutter={[5, 5]}>
						{sets.map((set) => (
							<CardSet
								title={set.title}
								description={set.description}
								created_date={set.created_date}
								last_updated_date={set.last_updated_date}
							/>
						))}
					</Row>
				</Panel>
			</Collapse>
		</>
	)
}
