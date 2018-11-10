import * as firebase from 'firebase'
import uid from 'uid'

import ICollection from '../interfaces/ICollection'
import IDocument from '../interfaces/IDocument'

const capitalize = str => str.replace(/\b\w/g, letter => letter.toUpperCase())

class DocumentsService {
    public static async getlAllDocuments() {
        const documents: IDocument[] = await this.getDocuments()
        return this.formatted(documents)
    }

    public static async getDocumentById(id: string) {
        const documents: IDocument[] = await this.getDocuments()

        return this.formatted(documents).filter((document: IDocument) => document.id === id)[0]
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

    public static store(level: string, category: string, folder:string, file: any) {
        const type: string = file.type.split('/')[1]
        const name: string = file.name.split('.')[0]
        const uuid = uid(10)
        let url: string = ""

        switch(capitalize(level)) {
            case 'Worksheets':
                url = `Material/${capitalize(level)}/${capitalize(category)}/${file.name}`
                break;
            default:
                if(folder !== "") {
                    url = `Material/${capitalize(level)}/${capitalize(category)}-${capitalize(level)}/${capitalize(folder)}/${file.name}`
                }
                else {
                    url = `Material/${capitalize(level)}/${capitalize(category)}-${capitalize(level)}/${file.name}`
                }
        }
        
        const reference = firebase.storage().ref(url)
        const task = reference.put(file)

        task.on('state_changed', snapshop => {
            const database = firebase.database()
            database.ref(`documents/${uuid}`).set({
                category: category.toLowerCase(),
                folder: folder.toLowerCase(),
                id: uuid,
                level: level.toLowerCase(),
                name,
                type: type.toLowerCase(),
                url
            })
        })
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