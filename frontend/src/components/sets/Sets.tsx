import { PropertySafetyFilled } from '@ant-design/icons';
import { Row, Col, Collapse, Card, Input } from 'antd';

const { Search } = Input;
const { Panel } = Collapse;

function CardSet() {
    return (
        <Col span={6}>
            <Card title="Set name" extra={<a href="#">Detailed view</a>} >
                <p><i>"In elit tempor laborum cillum. Cupidatat adipisicing consequat cupidatat nulla officia consectetur est."</i></p>
                <p><b>Date added:</b> 25.12.2021</p>
                <p><b>Last edited:</b> 30.12.2021</p>
            </Card>
        </Col>
    )
}

function Folder(props: {children: any}) {
    let childrenCount = props.children.length
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
        </div>
    )
}
