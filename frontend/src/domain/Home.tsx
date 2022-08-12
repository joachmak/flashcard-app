import Search from "antd/lib/input/Search"
import CardSet from "../components/CardSet"
import Folder from "../components/Folder"

export default function Home() {
	return (
		<div style={{ padding: 5 }}>
			<h1>Set and folder overview</h1>
			<Search placeholder="Search sets/folders" style={{ width: 250, marginBottom: 5 }} />
			<Folder name="Folder 1" created_date={new Date()} last_updated_date={new Date()}>
				<CardSet
					title={"Title"}
					description={"description"}
					created_date={new Date()}
					last_updated_date={new Date()}
				/>
			</Folder>
		</div>
	)
}
