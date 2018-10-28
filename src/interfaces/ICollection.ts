import IDocument from "./IDocument";

export default interface ICollection {
    group: string
    documents: IDocument[]
}