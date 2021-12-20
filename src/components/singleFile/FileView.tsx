import React from "react"
import {
  IonAlert,
  IonButton,
  IonIcon,
  IonItem,
  IonPopover,
  IonRippleEffect,
} from "@ionic/react"
import { ellipsisVertical, lockClosedOutline } from "ionicons/icons"

// import axios and api routes
import apiRoutes from "../Routes"
import axios from "axios"

// import components and extension mapping
import mapping from "../../ExtensionMapping"
import TagComponent from "./TagComponent"
import { getToken } from "../login/TokenProvider"
import {
  FilesystemDirectory,
  FilesystemEncoding,
  Plugins,
} from "@capacitor/core"
import { FileOpener } from "@ionic-native/file-opener"
import { FilePath } from "@ionic-native/file-path"
import { FileEntry } from "@ionic-native/file"
import { File } from "@ionic-native/file"

/**
 * 
 * eventOn: "December 09, 2020 20:07"
fileCategory: "Images"
filePath: "uploads/users/3/images/3b405227097cec22468b3bb7b634f556.jpg"
filename: "!!TEST!!"
isPrivate: false
metadata: {tags: Array(2), category: "Travel Bookings", size: "52085", ext: "jpg", additional_info: {…}}
owner: "3"
publicName: "3b405227097cec22468b3bb7b634f556"
sharePhones: []
uploaded: "December 08, 2020 08:38"
 */

type FileMetadata = {
  tags: Array<string>
  category: string
  size: string
  ext: string
  additional_info?: any
}

type File = {
  owner: string
  filename: string
  filePath: string
  fileCategory: string
  publicName: string
  sharePhones: Array<string>
  uploaded: string
  eventOn: string
  isPrivate: boolean
  metadata: FileMetadata
}

type props = {
  file: File
  metadata: any
  additionalInfo: any
  finishLoading: any
  subCategory: string
}
type states = {
  file: File | null
  tags: Array<JSX.Element>
  emails: any
  additionalInfo: any
  extImg: string
  isLoading: boolean
  isEventSet: boolean | null
  isDeleteConfirmOpen: boolean
  error: string
  showPopover: boolean
  isOwner: boolean
  dialogBox: boolean
  hasFile: boolean
  oldFile: string
  notificationId: string | null
  isAcceptClickedOnce: boolean
}
interface DownloadData {
  status: string
  data: string
  filename: string
  contentType: string
}

class FileView extends React.Component<props, states> {
  constructor(props: props) {
    super(props)

    const notificationId = localStorage.getItem("notificationID")

    this.state = {
      file: null,
      tags: [],
      emails: "",
      additionalInfo: null,
      extImg: "",
      isLoading: true,
      isEventSet: null,
      isDeleteConfirmOpen: false,
      error: "",
      showPopover: false,
      isOwner: false,
      dialogBox: false,
      hasFile: true,
      oldFile: "",
      notificationId: notificationId,
      isAcceptClickedOnce: false
    }
  }

  componentDidMount() {

    let tagsJson: Array<string> = this.props.metadata.tags
    let emailsJson: Array<string> = this.props.file.sharePhones

    let tags: Array<JSX.Element> = []
    let emails: Array<JSX.Element> = []

    // read for tags and display tags in their component
    // if none, display "No Tags"
    let noTags: boolean
    tagsJson = tagsJson ? tagsJson : [];
    (tagsJson.length === 1 && tagsJson[0] === "" ) ? (noTags = true) : (noTags = false) ;
    
    if (noTags) {
        tags.push(
          <TagComponent key={Date.now() + Math.random()} tagTitle={"No Tags"} />
        )
      }
    else {
      tagsJson.forEach((tag: string) => {
        console.log(tag)
        
          tags.push(
            <TagComponent key={Date.now() + Math.random()} tagTitle={tag} />
          )
      })
    }
      this.setState({tags:tags});
    
    // check to see if the file is public or restricted
    // if restricted, then show the emails of users who have access
    let noAccess: boolean
    let isPublic: boolean
    emailsJson = emailsJson ? emailsJson : []
    emailsJson.length === 1 ? (noAccess = true) : (noAccess = false)
    !!this.props.file.isPrivate ? (isPublic = false) : (isPublic = true)

    if (isPublic) {
      emails.push(
        <TagComponent key={Date.now() + Math.random()} tagTitle={"Public"} />
      )
    } else if (noAccess) {
      emails.push(
        <TagComponent key={Date.now() + Math.random()} tagTitle={"No Access"} />
      )
    } else {
      emailsJson.forEach((email: string) => {
        emails.push(
          <TagComponent key={Date.now() + Math.random()} tagTitle={email} />
        )
      })
    }

    // programmatically display additional info fields if they exist
    const items: any = []

    // load the array with an initial field
    if (this.props.subCategory) {
      items.push(
        <div key={Math.random()}>
          <hr style={{ backgroundColor: "#ccc" }} />
          <div className='singleFile-card-item'>
            <span>Sub-Category</span>
            <p>{this.props.subCategory}</p>
          </div>
        </div>
      )
    }
    if (this.props.additionalInfo != null) {
      for (const key in this.props.additionalInfo) {
        const title: string = this.props.additionalInfo[key]
        let information: string = this.props.metadata.additional_info[key]

        // regex match to see if the string is a date and convert it to date format, else print raw
        if (
          information!.match(
            /[\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2}.[\d]{3}[+][\d]{2}:[\d]{2}/g
          )
        ) {
          const date = new Date(this.props.metadata.additional_info[key])
          var months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ]
          information = `${
            months[date.getMonth()]
          } ${date.getDate()}, ${date.getFullYear()}`
        }

        // send these to be rendered
        items.push(
          <div className='singleFile-card-item' key={key}>
            <span>{title}</span>
            <p>{information}</p>
          </div>
        )
      }
    }

    // makes a call to the API to check if the user has already saved this file to their docuclip ecosystem
    {
      const formData = new FormData()
      formData.append("publicName", this.props.file.publicName)
      formData.append("userId", getToken().userId)
      axios.post(apiRoutes.checkOwnership, formData).then((response) => {
        if (response.data.status === "success") {
          if (response.data.owner === "false") {
            this.setState({
              hasFile: false,
            })
          } else {
            this.setState({
              hasFile: true,
              oldFile: response.data.public_name,
            })
          }/* 
          this.setState({
            tags: response.data.owner,
          }) */
        }
      })
    }

    // check to see if date is set, if not do not display EvenOn field
    this.setState({
      isEventSet: Date.parse(this.props.file.eventOn) < 0 ? false : true,
      isOwner: this.props.file.owner === getToken().userId ? true : false,
    })

    // if file is an image, then show the image preview, if not, then show file icon
    const imageExtensions = ["png", "jpeg", "jpg"]
    if (imageExtensions.includes(this.props.metadata.ext)) {
      const formData = new FormData()
      formData.append("publicName", this.props.file.publicName)
      formData.append("ext", this.props.metadata.ext)
      axios.post(apiRoutes.linkImage, formData).then((response) => {
        if (response.data.status === "success") {
          this.setState({
            file: this.props.file,
            emails: emails,
            additionalInfo: items,
            extImg: response.data.path,
            isLoading: false,
          })
          this.props.finishLoading()
        }

        return
      })
    }

    if (this.state.extImg === "") {
      let extensionFile: string
      if (mapping.hasOwnProperty(this.props.metadata.ext)) {
        extensionFile = mapping[this.props.metadata.ext]
      } else {
        extensionFile = mapping.unknown
      }

      let image: string
      import(`../../assets/extension-icons/${extensionFile}`)
        .then((img) => {
          image = img.default
        })
        .then(() => {
          this.setState({
            file: this.props.file,
            emails: emails,
            additionalInfo: items,
            extImg: image!,
            isLoading: false,
          })

          this.props.finishLoading()
        })
    }

    console.log('const tags ',tags);
    console.log('state tags ',this.state.tags);
  }
  viewClickHandler = () => {
    this.setState({ isLoading: true })
    console.log(this.props.file)
    const { Filesystem } = Plugins
    const uniqueFilename =
      this.props.file.publicName.substr(0, 8) + "_" + this.props.file.filename
    let contentType = ""

    Filesystem.readFile({
      path: "docuclip/" + uniqueFilename,
      directory: FilesystemDirectory.Data, 
    })
      .catch(async () => {
        // if readFile fails, then file doesn't exist, lets get on downloading it
        const formData = new FormData()
        formData.append("filename", this.props.file.filename)
        formData.append("filePath", this.props.file.filePath)
        formData.append("ext", this.props.file.metadata.ext)

        await axios
          .post(apiRoutes.fileDownload, formData)
          .then((response) => {
            if (response.data.status === "success") {
              contentType = response.data.contentType
              return response.data
            } else {
              console.log("Verbose error: ", response.data)
              this.setState({
                    error: response.data.error,
                  })
              throw new Error() 
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
        this.setState({ isLoading: false })
        // file exists and is downloaded, now open the file
        Filesystem.getUri({
          directory: FilesystemDirectory.Data,
          path: "docuclip/" + uniqueFilename,
        }).then(
          (getUriResult) => {
            // now use 3rd party apps to open this apps
            const path = getUriResult.uri
            FileOpener.open(path, contentType)
              .then(() => console.log("File is opened"))
              .catch((error) => {
                console.log("Verbose opening file error", error)

                // throw this error if app to open file is not found
                if (error.status === 9) {
                  this.setState({
                    error: "No application found to open the file",
                  })
                }
              })
          },
          (error) => {
            console.log("Verbose filesystem get error", error)
          }
        )
      })
  }

  acceptConfirmHandler = () => {
    this.setState({ isAcceptClickedOnce: true })

    // make an api call to get QR code of the url of this download page
    const formData = new FormData()
    formData.append("publicName", this.props.file.publicName)
    formData.append("userId", getToken().userId)
    formData.append("method", "PUBLICITY")
    axios
      .post(apiRoutes.savefile, formData)
      .then((response) => {
        if (response.data.status === "success") {
          const { LocalNotifications } = Plugins

          LocalNotifications.requestPermission()
            .then(() => {
              LocalNotifications.schedule({
                notifications: [
                  {
                    title: "Docuclip file accepted",
                    body:
                      this.props.file.filename +
                      " has been saved in the Documents folder",
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
                error:
                this.props.file.filename + " has been saved in the Documents folder",
              })
            })

          window.location.replace("/category")
        } else {
          this.setState({ error: response.data.error, isAcceptClickedOnce: true })
          console.log(response.data)
        }
      })
      .catch((error) => {
        this.setState({ error: error })
      })
  }

  deleteClickHandler = () => {
    this.setState({ showPopover: false })
    this.setState({ isDeleteConfirmOpen: false })

    // call delete file api
    const Form = new FormData()
    Form.append("publicName", this.props.file.publicName)
    axios
      .post(apiRoutes.deleteFile, Form)
      .then((response) => {
        if (response.data.status === "success") {
          // redirect to previous page
          this.redirectToPrevPage()
        } else {
          console.log("Verbose error: ", response.data)
          this.setState({ error: "There was an error deleting the file" })
        }
      })
      .catch((error) => {
        console.log("Verbose Error: ", error)
        this.setState({ error: "There was an error deleting the file" })
      })
  }

  shareClickHandler = () => {
    this.setState({ showPopover: false, isLoading: true })
    const { Filesystem } = Plugins
    let contentType:string;
    let filename: string = this.props.file.filename
    if (
      filename.substr(filename.lastIndexOf(".") + 1).toLowerCase() !==
      this.props.file.metadata.ext
    ) {
      filename += "." + this.props.file.metadata.ext
    }
    console.log('yo',this.props.file.publicName.substr(0, 8) + "_" + this.props.file.filename)
     if(this.props.metadata.is_local == 'true'){
    
      const uniqueFilename = this.props.file.publicName.substr(0, 8) + "_" + this.props.file.filename
      console.log(uniqueFilename);
      Filesystem.readFile({
        path: "docuclip/" + uniqueFilename,
        directory: FilesystemDirectory.Documents,
      }).then((data) => {
        // file exists and is downloaded, now get its location
          Filesystem.getUri({
            directory: FilesystemDirectory.Documents,
            path: "docuclip/" + uniqueFilename,
          }).then(
            async (getUriResult) => {
            const path = getUriResult.uri
              FilePath.resolveNativePath(path).then((filePath ) => {
                console.log('filepath',filePath);

                File.resolveLocalFilesystemUrl(filePath).then((fileInfo) => {
//get content type
                  let files = fileInfo as FileEntry;
                  files.file((meta) => {
                    contentType = meta.type;
                  

                  //after getting location tell the system to share
                    Plugins.FileSharer.share({
                      filename: filename,
                      base64Data: data.data,
                      contentType: contentType,
                    })
                    .then(() => {
                      // ignore   
                    })
                    .catch((error: any) => {
                      console.error("File sharing failed", error.message)
                    })
                  });
                })
              })
              /* console.log(path)
              await Share.share({
                  title: filename,
                  text: filename,
                  url: path,
              }) */
              this.setState({ isLoading: false })

              
            });
      }).catch((error) => {
          console.log("Verbose filesystem get error", error)
          this.setState({ error: error })
          this.setState({ isLoading: false })
      })
    }
    else{
      const formData = new FormData()
      formData.append("filePath", this.props.file.filePath)
      formData.append("filename", this.props.file.filename)
      formData.append("ext", this.props.file.metadata.ext)
      axios
        .post(apiRoutes.fileDownload, formData)
        .then((response) => {
          const { status } = response.data
          if (status === "success") {
            Plugins.FileSharer.share({
              filename: filename,
              base64Data: response.data.data,
              contentType: response.data.contentType,
            })
              .then(() => {
                // ignore
              })
              .catch((error: any) => {
                console.error("File sharing failed", error.message)
              })
          } else {
            this.setState({ error: response.data.error })
          }
        })
        .catch((error) => {
          // handle error
          this.setState({ error: error })
        })
        .then(() => {
          this.setState({ isLoading: false })
        })
    }
  }

  redirectToPrevPage = () => {
    let url: string = this.props.metadata.category.toLowerCase()
    url = url.replace(" ", "_")

    window.location.replace("/category/" + url)
  }

  dismissClickHandler = async (id: string) => {
    const formData = new FormData()
    formData.append("id", id)
    axios
      .post(apiRoutes.notifications.dismiss, formData)
      .then((response) => {
        if (response.data.status === "success") {
          window.location.replace("/")
        }
      })
      .catch((error) => {
        console.log("error: ", error)
      })
  }

  render() {
    return (
      <div>
        <IonAlert
          isOpen={this.state.isDeleteConfirmOpen}
          message='Are you sure you want to delete this file?'
          buttons={[
            {
              text: "Cancel",
              handler: () => {
                this.setState({ isDeleteConfirmOpen: false })
              },
            },
            {
              text: "Yes",
              handler: () => {
                this.deleteClickHandler()
              },
            },
          ]}
        />

        <IonAlert
          isOpen={!!this.state.error}
          message={this.state.error}
          buttons={[
            {
              text: "Ok",
              handler: () => {
                this.setState({ error: "" })
                this.redirectToPrevPage()
              },
            },
          ]}
        />

        <IonPopover
          isOpen={this.state.showPopover}
          cssClass='my-custom-class'
          onDidDismiss={(e) => this.setState({ showPopover: false })}
        >
          <IonItem
            onClick={() => this.shareClickHandler()}
            className='ion-activatable ripple-parent'
          >
            Share
            <IonRippleEffect></IonRippleEffect>
          </IonItem>
          {this.state.isOwner && (
            <React.Fragment>

              <IonItem
                onClick={() => this.setState({ isDeleteConfirmOpen: true })}
                className='ion-activatable ripple-parent'
              >
                Delete
                <IonRippleEffect></IonRippleEffect>
              </IonItem>
            </React.Fragment>
          )}
        </IonPopover>

        {!!this.state.isLoading ? null : (
          <div className='row-vertical' style={{marginBottom:'80px'}}>
            <div className='card-header'>
              <img
                src={this.state.extImg}
                alt={this.props.metadata.ext}
                width='58'
                height='58'
              />
              <h5 className='singleFile-title'>{this.props.file.filename}</h5>
              <div className='right-corner'>
                {!!this.props.file.isPrivate ? (
                  <IonIcon
                    size='large'
                    md={lockClosedOutline}
                    ios={lockClosedOutline}
                  />
                ) : null}
                <IonIcon
                  className='right-corner-menu'
                  icon={ellipsisVertical}
                  onClick={() => this.setState({ showPopover: true })}
                />
              </div>
            </div>
            <div className='singleFile-card-content'>
              <div className='singleFile-card-item'>
                <span>Location</span>
                <p>
                  {this.props.metadata.is_local == true ? 'Local' : 'Server' }
                </p>
              </div>
              {this.props.metadata.is_verified ? 
              <div className='singleFile-card-item'>
                <span>Certified</span>
                <p>{this.props.metadata.is_verified == true ? 'Yes' : 'No' }</p>
              </div> : null}
              <div className='singleFile-card-item'>
                <span>Type</span>
                <p>
                  {this.props.file.fileCategory} ({this.props.metadata.ext})
                </p>
              </div>

              <div className='singleFile-card-item'>
                <span>Size</span>
                <p>
                  {(this.props.metadata.size / (1024 * 8)).toString().slice(0,4)} kb
                </p>
              </div>

              {this.state.isEventSet ? (
                <div className='singleFile-card-item'>
                  <span>Event On</span>
                  <p>{this.props.file.eventOn}</p>
                </div>
              ) : null}

              <div className='singleFile-card-item'>
                <span>Uploaded On</span>
                <p>{this.props.file.uploaded}</p>
              </div>

              <div className='singleFile-card-item'>
                <span>Tags</span>
                <div className='tag-container'>{this.state.tags}
                </div>
              </div>
              {this.state.additionalInfo}
            </div>
            <div
              className='singleFile-card-subtitle'
              style={{ textAlign: "center" }}
            >
              {/* Only show save file if user is NOT the owner of the file */}
              {/* or the user doesn't already have the file saved */}
              {!this.state.isOwner && !this.state.hasFile && (
                <div className="row-vertical">
                  {this.state.notificationId ? (
                    <>
                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                      <button
                        className='custom-button'
                        onClick={() => this.acceptConfirmHandler()}
                        disabled={this.state.isAcceptClickedOnce}
                      >
                        Accept File
                      </button>
                      
                        <div
                          className='custom-button'
                          onClick={() =>
                            this.dismissClickHandler(this.state.notificationId!)
                          }
                        >
                          Reject
                        </div>
                      
                      </div>
                      <div>
                        <p>or</p>
                        <button
                          type='submit'
                          className='custom-button'
                          onClick={this.viewClickHandler}
                        >
                            View
                        </button>
                      </div>
                      </> 
                      ) : (
                        <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                      <button
                        className='custom-button'
                        onClick={() => this.acceptConfirmHandler()}
                        disabled={this.state.isAcceptClickedOnce}
                      >
                        Accept File
                      </button>
                      
                        <div
                          className='custom-button'
                          onClick={() =>
                            this.viewClickHandler
                          }
                        >
                          View
                        </div>
                      
                      </div>
                      )}
                </div>
              )}
              {/* Show this button to redirect user to their own file */}
              {this.state.hasFile && (
                <React.Fragment>
                  <p style={{ margin: "auto" }}>
                    You already have this file saved
                  </p>
                  <div
                    className='custom-button'
                    /* onClick={() =>
                      (window.location.href = "file/" + this.state.oldFile)
                    } */
                    onClick={this.viewClickHandler}
                    style={{ marginBottom: "15px",marginTop:'10px' }}
                  >
                    Open my file
                  </div>
                </React.Fragment>
              )}
              
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default FileView
