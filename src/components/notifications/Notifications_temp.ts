import axios from 'axios'
import { isLoggedIn, getToken } from '../login/TokenProvider'
import apiRoutes from '../Routes'

class Notifications {

  protected isLoggedIn: boolean

  constructor() {
    if (isLoggedIn())
      this.isLoggedIn = true
    else
      this.isLoggedIn = false
  }

  /**
   * Calls backend and gets the list of all pending notifications
   *
   * @returns Object
   */
  getNotifications = (): any => {
    const formData = new FormData()
    formData.append('userId', getToken().userId)
    axios.post(apiRoutes.notifications.get, formData)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return { status: 'error', error: error }
      })
  }
}

export default Notifications