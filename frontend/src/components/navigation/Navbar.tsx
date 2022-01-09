import { Menu } from "antd";
import {
  HomeOutlined,
  ContainerOutlined,
  CopyOutlined,
  FileAddOutlined,
  FolderAddOutlined
} from "@ant-design/icons";

const { SubMenu } = Menu;

export default function Navbar() {
    
    return (
    <>
      <Menu
        mode="horizontal"
      >
        <Menu.Item key="home" icon={<HomeOutlined />}>
          Home
        </Menu.Item>
        <SubMenu key="SubMenu" icon={<ContainerOutlined />} title="Folders/Sets">
            <Menu.Item key="view" icon={<CopyOutlined />}>Overview</Menu.Item>
            <Menu.Item key="addFolder" icon={<FolderAddOutlined />}>Add new folder</Menu.Item>
            <Menu.Item key="addSet" icon={<FileAddOutlined />}>Add new set</Menu.Item>
        </SubMenu>
      </Menu>
    </>
  );
}
