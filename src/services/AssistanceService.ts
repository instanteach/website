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
}

export default AssistanceService