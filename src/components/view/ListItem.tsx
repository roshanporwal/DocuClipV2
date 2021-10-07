import React, { useState, useEffect } from "react"
import { IonAlert, IonButton, IonLoading, IonSearchbar } from "@ionic/react"

// import components
import Item from "../../components/view/Item"

// import axios and api routes
import axios from "axios"
import apiRoutes from "../Routes"

// import auth functions
import { getToken } from "../../components/login/TokenProvider"

type Props = {
  title: string
  backClickHandler: any
}

const ListItem: React.FC<Props> = (props) => {
  const [error, setError] = useState<string>()
  const [isLoading, setLoading] = useState<boolean>(true)

  // list of all files in the selected category
  const [filesList, setFilesList] = useState<any>()
  // state to set a flag if no files exist in the current selected category
  const [isEmpty, setEmpty] = useState<boolean>(true)
  // state to save the searchText
  const [searchText, setSearchText] = useState<string>()
  // state to save the info of all files
  const [files, setFiles] = useState<any>()
  const [subCategories, setSubCategories] = useState<any>()

  // run this code once
  // get userID of current logged in user
  const loggedInUserId = getToken().userId
  useEffect(() => {
    // make api call to retrieve all the categories the file can be saved as
    axios.post(apiRoutes.getCategories)
    .then((response) => {
      return response.data.additionalFields
    })
    .then((additionalFields) => {
      let subCategories: any = {}
      // retrieve the sub category
      for (const firstProperty in additionalFields) {
        for (const secondProperty in additionalFields[firstProperty]['subCategory']) {
          if (secondProperty === 'category') continue
          subCategories[secondProperty] = additionalFields[firstProperty]['subCategory'][secondProperty]['title']
        }
      }

      return subCategories
    })
    .then((subCategories) => {
      console.log('subCategories: ', subCategories);
      setSubCategories(subCategories)
    })
    .then(() => {
      // make an api call to get all the information
      const formData = new FormData()
      formData.append("userId", loggedInUserId)
      axios.post(apiRoutes.listAll, formData).then((response) => {
        if (response.data.status === "success") {
          // empty array which will store JSX Components of Item
          const items: any = []

          // temp array to store only category files
          const temp: any = []

          // loop through all files and run it thorough a conditional to
          // pick only files matching the selected category
          for (const [index, value] of response.data.files.entries()) {
            if (value.metadata.category === props.title) {
              temp.push(value)
              // add the file to the list
              items.push(
                <Item
                  fileName={value.filename}
                  fileSize={value.metadata.size}
                  metadata={value.metadata}
                  uploadedAt={value.uploaded}
                  publicName={value.publicName}
                  ext={value.metadata.ext}
                  path={value.path}
                  key={index + Date.now() * Math.random()}
                  showCategoryTitle={false}
                  subCategories={subCategories}
                />
              )
            }
          }
          // save the state of all files
          setFiles(temp)

          // if the list is empty after the above operation, it means no
          // files of the selected category exists. Set setEmpty flag to true
          // to display an error saying no files exist
          items.length === 0 ? setEmpty(true) : setEmpty(false)

          // set filesList state to all files from current category
          setFilesList(items)
          setLoading(false)
        } else {
          setError(response.data.error)
        }
      })
    })
  }, [loggedInUserId, props.title, subCategories])

  // method to run searchbar code to filter through the searches
  const onSearchInput = (event: any) => {
    setSearchText(event.detail.value!)

    if (isLoading === true) {
      return
    }

    const latestSearchText = event.detail.value!
    setFilesList(null)

    const items: any = []
    if (latestSearchText === "") {
      for (const [index, value] of files.entries()) {
        if (value.metadata.category === props.title) {
          // add the file to the list
          items.push(
            <Item
              fileName={value.filename}
              fileSize={value.metadata.size}
              metadata={value.metadata}
              uploadedAt={value.uploaded}
              publicName={value.publicName}
              ext={value.metadata.ext}
              path={value.path}
              key={index + Date.now() * Math.random()}
              showCategoryTitle={false}
              subCategories={subCategories}
            />
          )
        }
      }
    } else {
      let index = 0
      for (let file of files) {
        // a function which can push files to be displayed if they match certain parameters
        // mentioned below
        const itemPush = (index: number) => {
          items.push(
            <Item
              fileName={file.filename}
              fileSize={file.metadata.size}
              metadata={file.metadata}
              uploadedAt={file.uploaded}
              publicName={file.publicName}
              ext={file.metadata.ext}
              path={file.path}
              key={index + Date.now() * Math.random()}
              showCategoryTitle={false}
              subCategories={subCategories}
            />
          )
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

          if (file.additional_info) {
            if (
              file.additional_info
                .toLowerCase()
                .search(latestSearchText.toLowerCase()) !== -1
            ) {
              itemPush(index + Date.now() * Math.random())
              continue
            }
          }
        } catch (e) {
          //FIXME: add error handling here
        }

        index += 1
      }
    }

    // if the list is empty after the above operation, it means no
    // files of the selected category exists. Set setEmpty flag to true
    // to display an error saying no files exist
    items.length === 0 ? setEmpty(true) : setEmpty(false)

    setFilesList(items)
  }

  return (
    <React.Fragment>
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

      <IonLoading
        isOpen={!!isLoading}
        onDidDismiss={() => setLoading(false)}
        message={"Please wait..."}
      />

      <div>
        <div className='item-header'>
          <h4>{props.title}</h4>
          <IonButton onClick={() => props.backClickHandler()}>Back</IonButton>
        </div>

        <div className='file-list center'>
          {!!isLoading ? null : !!isEmpty ? (
            <div style={{ margin: "1rem auto", textAlign: "center" }}>
              No Results Found...
            </div>
          ) : (
            filesList
          )}
        </div>

        <div className='searchbar'>
          <IonSearchbar value={searchText} onIonChange={onSearchInput} />
        </div>
      </div>
    </React.Fragment>
  )
}

export default ListItem
