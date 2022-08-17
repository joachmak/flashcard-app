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

export async function getSets(): Promise<ISet[]> {
	return fetch(process.env.REACT_APP_API_URL + "/learning/sets", {
		method: "GET",
		headers: HEADERS,
	}).then((res) => res.json())
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
		headers: HEADERS,
		body: JSON.stringify(set),
	})
}

export async function patchSet(setId: number, newData: Partial<ISet>) {
	return await fetch(process.env.REACT_APP_API_URL + "/learning/sets/" + setId + "/", {
		method: "PATCH",
		headers: HEADERS,
		body: JSON.stringify(newData),
	})
}

// CARDS
export async function createManyCards(cards: ICard[]) {
	return await fetch(process.env.REACT_APP_API_URL + "/learning/cards/", {
		method: "POST",
		headers: HEADERS,
		body: JSON.stringify(cards),
	})
}

export async function patchCard(cardId: number, newData: Partial<ICard>) {
	return await fetch(process.env.REACT_APP_API_URL + "/learning/cards/" + cardId + "/", {
		method: "PATCH",
		headers: HEADERS,
		body: JSON.stringify(newData),
	})
}

export async function patchManyCards(cards: Partial<ICard>[]) {
	return await fetch(process.env.REACT_APP_API_URL + "/learning/cards/patch_many/", {
		method: "PATCH",
		headers: HEADERS,
		body: JSON.stringify(cards),
	})
}

export async function deleteManyCards(cardIds: number[]) {
	return await fetch(process.env.REACT_APP_API_URL + "/learning/cards/delete_many/", {
		method: "DELETE",
		headers: HEADERS,
		body: JSON.stringify(cardIds),
	})
}
