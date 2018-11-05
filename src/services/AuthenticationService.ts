import * as firebase from 'firebase'

class AuthenticationService {
    public static session: object | null = null

    public static async login(email: string, password: string) {
        try {
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
            const auth = await firebase.auth()
            const signIn = await auth.signInWithEmailAndPassword(email, password)
            if(signIn.user) {
                AuthenticationService.session = signIn.user
                return true
            }
            else {
                return false
            }
        }
        catch (e) {
            return false
        }
    }

    public static listener() {
        firebase.auth().onAuthStateChanged(user => {
            if(user) {
                AuthenticationService.session = user
            }
            else {
                AuthenticationService.session = null
            }
        })
    }

    public static async logout() {
        const auth = await firebase.auth()
        await auth.signOut()
        
        AuthenticationService.session = null
    }
}

export default AuthenticationService