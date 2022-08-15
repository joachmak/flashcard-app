export function incrementScore(oldScore: number) {
	let newScore = oldScore + 35
	if (newScore > 100) newScore = 100
	return newScore
}

export function decrementScore(oldScore: number) {
	let newScore = oldScore - 50
	if (newScore < 0) newScore = 0
	return newScore
}
