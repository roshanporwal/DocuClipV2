import React, { useEffect, useState } from "react"
import {
  IonAlert,
  IonIcon,
  IonItem,
  IonLoading,
  IonPopover,
  IonRippleEffect,
} from "@ionic/react"
import { documentOutline, ellipsisVerticalOutline } from "ionicons/icons"
import moment from "moment"
import Certified from '../../assets/certified-icon.png'

//import { FileOpener } from '@ionic-native/file-opener'

// import mapping
import mapping from "../../ExtensionMapping"

// import axios and api routes
import axios from "axios"
import apiRoutes from "../Routes"
import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding
} from "@capacitor/core"

import { FileOpener } from "@ionic-native/file-opener"
import { FilePath } from "@ionic-native/file-path"
import { FileEntry } from "@ionic-native/file"
import { File } from "@ionic-native/file"

interface DownloadData {
  status: string
  data: string
  filename: string
  contentType: string
}
interface props {
  showCategoryTitle: boolean
  fileName: string
  fileSize: number
  metadata: any
  uploadedAt: string
  publicName: string
  path: string
  ext: string
  subCategories: object | null
}

type SubCategoryResponse = {
  categories: Array<string>
  additionalFields: Object
}

const Item: React.FC<props> = (props) => {
  // state to use as url to file extension image
  const [extImg, setExtImg] = useState<any>("")
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isStructureNotFound, setStructureNotFound] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false)
  const [isPopOverOpen, setPopOverOpen] = useState<boolean>(false)
  const [infoArray, setInfoArray] = useState<Array<string>>([])
  const { Share } = Plugins;
  useEffect(() => {
    getCategoryStructure()
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

        return subCategories
      })
      .then((subCategories) => {
        // declaring constants for converting date
        const regexOne = /[\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2}.[\d]{3}[+][\d]{2}:[\d]{2}/
        const regexTwo = /[\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}/
        const regexThree = /[\d]{4}-[\d]{2}-[\d]{2}/

        // set additional information into the array, ignore titles of course
        let temp_array: Array<string> = []
        if (props.metadata.category) temp_array[0] = props.metadata.category
        if (props.metadata.additional_info.subCategory)
          temp_array[1] =
            subCategories[props.metadata.additional_info.subCategory]
        if (typeof props.metadata.additional_info === "object") {
          let changedDateOnceFlag = false
          let index = 2
          for (const property in props.metadata.additional_info) {
            if (property === "subCategory") continue
            let value = props.metadata.additional_info[property]

            if (value.match(regexOne) || value.match(regexTwo) || value.match(regexThree)) {
              if (!changedDateOnceFlag)
                index = 4
              changedDateOnceFlag = true

              const momentDate = moment(value)
              value = momentDate.format("DD-MMM-YY")
            }
            temp_array[index++] = value
          }
        }
        setInfoArray(temp_array)
      })
    // conditional checks to see if the current file is an image,
    // if so, instead of displaying file extension, it will show
    // the preview of the file
    const imageExtensions = ["png", "jpeg", "jpg"]
    if (imageExtensions.includes(props.ext)) {
      // pack the data and send a request to receive the url of
      // the preview image
      // NOTE: this api will return image preview of a shorter
      // dimension i.e. less than 100x100
      const formData = new FormData()
      formData.append("publicName", props.publicName)
      formData.append("ext", props.ext)
      axios
        .post(apiRoutes.linkImage, formData)
        .then((response) => {
          // if retrieval was a success, then extImg will
          // be set with the url of preview image. But if
          // this operation was failed for whatever reason,
          // then image url will not be set and a generic
          // file extension will be set by the next code block
          if (response.data.status === "success") {
            setExtImg(response.data.path)
            return
          }
        })
        .catch((error) => {
          // most possible error caught is an error due to no network
          // hence nothing should be done. For other cases console log
          // is sufficient
          console.log("error: ", error)
        })
    }

    // if the above files was not an image or the above operation
    // wasn't run successfully, then extension image url of the current
    // file will be retrieved and saved in extImg.
    if (extImg === "") {
      let extensionFile: string
      if (mapping.hasOwnProperty(props.ext)) {
        extensionFile = mapping[props.ext]
      } else {
        extensionFile = mapping.unknown
      }

      import(`../../assets/extension-icons/${extensionFile}`).then((image) => {
        setExtImg(image.default)
      })
    }
  }, [
    props.ext,
    props.publicName,
    extImg,
    props.metadata.additional_info,
    props.metadata.category,
  ])

  const getCategoryStructure = async (): Promise<SubCategoryResponse> => {
    const { Network } = Plugins
    let status = await Network.getStatus()

    if (status.connected === false) {
      const { Filesystem } = Plugins

      let response = await Filesystem.readFile({
        path: "structure.txt",
        directory: FilesystemDirectory.Data,
        encoding: FilesystemEncoding.UTF8,
      }).catch((error: any) => {
        console.log(error)
        setStructureNotFound(true)
        setLoading(false)

        return { data: "" }
      })

      return JSON.parse(response.data)
    } else {
      const postResponse = await axios
        .post(apiRoutes.getCategories)
        .then(async (response) => {
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
        })

      return postResponse
    }
  }

  // const itemPdfClickHandler = (path: string) => {
  //   localStorage.setItem("path", path)
  //   window.location.href = "/document"
  // }

  const itemClickHandler = () => {
    setLoading(true)
    const { Filesystem } = Plugins
    const uniqueFilename = props.publicName.substr(0, 8) + "_" + props.fileName
    let contentType: string

      Filesystem.readFile({
        path: "docuclip/" + uniqueFilename,
        directory: FilesystemDirectory.Documents,
      })
      .then(() => {
        // file exists and is downloaded, now open the file
        Filesystem.getUri({
          directory: FilesystemDirectory.Documents,
          path: "docuclip/" + uniqueFilename,
        }).then(
          (getUriResult: { uri: any }) => {
            const path = getUriResult.uri
            // get content type of that file
            FilePath.resolveNativePath(path).then((filePath ) => {
              File.resolveLocalFilesystemUrl(filePath).then((fileInfo) => {
                let files = fileInfo as FileEntry;
                files.file((meta) => {
                  contentType = meta.type
                });
              })
            })

            // now use 3rd party apps to open this apps
            FileOpener.open(path, contentType)
              .then(() => {
                console.log("File is opened")
                setLoading(false)
              } )
              .catch((error) => {
                console.log(path)
                console.log("Verbose opening file error", error)
                setLoading(false)

                setError(error)

                // throw this error if app to open file is not found
                if (error.status === 9) {
                  setLoading(false)
                  setError("No application found to open the file")
                }
              })
          },
          (error: React.SetStateAction<string | undefined>) => {
            console.log("Verbose filesystem get error", error)
                setLoading(false)
              setError(error)
          }
        )
      })
      .catch(async () => {
        // if readFile fails, then file doesn't exist, lets get on downloading it
        const formData = new FormData()
        formData.append("filename", props.fileName)
        formData.append("filePath", props.path)
        formData.append("ext", props.ext)

        await axios
          .post(apiRoutes.fileDownload, formData)
          .then((response) => {
            if (response.data.status === "success") {
              contentType = response.data.contentType
              return response.data
            } else {
              console.log("Verbose error: ", response.data)
              setError(response.data.error)
              setLoading(false)
            }
          })
          .then((response: DownloadData) => {
            // create directory
            if(!response){
              return null;
            }
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
                  .then((response: any) => {
                    setLoading(false)
                    // good good
                    // console.log('response: ', response);
                  })
                  .catch((error: React.SetStateAction<string | undefined>) => {
                    console.log("Verbose error: ", error)
                    setError(error)
                    setLoading(false)
                  })
              })
          })
          .catch(async (error) => {
            // throw this error if internet is not available
            const { Network } = Plugins
            let status = await Network.getStatus()

            if (status.connected === false) {
              setError(
                "Cannot connect to the internet. Unable to download file"
              )
            }

            // handle error file download + write errors
            throw new Error(error)
          })
      })
      
      /* .catch((error) => {
        // print the errors
        console.log("Error", error)
        setLoading(false)
        setError(error)
      }) */
  }

  const shareClickHandler = async () => {
    setPopOverOpen(false)
    setLoading(true)
    let contentType: string

    // FIXME: add feature to read file from phone when available to share instead of download
    // throw this error if internet is not available
    const { Network } = Plugins
    let status = await Network.getStatus()
    
    const { Filesystem } = Plugins
    if (status.connected === false) {
      setError("Cannot connect to the internet. Unable to share file")
      setLoading(false)
      return
    }

    let filename: string = props.fileName
    if (
      filename.substr(filename.lastIndexOf(".") + 1).toLowerCase() !==
      props.metadata.ext
    ) {
      filename += "." + props.metadata.ext
    }
    console.log(props.publicName.substr(0, 8) + "_" + props.fileName)
    if(props.metadata.is_local == 'true'){
    
      const uniqueFilename = props.publicName.substr(0, 8) + "_" + props.fileName

      Filesystem.readFile({
        path: "docuclip/" + uniqueFilename,
        directory: FilesystemDirectory.Documents,
      }).then((data: { data: any }) => {
        // file exists and is downloaded, now get its location
          Filesystem.getUri({
            directory: FilesystemDirectory.Documents,
            path: "docuclip/" + uniqueFilename,
          }).then(
            async (getUriResult: { uri: any }) => {
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
              setLoading(false)
              
            });
      }).catch((error: React.SetStateAction<string | undefined>) => {
          console.log("Verbose filesystem get error", error)
          setError(error);
          setLoading(false)

      })
    }
    else{
     console.log("in server item")


      const formData = new FormData()
      formData.append("filePath", props.path)
      formData.append("filename", props.fileName)
      formData.append("ext", props.metadata.ext)
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
            console.error("File sharing failed", response.data.error)
          }
    })
    .then(() => setLoading(false))
    .catch((error) => {
      // handle error
      console.error("File sharing failed", error)
      setLoading(false)
    })
    .then(() => setLoading(false))
    
    }
  }

  const fileInfoClickHandler = async () => {
    // throw this error if internet is not available
    const { Network } = Plugins
    let status = await Network.getStatus()

    if (status.connected === false) {
      setError(
        "You need to be connected to the internet to get detailed information about the file"
      )
      return
    }

    window.location.href = "/file/" + props.publicName
  }

  const deleteConfirm = async () => {
    // call delete file api
    const Form = new FormData()
    Form.append("publicName", props.publicName)
    axios
      .post(apiRoutes.deleteFile, Form)
      .then((response) => {
        console.log(response)
        if (response.data.status === "success") {
          // redirect to previous page
          window.location.reload();
        } else {
          console.log("Verbose error: ", response.data)
          setError("There was an error deleting the file")
        }
      })
      .catch((error) => {
        console.log("Verbose Error: ", error)
        setError("There was an error deleting the file")
      })
  }

  return (
    <React.Fragment>
      <IonLoading
        isOpen={isLoading}
        onDidDismiss={() => setLoading(false)}
        message={"Please wait..."}
      />

      <IonAlert
        isOpen={!!error}
        message={error}
        buttons={[
          {
            text: "Okay",
            handler: () => {
              setError("")
            },
          },
        ]}
      />

      <IonAlert
        isOpen={isDeleteOpen}
        message='Are you sure you want to delete this file?'
        buttons={[
          {
            text: "No",
            handler: () => {
              setDeleteOpen(false)
            },
          },
          {
            text: "Yes",
            handler: () => {
              setDeleteOpen(false)
              deleteConfirm()
            },
          },
        ]}
      />

      <IonAlert
        isOpen={isStructureNotFound}
        message='Structure data not found. Some data will not be visible'
        buttons={[
          {
            text: "Okay",
            handler: () => {
              setStructureNotFound(false)
            },
          },
        ]}
        onDidDismiss={() => {
          setStructureNotFound(false)
        }}
      />

      <IonPopover
        isOpen={isPopOverOpen}
        onDidDismiss={() => setPopOverOpen(false)}
      >
        <IonItem
          onClick={fileInfoClickHandler}
          className='ion-activatable ripple-parent'
        >
          File Info
          <IonRippleEffect></IonRippleEffect>
        </IonItem>
        <IonItem
          onClick={() => {
            setPopOverOpen(false)
            setDeleteOpen(true)
          }}
          className='ion-activatable ripple-parent'
        >
          Delete
          <IonRippleEffect></IonRippleEffect>
        </IonItem>
        <IonItem
          onClick={shareClickHandler}
          className='ion-activatable ripple-parent'
        >
          Share
          <IonRippleEffect></IonRippleEffect>
        </IonItem>
      </IonPopover>

      <div className='file-item-container'>
        
        <div className='list-item' onClick={itemClickHandler} >
          
          <div className={props.metadata.is_verified == 1 ? 'file-icon' : 'file-icon-unverified'} >
            {/* <IonIcon src={documentOutline} size="large" /> */}
            {props.metadata.is_verified == 1 ?  
              <div className="is_certified">
                <img
                    src={Certified}
                    width="20"
                  />
              </div>
              : null} 
            <img src={extImg} alt={props.ext} width='58' height='58' />
          </div>
          <div className='file-info' >
            {props.showCategoryTitle === true ? (
              <span className='heading'>
                <b>{infoArray[0]}</b>
                {typeof(infoArray[1]) !== 'undefined' ? <React.Fragment> /{infoArray[1]}</React.Fragment> : null}
              </span>
            ) : null}

            {/* Render no information available on empty additional info */}
            {!infoArray[2] &&
            !infoArray[3] &&
            !infoArray[4] &&
            !infoArray[5] ? (
              <i>No information available</i>
            ) : (
              <div className="fileattributes">
                  <div>{infoArray[2]}</div>
                  <div>{infoArray[3]}</div>
                  <div style={{fontSize:"9px",color:"#787878"}}>
                    {infoArray[4]} &nbsp;
                    {infoArray[5]}
                  </div>
               </div>
            )}
          </div>
          </div>
          
          <div className='file-options'>
            <button className='options-button'>
              <IonIcon
                icon={ellipsisVerticalOutline}
                onClick={() => setPopOverOpen(true)}
              />
            </button>
          </div>
        {/* <div className='file-additional-details' onClick={itemClickHandler}>
          <span>{props.fileName}</span>
          <p>{props.uploadedAt}</p>
        </div> */}
      </div>
    </React.Fragment>
  )
}

export default Item
