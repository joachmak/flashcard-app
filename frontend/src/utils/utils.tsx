import { Prism } from "@mantine/prism"
import { CODE_DELIMITER, LATEX_DELIMITER } from "./constants"
import { IAppContext, ISet } from "./interfaces"

export function incrementScore(oldScore: number): number {
	let newScore = oldScore + 35
	if (newScore > 100) newScore = 100
	return newScore
}

export function decrementScore(oldScore: number): number {
	let newScore = oldScore - 50
	if (newScore < 0) newScore = 0
	return newScore
}

export function parseCardText(text: string): JSX.Element {
	const textArr = text.split(LATEX_DELIMITER)
	const katex = require("katex")
	return (
		<pre>
			{textArr.map((txt1, i) => {
				if (i % 2 === 0) {
					const codeArr = txt1.split(CODE_DELIMITER)
					return (
						<span key={txt1}>
							{codeArr.map((txt2, j) => {
								if (j % 2 === 0)
									return (
										<span key={"" + i + j} style={{ margin: 0 }}>
											{txt2}
										</span>
									)
								const language = txt2.split("\n")[0]
								return (
									// @ts-ignore
									<Prism key={"" + i + j} noCopy withLineNumbers language={language}>
										{txt2.slice(language.length, txt2.length)}
									</Prism>
								)
							})}
						</span>
					)
				} else {
					return (
						<span
							key={i}
							style={{ margin: 0 }}
							dangerouslySetInnerHTML={{ __html: katex.renderToString(txt1) }}
						></span>
					)
				}
			})}
		</pre>
	)
}

// CONTEXT MANAGEMENT

export function unassignSetContext(context: IAppContext | null) {
	if (context?.set) context.set = undefined
}

export function assignSetContext(context: IAppContext | null, set: ISet) {
	if (context) context.set = set
}
