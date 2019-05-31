export default interface IUser {
	createdAt?:string
	createnWith?:string
	displayName:string
	email:string
	emailVerified:boolean
	isAdmin:boolean
	photoURL:string
	provider?:string
	publicEmail:string
	uid:string
	updatedAt?:string
}