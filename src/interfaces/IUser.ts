export default interface IUser {
	createdAt?:string
	createdWith?:string
	displayName:string
	email:string
	emailVerified:boolean
	isAdmin:boolean
	photoURL:string
	provider?:string
	uid:string
	updatedAt?:string
}