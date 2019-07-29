export default interface IDocument {
    id: string
    name: string
    level: string
    category: string
    folder: string
    type: string
		url: string
		order?: number
		suborder?: number
}