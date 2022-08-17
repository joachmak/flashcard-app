import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import { App } from "./App"
import reportWebVitals from "./reportWebVitals"
import { BrowserRouter } from "react-router-dom"
import { MantineProvider } from "@mantine/core"
import { NotificationsProvider } from "@mantine/notifications"

ReactDOM.render(
	<React.StrictMode>
		<MantineProvider theme={{ colorScheme: "dark" }} withGlobalStyles withNormalizeCSS>
			<NotificationsProvider position="top-center" limit={5}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</NotificationsProvider>
		</MantineProvider>
	</React.StrictMode>,
	document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
