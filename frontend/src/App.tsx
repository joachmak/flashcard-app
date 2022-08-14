import "./App.css"
import { Routes, Route } from "react-router-dom"
import Home from "./domain/Home"
import AddSet from "./domain/AddSet"
import Navbar from "./components/Navbar"

function App() {
	return (
		<div className="App">
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/add_set" element={<AddSet />} />
			</Routes>
		</div>
	)
}

export { App }
