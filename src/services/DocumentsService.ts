import * as firebase from 'firebase'
import uid from 'uid'

import ICollection from '../interfaces/ICollection'
import IDocument from '../interfaces/IDocument'
import AuthenticationService from './AuthenticationService';

const capitalize = str => str.replace(/\b\w/g, letter => letter.toUpperCase())

const orderByLevel = (a:any, b:any):number => {
	if(a.order > b.order) {
		return 1;
	}
	else if(a.order < b.order) {
		return -1;
	}
	return 0;
}

const orderByCategory = (a:any, b:any):number => {
	if(a.suborder > b.suborder) {
		return 1;
	}
	else if(a.suborder < b.suborder) {
		return -1;
	}
	return 0;
}

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
				
				if(key === "level") {
					return this.group(this.formatted(documents).sort(orderByLevel), key)	
				}
				else if(key === "category") {
					return this.group(this.formatted(documents).sort(orderByCategory), key)
				}
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
				const orders = ['beginner', 'intermediate', 'advanced', 'worksheets']
				const suborders = ['speaking', 'writing', 'listening', 'reading', 'vocabulary', 'grammar', 'kids']
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
								order: orders.indexOf(level.toLowerCase()),
								suborder: suborders.indexOf(category.toLowerCase()),
                type: type.toLowerCase(),
                url
            })
        })
		}
		
		public static async remove(documentId: string)
		{
			if(AuthenticationService.session.isAdmin) {
				const storage = firebase.storage()
				const ref = storage.ref()
				const document = await this.getDocumentById(documentId)
				
				ref.child(document.url).delete();
				firebase.database().ref(`documents/${documentId}`).remove()
				return true
			}
			return false
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