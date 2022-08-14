import { Dispatch, ReactNode, SetStateAction } from "react"

export interface IFolder {
	id?: number
	name: string
	created_date: Date
	last_updated_date: Date
	children: ReactNode
}

export interface ISet {
	id?: number
	title: string
	description: string
	created_date: Date
	last_updated_date: Date
	cards?: ICard[]
}

export interface ICard {
	id?: number
	term: string
	definition: string
	score?: number
	set?: number
	lastPracticed?: Date
}

export interface UserAuth {
	username?: string
	access_token?: string
	refresh_token?: string
}

export interface IAppContext {
	set: ISet | undefined
	setSet: Dispatch<SetStateAction<ISet | undefined>>
}