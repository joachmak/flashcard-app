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
            width: "100%",
            marginBottom: 5,
            margin: "5px auto",
            display: "block",
        },
        title: {
            lineHeight: 0.2,
        },
        line: {
            animationName: "blink",
            animationDuration: "1.2s",
            animationIterationCount: "infinite",
        }
    }
    // Cosmetic
    let words = ["fancier", "smarter", "prettier", "cooler", "faster", "safer", "better"]
    const [index, setIndex] = useState(0); // Word index (for words-list)
    const [word, setWord] = useState(words[(words.length - 1)]); // Current text being displayed
    const [tick, setTick] = useState(0); // switches between 0 and 1 to trigger useEffect
    const [animationPhase, setAnimationPhase] = useState(2); // 0: delete old, 1: append new, 2: static
    const [timer, setTimer] = useState(0); // To time animation phases
    useEffect(() => {
        let newWord = words[index];
        if (animationPhase === 0) { // Delete
            if (word.length > 0) {
                setWord(word.slice(0, word.length - 1));
                return;
            }
            setAnimationPhase(1);
        }
        if (animationPhase === 1) { // Append
            if (word !== newWord) {
                setWord(word + newWord[timer]);
                setTimer(timer + 1);
                return;
            }
            setTimer(0);
            setAnimationPhase(2);
        }
        if (animationPhase === 2) { // Wait while displaying
            if (timer < 10) {
                setTimer(timer + 1);
                return;
            }
            setTimer(0);
            setIndex(index >= words.length - 1 ? 0 : index + 1);
            setAnimationPhase(0);
            setTick(1 - tick);
        }
    }, [tick]) // eslint-disable-line
    useEffect(() => {
        const id = setInterval(() => setTick((oldCount) => 1 - oldCount), 100);
        return () => {
            clearInterval(id);
        };
    }, []);

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
                    <h5>To the flashcard-app that is (most likely not) <span style={{color: "#1890FF"}}>{word}</span><span style={styles.line}>|</span> than other flashcard-apps</h5>
                </div>
                <Input style={{...styles.input, borderColor: error ? "red" : ""}} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} prefix={<UserOutlined />} />
                <Input.Password style={{...styles.input, borderColor: error ? "red" : ""}} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} prefix={<LockOutlined />} />
                <Button loading={loading} style={styles.btn} type="primary" onClick={() => handleSubmit()}>Log in</Button>
                <Button loading={loading} style={styles.btn} type="primary" ghost>Register</Button>
            </Card>
            </div>
        </>
    )
}