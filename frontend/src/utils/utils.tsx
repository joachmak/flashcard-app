import { LATEX_DELIMITER } from "./constants"

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

export function parseLatex(text: string): JSX.Element {
	let res = ""
	const textArr = text.split(LATEX_DELIMITER)
	const katex = require("katex")
	for (let i = 0; i < textArr.length; i++) {
		if (i % 2 === 0) res += textArr[i]
		else {
			try {
				res += katex.renderToString(textArr[i])
			} catch (error) {
				// don't render anything on error
				continue
			}
		}
	}
	return <div dangerouslySetInnerHTML={{ __html: res }}></div>
}
