import {
  FilesystemDirectory,
  FilesystemEncoding,
  Plugins,
} from "@capacitor/core"
import Axios from "axios" 
import React from "react"
import { getToken, isLoggedIn } from "../login/TokenProvider"
import apiRoutes from "../Routes"

import NotificationEntry from "./NotificationEntry"

type notifications = {
  id: string
  text: string
  action: string
  public_name: string
}

type props = {}
type states = {
  notifications: Array<notifications>
  isStructureNotFound: boolean
  subCategoryStructure: any,
  notificationcount:any,
}

type SubCategoryResponse = {
  categories: Array<string>
  additionalFields: Object
}

class Notifications extends React.Component<props, states> {
  constructor(props: props) {
    super(props)

    if (!isLoggedIn()) window.location.replace("/")

    this.state = {
      notifications: [],
      isStructureNotFound: false,
      subCategoryStructure: null,
      notificationcount:0,
    }
  }

  async componentDidMount() {
    await this.getCategoryStructure()
      .then((data) => data.additionalFields)
      .then((additionalFields) => {
        let subCategories: any = {}
        // retrieve the sub category
        for (const firstProperty in additionalFields) {
          for (const secondProperty in additionalFields[firstProperty][
            "subCategory"
          ]) {
            if (secondProperty === "category") continue
            subCategories[secondProperty] =
              additionalFields[firstProperty]["subCategory"][secondProperty][
                "title"
              ]
          }
        }

        this.setState({ subCategoryStructure: subCategories })
      })

    const formData = new FormData()
    formData.append("userId", getToken().userId)
    Axios.post(apiRoutes.notifications.get, formData)
      .then((response) => {
        if (response.data.status === "success") {
          console.log('response',response.data.notifications)
          this.setState({ notifications: response.data.notifications, notificationcount: response.data.count})
        }

      })
      .catch((error) => {
        console.log("error: ", error)
      })
}

  async getCategoryStructure(): Promise<SubCategoryResponse> {
    const { Network } = Plugins
    let status = await Network.getStatus()

    if (status.connected === false) {
      const { Filesystem } = Plugins

      let response = await Filesystem.readFile({
        path: "structure.txt",
        directory: FilesystemDirectory.Data,
        encoding: FilesystemEncoding.UTF8,
      }).catch((error) => {
        console.log(error)
        this.setState({ isStructureNotFound: true })
        return { data: "" }
      })

      return JSON.parse(response.data)
    } else {
      const postResponse = await Axios.post(apiRoutes.getCategories).then(
        async (response) => {
          const { Filesystem } = Plugins

          try {
            await Filesystem.writeFile({
              path: "structure.txt",
              data: JSON.stringify(response.data),
              directory: FilesystemDirectory.Data,
              encoding: FilesystemEncoding.UTF8,
            })
          } catch (e) {
            console.error("Unable to write file", e)
          }

          return response.data
        }
      )

      return postResponse
    }
  
  }

  render() {
    return (
      <div className='container'>
{/*            <NotificationEntry id="12" action="SHARE_NOTIFY"  text="This is a test Notification"  public_name="Dine Out Notification" />
 */}
        
        {(this.state.notificationcount === 0) ? (
                  <div
                    style={{
                      textAlign: "center",
                      position: "fixed",
                      width: "85%",
                      marginTop: "7rem"
                    }}
                  >
                    No Notification
                  </div>)
            : (this.state.notifications.map((notification: notifications) => {

              return (
                <NotificationEntry
                  key={notification.id}
                  id={notification.id}
                  action={notification.action}
                  text={notification.text}
                  public_name={notification.public_name}
                // subCategoryStructure={this.state.subCategoryStructure}  //not required
                />
              )
            }))}
      </div>
    )
  }
}

export default Notifications
