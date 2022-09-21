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
	last_practiced?: Date
	images_term?: IImage[]
	images_definition?: IImage[]
}

export interface IImage {
	id?: number
	image: File | string
	is_term_image: boolean
	card?: number // id of the card that the image belongs to
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
