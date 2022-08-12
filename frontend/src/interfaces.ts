import { ReactNode } from "react"

export interface IFolder {
	name: string
	created_date: Date
	last_updated_date: Date
	children: ReactNode
}

export interface ISet {
	title: string
	description: string
	created_date: Date
	last_updated_date: Date
}
