import React, { useEffect, useState } from "react"
import { IonButton, IonIcon, IonAlert } from "@ionic/react"
import { shareSocialOutline, shareSocialSharp } from "ionicons/icons"

import { FilesystemDirectory, Plugins } from "@capacitor/core"
import apiRoutes from "../Routes"

import axios from "axios"
import mapping from "../../ExtensionMapping"
import "./download.css"

import { getToken, isLoggedIn } from "../login/TokenProvider"

interface DownloadData {
  status: string
  data: string
  filename: string
  contentType: string
}

interface props {
  fileName: string
  filePath: string
  fileSize: number
  fileExt: string
  setError: any
  owner: number
  publicName: string
}
const Success: React.FC<props> = (props) => {
  const [imgSrc, setImgSrc] = useState<any>(null)
  const [extImg, setExtImg] = useState<any>()
  const [isShareable, setShareable] = useState<boolean>()
  const [isOwner, setOwner] = useState<boolean>()
  const [dialogBox, showDialogBox] = useState<boolean>(false)

  // run this code only once
  useEffect(() => {
    // make an api call to get QR code of the url of this download page
    const formData = new FormData()
    formData.append(
      "url",
      "https://docuclip.app/ci4-dms-updated/public/download/" +
        props.publicName
    )
    axios.post(apiRoutes.getQrCode, formData).then((response) => {
      if (response.data.status === "success") {
        setImgSrc(response.data.src)
      } else {
        console.log(response.data.error)
      }
    })

    // show a file extension icon next to filename
    let extensionFile: string
    if (mapping.hasOwnProperty(props.fileExt)) {
      extensionFile = mapping[props.fileExt]
    } else {
      extensionFile = mapping.unknown
    }

    // check to see if the current logged in user is the owner of the file
    if (isLoggedIn())
      props.owner === getToken().userId ? setOwner(true) : setOwner(false)
    // set owner here is true only to stop the display of save to my account button
    // as it won't work. TODO: make this work I guess?
    else setOwner(true)

    // check to see if WebShareAPI works
    // FIXME: Possible source of bug
    let navigatorObject: any
    navigatorObject = window.navigator
    navigatorObject && navigatorObject.share
      ? setShareable(true)
      : setShareable(true)

    import(`../../assets/extension-icons/${extensionFile}`).then((image) => {
      setExtImg(image.default)
    })
  }, [props.fileExt, props.owner, props.publicName])

  // share button will use WebShareAPI to share the file link to 3rd party apps
  const shareClickHandler = async () => {
    let filename: string = props.fileName
    if (
      filename.substr(filename.lastIndexOf(".") + 1).toLowerCase() !==
      props.fileExt
    ) {
      filename += "." + props.fileExt
    }

    const formData = new FormData()
    formData.append("filePath", props.filePath)
    formData.append("filename", props.fileName)
    formData.append("ext", props.fileExt)
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
          props.setError(response.data.error)
        }
      })
      .catch((error) => {
        // handle error
        props.setError(error)
      })
  }

  const saveConfirmHandler = () => {
    // make an api call to get QR code of the url of this download page
    const formData = new FormData()
    formData.append("publicName", props.publicName)
    formData.append("userId", getToken().userId)
    axios
      .post(apiRoutes.savefile, formData)
      .then((response) => {
        if (response.data.status === "success") {
          window.location.href = "file/" + response.data.publicName
        } else {
          props.setError(response.data.error)
        }
      })
      .catch(function (error) {
        // handle error
        props.setError(error)
      })
  }

  const saveClickHandler = () => {
    // this method only displays the dialog box
    // On confirm, the actual save part of the code is executed
    showDialogBox(true)
  }

  const downloadClickHandler = () => {
    const { Filesystem } = Plugins
    const uniqueFilename = props.publicName.substr(0, 8) + "_" + props.fileName

    Filesystem.readFile({
      path: "docuclip/" + uniqueFilename,
      directory: FilesystemDirectory.Documents,
    })
      .then(() => {
        props.setError("File already exists in your Documents folder")
      })
      .catch(async () => {
        // if readFile fails, then file doesn't exist, lets get on downloading it
        const formData = new FormData()
        formData.append("filePath", props.filePath)
        formData.append("filename", props.fileName)
        formData.append("ext", props.fileExt)

        await axios
          .post(apiRoutes.fileDownload, formData)
          .then((response) => {
            if (response.data.status === "success") {
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
              directory: FilesystemDirectory.Documents,
            })
              .catch(() => {}) // do nothing if directory exists error is thrown
              .then(() => {
                Filesystem.writeFile({
                  path: "docuclip/" + uniqueFilename,
                  data: response.data,
                  directory: FilesystemDirectory.Documents,
                })
                  .then(() => {
                    // good good
                    const { LocalNotifications } = Plugins

                    LocalNotifications.requestPermission()
                      .then(() => {
                        LocalNotifications.schedule({
                          notifications: [
                            {
                              title: "Docuclip file downloaded",
                              body:
                                props.fileName +
                                " has been saved in the Documents folder",
                              id: 1,
                              extra: [props.fileName, props.publicName, uniqueFilename]
                            },
                          ],
                        })
                      })
                      .catch((error) => {
                        console.log("No perms - error: ", error)
                        props.setError(
                          props.fileName +
                            " has been saved in the Documents folder"
                        )
                      })
                  })
                  .catch((error) => {
                    console.log("Verbose write error: ", error)
                    props.setError("There was an error saving/writing the file")
                  })
              })
          })
          .catch(function (error) {
            // handle error file download + write errors
            console.log("Verbose download or write error:", error)
            props.setError("There was an error downloading the file")
          })
      })
  }

  return (
    <div className='download-container'>
      <IonAlert
        isOpen={dialogBox}
        message={"Are you sure you want to save this file?"}
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              showDialogBox(false)
            },
          },
          {
            text: "Yes",
            handler: () => {
              saveConfirmHandler()
            },
          },
        ]}
      />

      <div className='card-header'>
        <img src={extImg} alt={props.fileExt} width='58' height='58' />
        <h3 className='download-title'>{props.fileName}</h3>
        {/* Only show button if WebShare API is working */}
        {isShareable && (
          <div className='share-button'>
            <IonIcon
              ios={shareSocialOutline}
              md={shareSocialSharp}
              onClick={shareClickHandler}
              className='share-button-btn'
            />
          </div>
        )}
      </div>
      <div className='card-content'>
        {imgSrc === null ? "Loading..." : <img src={imgSrc} alt='qr code' />}
      </div>
      <div className='card-subtitle'>
        {/* Only show save file if user is NOT the owner of the file */}
        {!isOwner && (
          <div>
            <IonButton
              expand='block'
              className='button'
              onClick={saveClickHandler}
            >
              Save to Docuclip
            </IonButton>
            <p>or</p>
          </div>
        )}
        <IonButton
          expand='block'
          type='submit'
          className='button'
          onClick={downloadClickHandler}
        >
          Download
        </IonButton>
      </div>
    </div>
  )
}

export default Success
