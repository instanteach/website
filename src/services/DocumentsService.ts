import * as firebase from 'firebase'
import ICollection from '../interfaces/ICollection'
import IDocument from '../interfaces/IDocument'

class DocumentsService {
    public static async getlAllDocuments() {
        const documents: IDocument[] = await this.getDocuments()
        return this.formatted(documents)
    }

    public static async getDocumentById(uid: string) {
        const documents: IDocument[] = await this.getDocuments()

        return this.formatted(documents.filter((document: IDocument) => document.id === uid))
    }

    public static async getDocumentsByGroup(key: string) {
        const documents: IDocument[] = await this.getDocuments()
        
        return this.group(this.formatted(documents), key)
    }

    public static group(array: IDocument[], key: string): ICollection[] {
        const groups: object = Object.create({})
        const grouped: ICollection[] = []

        array.map((e: IDocument) => {
            const element: IDocument = {...e}

            if(!groups[element[key]]) {
                groups[element[key]] = []
                grouped.push({ group: element[key], documents: groups[element[key]] })
            }
            groups[element[key]].push(element)
        })

        return Array.from(grouped)
    }

    public static async download(url: string) {
        const storage = await firebase.storage()
        const reference = await storage.ref(url)

        return reference.getDownloadURL()
    }

    private static async getDocuments() {
        const database = await firebase.database()
        const reference = await database.ref()
        const child = await reference.child('documents')
        const snapshot = await child.once('value')

        return snapshot.val()
    }

    private static formatted(object: IDocument[]): IDocument[] {
        return Array.from(Object.keys(object), key => object[key])
    }
}

export default DocumentsService