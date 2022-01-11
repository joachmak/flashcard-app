import { FileTextOutlined } from '@ant-design/icons';
import { Row, Col, Collapse, Card, Input } from 'antd';
import { setgid } from 'process';
import { ReactNode, useEffect, useState } from 'react';

const { Search } = Input;
const { Panel } = Collapse;
const axios = require("axios")

interface folderProps {
    name: string;
    created_date: Date;
    last_updated_date: Date;
    children: ReactNode[] | ReactNode;
}

interface setProps {
    title: string;
    description: string;
    created_date: Date;
    last_updated_date: Date;
}

function CardSet(props: setProps) {
    let styles = {
        date: {
            margin: 0,
        }
    }
    return (
        <Col span={6}>
            <a href="#">
                <Card title={props.title} extra={<><FileTextOutlined /> {Math.floor(Math.random() * 100)} cards</>} >
                    <p><i>"{props.description}"</i></p>
                    <div>
                        <p style={styles.date}><b>Date added:</b> {new Date(props.created_date).toLocaleDateString("no-NB")}</p>
                        <p style={styles.date}><b>Last edited:</b> {new Date(props.last_updated_date).toLocaleDateString("no-NB", { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: "2-digit" })}</p>
                    </div>
                </Card>
            </a>
        </Col>
    )
} 

function Folder(props: folderProps) {
    const [sets, setSets] = useState<setProps[]>([])
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/learning/sets/", {
            auth: {
                username: "joachim",
                password: "Newfoxnewme2417"
            }
        }).then((res: any) => {
            setSets(res.data)
        })
    }, [])
    let childrenCount = 0
    if (Array.isArray(props.children)) {
        childrenCount = props.children.length   
    } else if (props.children) {
        childrenCount = 1
    }
    return (
        <Collapse style={{marginBottom: 5}}>
            <Panel header={"Folder name (" + childrenCount + " sets)"} key="1">
                <Row gutter={[5, 5]}>
                    {sets.map(set => <CardSet title={set.title} description={set.description} created_date={set.created_date} last_updated_date={set.last_updated_date}/>)}
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
            <Folder name="Folder 1" created_date={new Date()} last_updated_date={new Date()} >
                <CardSet title={"Title"} description={"description"} created_date={new Date()} last_updated_date={new Date()} />
            </Folder>
        </div>
    )
}
