import "./App.css"
import { Routes, Route } from "react-router-dom"
import Home from "./domain/Home"
import AddSet from "./domain/AddSet"
import Navbar from "./components/Navbar"
import { createContext, useState } from "react"
import { IAppContext, ISet } from "./utils/interfaces"
import CardOverview from "./domain/CardOverview"
import Practice from "./domain/Practice"

export const AppContext = createContext<IAppContext | null>({
	set: undefined,
	setSet: (_) => {},
})

function App() {
	const [set, setSet] = useState<ISet | undefined>(undefined)

	return (
		<div className="App">
			<AppContext.Provider value={{ set, setSet }}>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/add_set" element={<AddSet />} />
					<Route path="/view_set" element={<CardOverview />} />
					<Route path="/practice" element={<Practice />} />
				</Routes>
			</AppContext.Provider>
		</div>
	)
}

export { App }
