import React from "react"
import { IonAlert, IonLoading, IonSearchbar } from "@ionic/react"

// import components
import Item from "../../components/view/Item"

// import axios and api routes
import axios from "axios"
import apiRoutes from "../Routes"

// import auth functions
import { getToken, isLoggedIn } from "../../components/login/TokenProvider"

// import network plugin
import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding,
} from "@capacitor/core"
import Axios from "axios"
import moment from "moment"
import GoBack from "../goBack"

type Props = {
  redirect: string
  category?: any
  subCategory?: string
  showCategoryTitle?: boolean
}
type States = {
  error: string
  isLoading: boolean
  redirect: string

  filesList: any
  isEmpty: boolean
  searchText: string
  files: any
  subCategories: object | null
  isStructureNotFound: boolean
}

type SubCategoryResponse = {
  categories: Array<string>
  additionalFields: Object
}

type FileListResponse = {
  status: string
  files: any
  error?: string
}

const UpcomingTravelsHeader: React.FC = () => {
  return (
    <React.Fragment>
      <h6 style={{ textAlign:'left',color:'gray' }}>Upcoming Travels</h6>
    </React.Fragment>
  )
}

const PastTravelsHeader: React.FC = () => {
  return (
    <React.Fragment>
      <h6 style={{ margin: "left",color:'gray' }}>Past Travels</h6>
    </React.Fragment>
  )
}

class FilesList extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props)

    if (!isLoggedIn()) {
      window.location.replace("/")
    }

    this.state = {
      error: "",
      isLoading: true,
      redirect: this.props.redirect,

      filesList: null, // list of all files in the selected category
      isEmpty: true, // state to set a flag if no files exist in the current selected category
      searchText: "", // state to save the searchText
      files: null, // state to save the info of all files
      subCategories: null,
      isStructureNotFound: false,
    }

    this.getCategoryStructure = this.getCategoryStructure.bind(this)
    this.getFileList = this.getFileList.bind(this)
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
        this.setState({ isStructureNotFound: true, isLoading: false })
        return { data: "" }
      })

      return JSON.parse(response.data)
    } else {
      const postResponse = await Axios.post(apiRoutes.getCategories).then(
        async (response) => {
          const { Filesystem } = Plugins
          console.log(response.data);
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

  async getFileList(): Promise<FileListResponse> {
    const { Network } = Plugins
    let status = await Network.getStatus()

    if (status.connected === false) {
      const { Filesystem } = Plugins

      let response = await Filesystem.readFile({
        path: getToken().userId + "_list.txt",
        directory: FilesystemDirectory.Data,
        encoding: FilesystemEncoding.UTF8,
      }).catch((error) => {
        console.log(error)
        this.setState({ isStructureNotFound: true, isLoading: false })

        return { data: "" }
      })

      return JSON.parse(response.data)
    } else {
      const formData = new FormData()
      formData.append("userId", getToken().userId)
      const postResponse = axios
        .post(apiRoutes.listAll, formData)
        .then(async (response) => {
          const { Filesystem } = Plugins

          try {
            await Filesystem.writeFile({
              path: getToken().userId + "_list.txt",
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

  isSameSubCategory(
    currentSubCategory: string,
    fileSubCategory: string,
    fileCategory: string,
  ): boolean {

    if (!fileSubCategory) return false
    const structure = this.state.subCategories

  /* 26/10/2021
    Naseem Khan : - To all those who ponder over this code after i had to ponder over this for a  while(not my logic just
    adding to it instead of changing so that i dont have to rewrite this)
    what I added was checking if file category and the master category matches because if two categories had the same subcategory then 
    it was a showing on file at two places.

    if the props category is undefined that means it has no sub categories hence it directly should say true
    it was already messy I made it even more sorry but i had no choice :-(
   */

    // loop through each title and see if they match, if they do, return true
    let foundFlag = false

    for (const safeTitle in structure) {
      if(this.props.category == undefined){
        if (safeTitle.toLowerCase() === fileSubCategory.toLowerCase() && structure[safeTitle].toLowerCase() === currentSubCategory.toLowerCase()){
          foundFlag = true;
          return foundFlag;
        }
      }
      else{
        if ((safeTitle.toLowerCase() === fileSubCategory.toLowerCase() && structure[safeTitle].toLowerCase() === currentSubCategory.toLowerCase())
            && (this.props.category.join(' ') == fileCategory)
            ){
        foundFlag = true;
          return foundFlag;
        }
      }  
      
    }
          return foundFlag;

  }

  componentDidMount() {
    this.getCategoryStructure()
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
        this.setState({ subCategories: subCategories })
        const today = moment()

        this.getFileList().then((response) => {
          if (response.status === "success") {
            console.log("response: ", response)
            // empty array which will store JSX Components of Item
            const pastItems: any = []
            const upcomingItems: any = []

            // temp array to store only category files
            const temp: any = []

            // loop through all files and run it thorough a conditional to
            // pick only files matching the selected category
            for (const [index, value] of response.files.entries()) {
              let eventOn: string | null = value.eventOn
              let eventEnd: string | null = value.eventEnd
              if (eventOn) {
                eventOn = eventOn.slice(0, -6)
              }
              if (eventEnd) {
                eventEnd = eventEnd.slice(0, -6)
              } 

              let subCategoryBoolean = true
              let options = null
              try {
                options = JSON.parse(value.metadata.additional_info)
              } catch (e) {
                options = value.metadata.additional_info
              }
              if (options) {
                if (this.props.subCategory?.indexOf(options.subCategory)) {
                  subCategoryBoolean = false
                }
              } else subCategoryBoolean = false
              if (
                (value.metadata.category === this.state.redirect &&
                  subCategoryBoolean) ||
                this.isSameSubCategory(
                  this.state.redirect,
                  value.metadata.additional_info?.subCategory,
                  value.metadata.category,
                ) ||
                eventOn === this.state.redirect
                ||
                eventEnd === this.state.redirect
              ) {
                temp.push(value)

                // check for booking time if category is travel bookings
                if (
                  value.metadata.category === "Travel Bookings" &&
                  eventOn !== this.state.redirect
                ) {
                  // add the file to the list
                  if ((eventEnd && today.diff(moment(eventEnd)) < 0) || 
                    (eventOn && today.diff(moment(eventOn)) < 0)
                  ) {
                    upcomingItems.push(
                      <Item
                        fileName={value.filename}
                        fileSize={value.metadata.size}
                        metadata={value.metadata}
                        uploadedAt={value.uploaded}
                        publicName={value.publicName}
                        ext={value.metadata.ext}
                        path={value.path}
                        key={index + Date.now() * Math.random()}
                        showCategoryTitle={
                          this.props.showCategoryTitle ? true : false
                        }
                        subCategories={subCategories}
                      />
                    )
                  } else {
                    pastItems.push(
                      <Item
                        fileName={value.filename}
                        fileSize={value.metadata.size}
                        metadata={value.metadata}
                        uploadedAt={value.uploaded}
                        publicName={value.publicName}
                        ext={value.metadata.ext}
                        path={value.path}
                        key={index + Date.now() * Math.random()}
                        showCategoryTitle={
                          this.props.showCategoryTitle ? true : false
                        }
                        subCategories={subCategories}
                      />
                    )
                  }
                } else {
                  pastItems.push(
                    <Item
                      fileName={value.filename}
                      fileSize={value.metadata.size}
                      metadata={value.metadata}
                      uploadedAt={value.uploaded}
                      publicName={value.publicName}
                      ext={value.metadata.ext}
                      path={value.path}
                      key={index + Date.now() * Math.random()}
                      showCategoryTitle={
                        this.props.showCategoryTitle ? true : false
                      }
                      subCategories={subCategories}
                    />
                  )
                }
              }
            }
            let outputFilesList = []
            if (this.props.category && this.props.category.join('') === "TravelBookings") {
              outputFilesList = [
                upcomingItems.length === 0 ? null : <UpcomingTravelsHeader />,
                ...upcomingItems.reverse(),
                pastItems.length === 0 ? null : <PastTravelsHeader />,
                ...pastItems
              ]
            } else {
              outputFilesList = [
                ...pastItems,
                ...upcomingItems,
              ]
            }
            this.setState({
              // save the state of all files
              files: temp,

              // if the list is empty after the above operation, it means no
              // files of the selected category exists. Set setEmpty flag to true
              // to display an error saying no files exist
              isEmpty: outputFilesList.length === 0 ? true : false,

              // set filesList state to all files from current category
              filesList: outputFilesList,

              isLoading: false,
            }, () => console.log(this.state.filesList))
          } else {
            // show error
            this.setState({ error: response.error! })
          }
        })
      })
  }

  // method to run searchbar code to filter through the searches
  onSearchInput = (event: any) => {
    this.setState({ searchText: event.detail.value! })

    if (this.state.isLoading === true) {
      return
    }

    const latestSearchText = event.detail.value!
    this.setState({ filesList: null })

    const pastItems: any = []
    const upcomingItems: any = []

    if (latestSearchText === "") {
      const today = moment()
      console.log('in empty');
      /* for (const [index, value] of this.state.files.entries()) {
        let eventOn: string | null = value.eventOn
        if (eventOn) {
          eventOn = eventOn.slice(0, -6)
        }
        let subCategoryBoolean = true
        let options = null
        try {
          options = JSON.parse(value.metadata.additional_info)
        } catch (e) {
          options = value.metadata.additional_info
        }
        if (options) {
          if (this.props.subCategory?.indexOf(options.subCategory)) {
            subCategoryBoolean = false
          }
        } else subCategoryBoolean = false
        if (
          (value.metadata.category === this.state.redirect &&
            subCategoryBoolean) ||
          this.isSameSubCategory(
            this.state.redirect,
            value.metadata.additional_info?.subCategory,
            value.metadata.category,
          ) ||
          eventOn === this.state.redirect
        ) {
          // check for booking time if category is travel bookings
          if (value.metadata.category === "Travel Bookings") {
            // add the file to the list
            if (today.diff(moment(eventOn)) < 0) {
              upcomingItems.push(
                <Item
                  fileName={value.filename}
                  fileSize={value.metadata.size}
                  metadata={value.metadata}
                  uploadedAt={value.uploaded}
                  publicName={value.publicName}
                  ext={value.metadata.ext}
                  path={value.path}
                  key={index + Date.now() * Math.random()}
                  showCategoryTitle={
                    this.props.showCategoryTitle ? true : false
                  }
                  subCategories={this.state.subCategories}
                />
              )
            } else {
              pastItems.push(
                <Item
                  fileName={value.filename}
                  fileSize={value.metadata.size}
                  metadata={value.metadata}
                  uploadedAt={value.uploaded}
                  publicName={value.publicName}
                  ext={value.metadata.ext}
                  path={value.path}
                  key={index + Date.now() * Math.random()}
                  showCategoryTitle={
                    this.props.showCategoryTitle ? true : false
                  }
                  subCategories={this.state.subCategories}
                />
              )
            }
          }
        }
      } */
      this.getFileList().then((response) => {
          if (response.status === "success") {
            console.log("response: ", response)
            // empty array which will store JSX Components of Item
            const pastItems: any = []
            const upcomingItems: any = []

            // temp array to store only category files
            const temp: any = []

            // loop through all files and run it thorough a conditional to
            // pick only files matching the selected category
            for (const [index, value] of response.files.entries()) {
              let eventOn: string | null = value.eventOn
              let eventEnd: string | null = value.eventEnd
              if (eventOn) {
                eventOn = eventOn.slice(0, -6)
              }
              if (eventEnd) {
                eventEnd = eventEnd.slice(0, -6)
              } 

              let subCategoryBoolean = true
              let options = null
              try {
                options = JSON.parse(value.metadata.additional_info)
              } catch (e) {
                options = value.metadata.additional_info
              }
              if (options) {
                if (this.props.subCategory?.indexOf(options.subCategory)) {
                  subCategoryBoolean = false
                }
              } else subCategoryBoolean = false
              if (
                (value.metadata.category === this.state.redirect &&
                  subCategoryBoolean) ||
                this.isSameSubCategory(
                  this.state.redirect,
                  value.metadata.additional_info?.subCategory,
                  value.metadata.category,
                ) ||
                eventOn === this.state.redirect
                ||
                eventEnd === this.state.redirect
              ) {
                temp.push(value)

                // check for booking time if category is travel bookings
                if (
                  value.metadata.category === "Travel Bookings" &&
                  eventOn !== this.state.redirect
                ) {
                  // add the file to the list
                  if ((eventEnd && today.diff(moment(eventEnd)) < 0) || 
                    (eventOn && today.diff(moment(eventOn)) < 0)
                  ) {
                    upcomingItems.push(
                      <Item
                        fileName={value.filename}
                        fileSize={value.metadata.size}
                        metadata={value.metadata}
                        uploadedAt={value.uploaded}
                        publicName={value.publicName}
                        ext={value.metadata.ext}
                        path={value.path}
                        key={index + Date.now() * Math.random()}
                        showCategoryTitle={
                          this.props.showCategoryTitle ? true : false
                        }
                        subCategories={this.state.subCategories}
                      />
                    )
                  } else {
                    pastItems.push(
                      <Item
                        fileName={value.filename}
                        fileSize={value.metadata.size}
                        metadata={value.metadata}
                        uploadedAt={value.uploaded}
                        publicName={value.publicName}
                        ext={value.metadata.ext}
                        path={value.path}
                        key={index + Date.now() * Math.random()}
                        showCategoryTitle={
                          this.props.showCategoryTitle ? true : false
                        }
                        subCategories={this.state.subCategories}
                      />
                    )
                  }
                } else {
                  pastItems.push(
                    <Item
                      fileName={value.filename}
                      fileSize={value.metadata.size}
                      metadata={value.metadata}
                      uploadedAt={value.uploaded}
                      publicName={value.publicName}
                      ext={value.metadata.ext}
                      path={value.path}
                      key={index + Date.now() * Math.random()}
                      showCategoryTitle={
                        this.props.showCategoryTitle ? true : false
                      }
                      subCategories={this.state.subCategories}
                    />
                  )
                }
              }
            }
            let outputFilesList = []
            if (this.props.category && this.props.category.join('') === "TravelBookings") {
              outputFilesList = [
                upcomingItems.length === 0 ? null : <UpcomingTravelsHeader />,
                ...upcomingItems.reverse(),
                pastItems.length === 0 ? null : <PastTravelsHeader />,
                ...pastItems
              ]
            } else {
              outputFilesList = [
                ...pastItems,
                ...upcomingItems,
              ]
            }
            this.setState({
              // save the state of all files
              files: temp,

              // if the list is empty after the above operation, it means no
              // files of the selected category exists. Set setEmpty flag to true
              // to display an error saying no files exist
              isEmpty: outputFilesList.length === 0 ? true : false,

              // set filesList state to all files from current category
              filesList: outputFilesList,

              isLoading: false,
            }, () => console.log(this.state.filesList))
          } else {
            // show error
            this.setState({ error: response.error! })
          }
        })
    
    } else {
      const today = moment()
      console.log('in something')
      let index = 0
      for (let file of this.state.files) {
        // a function which can push files to be displayed if they match certain parameters
        // mentioned below
        // React doesn't like reference to futureInsert and pastInsert outside the loop. Disabling...
        // ...warning for now. What could go wrong?
        // eslint-disable-next-line
        const itemPush = (index: number) => {
          // check for booking time if category is travel bookings
          if (file.metadata.category === "Travel Bookings") {
            // add the file to the list
            if (today.diff(moment(file.eventOn)) < 0) {
              upcomingItems.push(
                <Item
                  fileName={file.filename}
                  fileSize={file.metadata.size}
                  metadata={file.metadata}
                  uploadedAt={file.uploaded}
                  publicName={file.publicName}
                  ext={file.metadata.ext}
                  path={file.path}
                  key={index + Date.now() * Math.random()}
                  showCategoryTitle={
                    this.props.showCategoryTitle ? true : false
                  }
                  subCategories={this.state.subCategories}
                />
              )
            } else {
              pastItems.push(
                <Item
                  fileName={file.filename}
                  fileSize={file.metadata.size}
                  metadata={file.metadata}
                  uploadedAt={file.uploaded}
                  publicName={file.publicName}
                  ext={file.metadata.ext}
                  path={file.path}
                  key={index + Date.now() * Math.random()}
                  showCategoryTitle={
                    this.props.showCategoryTitle ? true : false
                  }
                  subCategories={this.state.subCategories}
                />
              )
            }
          } else {
            pastItems.push(
              <Item
                fileName={file.filename}
                fileSize={file.metadata.size}
                metadata={file.metadata}
                uploadedAt={file.uploaded}
                publicName={file.publicName}
                ext={file.metadata.ext}
                path={file.path}
                key={index + Date.now() * Math.random()}
                showCategoryTitle={
                  this.props.showCategoryTitle ? true : false
                }
                subCategories={this.state.subCategories}
              />
            )
          }
        }
      
     
      

        // run through all file properties to see if any match the input string. If an input string
        // is matched, then the item is added into the 'itemPush' list which will be rendered
        try {
          if (file.filename) {
            if (
              file.filename
                .toLowerCase()
                .search(latestSearchText.toLowerCase()) !== -1
            ) {
              itemPush(index + Date.now() * Math.random())
              continue
            }
          }

          if (file.metadata) {
            if (
              file.metadata.ext
                .toLowerCase()
                .search(latestSearchText.toLowerCase()) !== -1
            ) {
              itemPush(index + Date.now() * Math.random())
              continue
            }

            if (
              file.metadata.category
                .toLowerCase()
                .search(latestSearchText.toLowerCase()) !== -1
            ) {
              itemPush(index + Date.now() * Math.random())
              continue
            }

            if (
              JSON.stringify(file.metadata.tags)
                .toLowerCase()
                .search(latestSearchText.toLowerCase()) !== -1
            ) {
              itemPush(index + Date.now() * Math.random())
              continue
            }
          }

          if (file.uploaded) {
            if (
              file.uploaded
                .toLowerCase()
                .search(latestSearchText.toLowerCase()) !== -1
            ) {
              itemPush(index + Date.now() * Math.random())
              continue
            }
          }

          if (file.eventOn) {
            if (
              file.eventOn
                .toLowerCase()
                .search(latestSearchText.toLowerCase()) !== -1
            ) {
              itemPush(index + Date.now() * Math.random())
              continue
            }
          }

          if (file.eventEnd) {
            if (
              file.eventEnd
                .toLowerCase()
                .search(latestSearchText.toLowerCase()) !== -1
            ) {
              itemPush(index + Date.now() * Math.random())
              continue
            }
          }

          if (file.metadata.additional_info) {
            if (
              JSON.stringify(file.metadata.additional_info)
                .toLowerCase()
                .search(latestSearchText.toLowerCase()) !== -1
            ) {
              itemPush(index + Date.now() * Math.random())
              continue
            }
          }
        } catch (e) {
          //FIXME: add error handling here
          console.log(e)
        }

        index += 1
      }
    }

    let outputFilesList = []
    if (this.props.category && this.props.category.join('') === "TravelBookings") {
      outputFilesList = [
        upcomingItems.length === 0 ? null : <UpcomingTravelsHeader />,
        ...upcomingItems.reverse(),
        pastItems.length === 0 ? null : <PastTravelsHeader />,
        ...pastItems
      ]
    } else {
      outputFilesList = [
        ...pastItems,
        ...upcomingItems,
      ]
    }
    this.setState({
      // if the list is empty after the above operation, it means no
      // files of the selected category exists. Set setEmpty flag to true
      // to display an error saying no files existH
      isEmpty: outputFilesList.length === 0 ? true : false,

      filesList: outputFilesList,
    })
  }

  render() {
    return (
      <React.Fragment>
      <GoBack />
        <IonAlert
          isOpen={!!this.state.error}
          message={this.state.error}
          buttons={[
            {
              text: "Okay",
              handler: () => {
                this.setState({ error: "" })
              },
            },
          ]}
        />

        <IonAlert
          isOpen={this.state.isStructureNotFound}
          message='Structure data not found. Please connect to the internet and open the category to download the structure'
          buttons={[
            {
              text: "Okay",
              handler: () => {
                this.setState({ isStructureNotFound: false })
                window.location.replace("/category")
              },
            },
          ]}
          onDidDismiss={() => {
            this.setState({ isStructureNotFound: false })
            window.location.replace("/category")
          }}
        />

        <IonLoading
          isOpen={this.state.isLoading}
          onDidDismiss={() => this.setState({ isLoading: false })}
          message={"Please wait..."}
        />

        <div>
          <div className='file-list center'>
            <div className='searchbar'>
              <IonSearchbar
                value={this.state.searchText}
                onIonChange={this.onSearchInput}
              />
            </div>
            {this.state.isLoading ? null : this.state.isEmpty ? (
              <div style={{ margin: "1rem auto", textAlign: "center" }}>
                No Results Found...
              </div>
            ) : (
              <div>
                
                {this.state.filesList}
              </div>
            )}
          </div>

          {/* FIXME: Need to fix the searchbar css issue */}
          
        </div>
      </React.Fragment>
    )
  }
}

export default FilesList
