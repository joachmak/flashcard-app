import { ICard, ISet } from "./interfaces"

const HEADERS = {
	Accept: "application/json",
	"Content-Type": "application/json",
}

// SETS

export async function deleteSet(id: number) {
	return await fetch(process.env.REACT_APP_API_URL + "/learning/sets/" + id, {
		method: "DELETE",
		headers: HEADERS,
	})
}

export async function getSets() {
	const res = await fetch(process.env.REACT_APP_API_URL + "/learning/sets", {
		method: "GET",
		headers: HEADERS,
	})
	const actualRes = await res.json()
	return actualRes
}

export async function createSet(title: string, description: string) {
	const set: ISet = {
		title: title,
		description: description,
		created_date: new Date(),
		last_updated_date: new Date(),
	}
	return await fetch(process.env.REACT_APP_API_URL + "/learning/sets/", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(set),
	})
}

// CARDS
export async function createManyCards(cards: ICard[]) {
	console.log(JSON.stringify(cards))
	return await fetch(process.env.REACT_APP_API_URL + "/learning/cards/", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(cards),
	})
}