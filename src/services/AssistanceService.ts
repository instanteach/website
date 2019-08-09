import * as firebase from 'firebase'

import AuthenticationService from './AuthenticationService'

/*
 * This class is to create helper functions that could be reused easily into the application
 *
*/
class AssistanceService {
	// Check if the displayName property of an user is empty
	public static isDisplayNameEmpty(displayName)
	{
		if(displayName === null || displayName === "" || displayName <= 3) {
			return true
		}

		return false
	}

	// Compare navigation pathname with the param page
	public static compareNavigationPathname(page: string = "") {
		return window.location.pathname === page
	}

	// Verify Firebase session state when the app load first time
	public static checkFirebaseSessionWhenAppIsLoaded() {
		const isLoginPage = AssistanceService.compareNavigationPathname("/login")
		firebase.auth().onAuthStateChanged(user => {
			if(!isLoginPage) {
				if(!user) {
					(async () => {
						await AuthenticationService.logout()
					})()
				}
			}
		})
	}
}

export default AssistanceService