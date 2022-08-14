import "./App.css"
import { Routes, Route } from "react-router-dom"
import Home from "./domain/Home"
import AddSet from "./domain/AddSet"
import Navbar from "./components/Navbar"
import { createContext, useState } from "react"
import { IAppContext, ISet } from "./utils/interfaces"
import ViewSet from "./domain/ViewSet"

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
					<Route path="/view_set" element={<ViewSet />} />
				</Routes>
			</AppContext.Provider>
		</div>
	)
}

export { App }
