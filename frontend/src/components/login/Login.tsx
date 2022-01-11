import { Card, Input, Button, message } from "antd"
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useContext, useEffect, useState } from "react";
import { authenticate } from "../../utils/authentication";
import { UserAuth } from "../../utils/types";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";

export default function Login() {
    let styles = {
        container: {
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        card: {
            display: "flex",
            justifyContent: "center",
            minWidth: 550,
        },
        input: {
            marginBottom: 5,
            width: "100%",
        },
        btn: {
            width: "80%",
            marginBottom: 5,
            margin: "5px auto",
            display: "block",
        },
        title: {
            lineHeight: 0.2,
        },
    }
    // Cosmetic
    let words = ["better", "smarter", "prettier", "cooler", "faster", "more secure", "more fancy"]
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
        setIndex(index => (index + 1 >= words.length ? 0 : index + 1));
        }, 1000);
        return () => clearInterval(interval);
    }, [words.length]);

    // Authentication
    const userContext = useContext(UserContext);
    let navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const errorMessage = "Incorrect username or password";
    function delay(time: number) {
        // For testing purposes
        return new Promise(resolve => setTimeout(resolve, time));
      }
    const handleSubmit = async () => {
        try {
            setLoading(true);
            await delay(1000);
            const result = await authenticate(username, password)
            const user: UserAuth = {username: username, access_token: result.access, refresh_token: result.refresh}
            userContext.setUser(user)
            setError(false);
            navigate("/sets");
        } catch (e) {
            message.config({
                duration: 2,
              });
            message.error(errorMessage);
            setError(true);
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <div style={styles.container}>
            <Card style={styles.card}>
                <div style={{textAlign: "center", width: 500}}>
                    <h1 style={styles.title}>Welcome...</h1>
                    <h5>To the flashcard-app that is (most likely not) <span style={{color: "#1890FF"}}>{words[index]}</span> than other flashcard-apps</h5>
                </div>
                <Input style={{...styles.input, borderColor: error ? "red" : ""}} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} prefix={<UserOutlined />} />
                <Input.Password style={{...styles.input, borderColor: error ? "red" : ""}} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} prefix={<LockOutlined />} />
                <Button loading={loading} style={styles.btn} type="primary" onClick={() => handleSubmit()}>Log in</Button>
                <Button loading={loading} style={styles.btn} type="primary" ghost>Register</Button>
            </Card>,
            </div>
        </>
    )
}