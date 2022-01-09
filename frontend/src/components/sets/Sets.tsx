import { FileTextOutlined } from '@ant-design/icons';
import { Row, Col, Collapse, Card, Input } from 'antd';
import { ReactNode } from 'react';

const { Search } = Input;
const { Panel } = Collapse;

interface folderProps {
    name: string;
    created_date: Date;
    last_updated_date: Date;
    children: ReactNode[];
}

interface setProps {
    title: string;
    description: string;
    created_date: Date;
    last_edited_date: Date;
}

function CardSet(props: setProps) {
    let styles = {
        dateContainer: {
            lineHeight: 0.5
        }
    }
    return (
        <Col span={6}>
            <a href="#">
                <Card title="Set name" extra={<><FileTextOutlined /> {Math.floor(Math.random() * 100)} cards</>} >
                    <p><i>"In elit tempor laborum cillum. Cupidatat adipisicing consequat cupidatat nulla officia consectetur est."</i></p>
                    <div style={styles.dateContainer}>
                        <p><b>Date added:</b> 25.12.2021</p>
                        <p><b>Last edited:</b> 30.12.2021</p>
                    </div>
                </Card>
            </a>
        </Col>
    )
} 

function Folder(props: folderProps) {
    let childrenCount = props.children ? props.children.length : 0
    return (
        <Collapse style={{marginBottom: 5}}>
            <Panel header={"Folder name (" + childrenCount + " sets)"} key="1">
                <Row gutter={[5, 5]}>
                    {props.children}
                </Row>
            </Panel>
        </Collapse>
    )
}


export default function Sets() {
    return (
        <div style={{padding: 5}}>
            <h1>Set and folder overview</h1>
            <Search placeholder="Search sets/folders" style={{ width: 250, marginBottom: 5, }} />
            <Folder >
                <CardSet />
                <CardSet />
                <CardSet />
                <CardSet />
            </Folder>
            <Folder >
                <CardSet />
                <CardSet />
                <CardSet />
                <CardSet />
                <CardSet />
                <CardSet />
            </Folder>
            <Folder >
                <CardSet />
                <CardSet />
                <CardSet />
                <CardSet />
                <CardSet />
                <CardSet />
            </Folder>
        </div>
    )
}
