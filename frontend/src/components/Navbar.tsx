import { Menu } from "antd"
import {
	HomeOutlined,
	ContainerOutlined,
	FileAddOutlined,
	FolderAddOutlined,
} from "@ant-design/icons"
import { useNavigate } from "react-router-dom"

const { SubMenu } = Menu

export default function Navbar() {
	const navigate = useNavigate()
	return (
		<>
			<Menu mode="horizontal" defaultSelectedKeys={["home"]}>
				<Menu.Item onClick={() => navigate("/")} key="home" icon={<HomeOutlined />}>
					Home
				</Menu.Item>
				<SubMenu key="SubMenu" icon={<ContainerOutlined />} title="Folders/Sets">
					<Menu.Item key="addFolder" icon={<FolderAddOutlined />}>
						Add new folder
					</Menu.Item>
					<Menu.Item onClick={() => navigate("/add_set")} key="addSet" icon={<FileAddOutlined />}>
						Add new set
					</Menu.Item>
				</SubMenu>
			</Menu>
		</>
	)
}
