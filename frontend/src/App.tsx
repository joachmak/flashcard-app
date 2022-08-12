import "./App.css"
import Sets from "./components/sets/Sets"
import { Routes, Route, useNavigate } from "react-router-dom"
import Login from "./components/login/Login"
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import { UserAuth } from "./utils/types"
import { reauthenticate } from "./utils/authentication"

const userValue: UserAuth = {}
const setUserValue: Dispatch<SetStateAction<UserAuth>> = () => {}
const UserContext = createContext({ user: userValue, setUser: setUserValue })

function App() {
	const [user, setUser] = useState<UserAuth>({})
	useEffect(() => {
		console.log(user)
	}, [user])

	return (
		<div className="App">
			<UserContext.Provider value={{ user: user, setUser: setUser }}>
				<Routes>
					<Route path="/">
						<Sets />
					</Route>
				</Routes>
			</UserContext.Provider>
		</div>
	)
}

function AuthenticatedRoute({ children }: { children: any }) {
	let navigate = useNavigate()
	const userContext = useContext(UserContext)
	const user = userContext.user
	const [loading, setLoading] = useState(true)
	if (!user.username || !user.access_token || !user.refresh_token) {
		navigate("/")
	}
	useEffect(() => {
		reauthenticate(user.refresh_token!)
			.then((result) => {
				user.access_token = result.access
				userContext.setUser(user)
			})
			.catch((e) => {
				console.log(e)
				navigate("/")
			})
			.finally(() => {
				setLoading(false)
			})
		return () => {
			setLoading(false)
		}
	}, [navigate, user, userContext])
	if (loading) {
		return <></>
	}
	return children
}

export { App, UserContext }
