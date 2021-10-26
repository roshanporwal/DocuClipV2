import React from "react"

import { IonAlert, IonButton, IonIcon, IonLoading } from "@ionic/react"
import { close, notifications } from "ionicons/icons"

import "./notifications.css"
import Axios from "axios"
import apiRoutes from "../Routes"
import { getToken } from "../login/TokenProvider"
import { FilesystemDirectory, Plugins } from "@capacitor/core"
import { FileOpener } from "@ionic-native/file-opener"

type props = {
  id: string
  action: string
  text: string
  public_name: string
 //subCategoryStructure: any
}
type states = {
  title: string
  isRejectConfirmOpen: boolean
  error: string
  isLoading: boolean
  info: string
}
interface DownloadData {
  status: string
  data: string
  filename: string
  contentType: string
}

class NotificationEntry extends React.Component<props, states> {
  constructor(props: props) {
    super(props)

    const titleObj = {
      ACCEPT_SHARE: "File shared ",
      SHARE_NOTIFY: "File shared ",
    }
    let title: string = "Unknown action"

    if (titleObj.hasOwnProperty(this.props.action))
      title = titleObj[this.props.action]

    this.state = {
      title: title,
      isRejectConfirmOpen: false,
      error: "",
      isLoading: false,
      info: "",
    }

    localStorage.setItem("notificationID", this.props.id)
  }

  componentDidMount() {
    const formData = new FormData()
    formData.append("publicName", this.props.public_name)
    Axios.post(apiRoutes.fileInfo, formData)
      .then(async (response) => {
        if (response.data.status === "success") {
          const category = response.data.file.metadata.category
          const subCategoryProperty =
            response.data.file.metadata.additional_info?.subCategory

      //    const subCategory = this.props.subCategoryStructure[subCategoryProperty]
          this.setState({
            //info: category + (subCategory ? " - " + subCategory : ""),
          })
        } else {
          console.log("Verbose Error:", response.data)
        }
      })
      .catch((error) => {
        console.log("error: ", error)
      })
      .then(() => {
        // hide loading icon
        this.setState({ isLoading: false })
      })
  }

  viewClickHandler = () => {
    // if (this.props.action === "ACCEPT_SHARE") {
    //   window.location.href = "/file/" + this.props.public_name
    // }

    console.log('clicked')
    this.setState({ isLoading: true })
    const { Filesystem } = Plugins
    const uniqueFilename = this.props.public_name
    let contentType: string

    Filesystem.readFile({
      path: "docuclip/" + uniqueFilename,
      directory: FilesystemDirectory.Data,
    })
      .catch(async () => {
        // if readFile fails, then file doesn't exist, lets get on downloading it
        const form = new FormData()
        form.append("publicName", this.props.public_name)
        const response = await Axios.post(apiRoutes.fileInfo, form).then(
          async (response) => {
            if (response.data.status === "success") {
              return response.data.file
            } else if (response.data.status === "fail") {
              this.setState({ error: response.data.error })
            } else {
              console.log("Verbose Error:", response.data)
              this.setState({ error: "Unknown Error" })
            }
          }
        )

        const formData = new FormData()
        formData.append("filename", response.filename)
        formData.append("filePath", response.filePath)
        formData.append("ext", response.metadata.ext)

        await Axios.post(apiRoutes.fileDownload, formData)
          .then((response) => {
            if (response.data.status === "success") {
              contentType = response.data.contentType
              return response.data
            } else {
              console.log("Verbose error: ", response.data)
              throw new Error(response.data.error)
            }
          })
          .then((response: DownloadData) => {
            // create directory
            Filesystem.mkdir({
              path: "docuclip",
              directory: FilesystemDirectory.Data,
            })
              .catch(() => {}) // do nothing if directory exists error is thrown
              .then(() => {
                Filesystem.writeFile({
                  path: "docuclip/" + uniqueFilename,
                  data: response.data,
                  directory: FilesystemDirectory.Data,
                })
                  .then((response) => {
                    // good good
                    // console.log('response: ', response);
                  })
                  .catch((error) => {
                    console.log("Verbose error: ", error)
                  })
              })
          })
          .catch(async (error) => {
            // throw this error if internet is not available
            const { Network } = Plugins
            let status = await Network.getStatus()

            if (status.connected === false) {
              this.setState({
                error:
                  "Cannot connect to the internet. Unable to download file",
              })
            }

            // handle error file download + write errors
            throw new Error(error)
          })
      })
      .then(() => {
        // file exists and is downloaded, now open the file
        Filesystem.getUri({
          directory: FilesystemDirectory.Data,
          path: "docuclip/" + uniqueFilename,
        }).then(
          (getUriResult) => {
            // now use 3rd party apps to open this apps
            const path = getUriResult.uri
            FileOpener.open(path, contentType)
              .then(() => {
                // Filesystem.deleteFile({
                //   path: "docuclip/" + uniqueFilename,
                //   directory: FilesystemDirectory.Data,
                // })
              })
              .catch((error) => {
                console.log("Verbose opening file error", error)

                // throw this error if app to open file is not found
                if (error.status === 9) {
                  this.setState({
                    error:
                      "Cannot connect to the internet. Unable to download file",
                  })
                }
              })
          },
          (error) => {
            console.log("Verbose filesystem get error", error)
          }
        )
      })
      .catch((error) => {
        // print the errors
        console.log("Error", error)
      })
      .then(() => {
        this.setState({ isLoading: false })
      })

    // can make it dismiss by call dismissClickHandler()
  }

  dismissClickHandler = async () => {
    const formData = new FormData()
    formData.append("id", this.props.id)
    Axios.post(apiRoutes.notifications.dismiss, formData)
      .then((response) => {
        if (response.data.status === "success") {
          const currentNotification = document.getElementById(this.props.id)
          currentNotification?.setAttribute("class", "hidden")
        }
      })
      .catch((error) => {
        console.log("error: ", error)
      })
  }

  // NOT WORKING! REFER TO FileView.tsx -> acceptConfirmHandler
  AcceptClickHandler = () => {
    // make an api call to get QR code of the url of this download page
    const formData = new FormData()
    formData.append("publicName", this.props.public_name)
    formData.append("userId", getToken().userId)
    Axios.post(apiRoutes.savefile, formData)
      .then(async (response) => {
        console.log(response)
        if (response.data.status === "success") {
          await this.dismissClickHandler()
          // handle success response here
          const { LocalNotifications } = Plugins

          LocalNotifications.requestPermission()
            .then(() => {
              LocalNotifications.schedule({
                notifications: [
                  {
                    title: "Docuclip file accepted",
                    body: this.state.title + " has been saved in Docuclip",
                    id: 1,
                  },
                ],
              })
            })
            .catch((error) => {
              console.log(
                "No perms to display notifications. Falling back to dialog - error: ",
                error
              )
              this.setState({
                error: this.state.title + " has been saved in Docuclip",
              })
            })
        } else {
          this.setState({ error: response.data.error })
        }
      })
      .catch((error) => {
        this.setState({ error: error })
      })
  }

  render() {
    return (
      <React.Fragment>
        <IonAlert
          isOpen={this.state.isRejectConfirmOpen}
          message={"Are you sure you want to reject this file?"}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              handler: () => {
                this.setState({ isRejectConfirmOpen: false })
              },
            },
            {
              text: "Yes",
              handler: () => {
                this.dismissClickHandler()
              },
            },
          ]}
        />

        <IonLoading
          isOpen={!!this.state.isLoading}
          onDidDismiss={() => this.setState({ isLoading: false })}
          message={"Please wait..."}
        />

        <IonAlert
          isOpen={!!this.state.error}
          message={this.state.error}
          buttons={[
            {
              text: "Ok",
              handler: () => {
                this.setState({ error: "" })
              },
            },
          ]}
        />

        <div id={this.props.id} className='notification-entry'>
          
            <IonIcon src={notifications} />
          {/* <div className='header'>
            <h6 className='title'>{this.state.title}</h6>
          </div> */}

          <div className='body'>
            <p>{this.props.text}</p>
            <p>{this.state.info}</p>
            {this.props.action === "SHARE_ACCEPT" ? (
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div onClick={this.viewClickHandler} className="sm-button">
                  View
                </div>
                <div
                  onClick={() => this.setState({ isRejectConfirmOpen: true })}
                  className="sm-button" style={{backgroundColor:"red"}}
                >
                  Reject
                </div>
                <div onClick={this.AcceptClickHandler} className="sm-button" style={{backgroundColor:"green"}}>Accept</div>
              </div>
            ) : null}
          </div>
          {this.props.action === "SHARE_NOTIFY" ? (
              <div className='dismiss-button'>
                <IonIcon
                  icon={close}
                  onClick={this.dismissClickHandler}
                  className='dismiss-button-btn'
                />
              </div>
            ) : null}
        </div>
      </React.Fragment>
    )
  }
}

export default NotificationEntry
