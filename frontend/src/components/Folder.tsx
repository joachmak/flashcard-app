import { Row, Collapse } from "antd"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../App"
import { IFolder, ISet } from "../utils/interfaces"
import SetCard from "./SetCard"

const { Panel } = Collapse

export default function Folder(props: IFolder) {
	const context = useContext(AppContext)
	const [sets] = useState<ISet[]>([])
	const navigate = useNavigate()
	let childrenCount = 0
	return (
		<>
			<Collapse style={{ marginBottom: 5 }}>
				<Panel header={"Folder name (" + childrenCount + " sets)"} key="1">
					<Row gutter={[5, 5]}>
						{context &&
							sets.map((set) => (
								<SetCard
									set={set}
									onClick={() => {
										context.setSet(set || [])
										navigate("/view_set")
									}}
								/>
							))}
					</Row>
				</Panel>
			</Collapse>
		</>
	)
}
