import React from "react"
import { IonLoading, IonAlert } from "@ionic/react"

// components
import Event from "../../components/calendar/Event"

// react-big-calendar imports
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"

// context-menu imports
import { ContextMenu, MenuItem, connectMenu } from "react-contextmenu"
import "./calendar.css"

// import network plugin
import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding,
} from "@capacitor/core"
// importing axios and its routes
import axios from "axios"
import apiRoutes from "../../components/Routes"

// importing auth functions
import { isLoggedIn, getToken } from "../../components/login/TokenProvider"
import { downloadCategoryStructure, getSubcategoryName } from "../../components/getSubcategoryName"

/*
    This is a code snippet from official docs of react-contextmenu
    https://github.com/vkbansal/react-contextmenu/blob/master/examples/DynamicMenu.js
    No idea how this is supposed to work as connectMenu has either no documentation or
    very difficult to find documentation available online.

    From what I've been able to piece together, this is supposed to receive props from
    connectMenu. This prop contains the id of ContextMenuTrigger, and trigger has
    metadata of ContextMenuTrigger, which includes 'collect' call back function (which
    sends back the event object with event related data like filename and publicName)
    which a child object of trigger. This information can be used to dynamically create
    a context menu.
*/
const DynamicMenu = (props: any) => {
  const { id, trigger } = props
  return (
    <ContextMenu id={id}>
      {trigger && <MenuItem>{trigger.itemLabel}</MenuItem>}
      {trigger && (
        <MenuItem>
          <b>{trigger.title}</b>
        </MenuItem>
      )}
      <MenuItem divider />
      {trigger && (
        <MenuItem
          data={{
            publicName: trigger.resource.publicName,
            redirect: "fileinfo",
          }}
          onClick={onClickEvent}
        >
          File Info
        </MenuItem>
      )}
      {trigger && (
        <MenuItem
          data={{
            publicName: trigger.resource.publicName,
            redirect: "filedownload",
          }}
          onClick={onClickEvent}
        >
          Download Page
        </MenuItem>
      )}
    </ContextMenu>
  )
}
const ConnectMenu = connectMenu("calendar-context")(DynamicMenu)

// context menu items can call this function to redirect user to either download page of
// the file or view file page.
const onClickEvent = (e: any, data: any) => {
  const { publicName, redirect } = data
  if (redirect === "filedownload")
    window.location.href = "/download/" + publicName
  if (redirect === "fileinfo") window.location.href = "/file/" + publicName
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
type props = {}
type states = {
  calendar: null | JSX.Element
  isLoading: boolean

  contextMenu: any

  error: string
}

class Calendar extends React.Component<props, states> {
  constructor(props: props) {
    super(props)

    this.state = {
      calendar: null,
      isLoading: true,

      error: "",

      // context menu
      contextMenu: null,
    }

    // check to see if user is logged in
    if (!isLoggedIn()) {
      window.location.replace("/")
    }
  }

  dateClickHandler = (slotInfo: any) => {
    const start: any = slotInfo.start

    const dayArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09']
    let day: string
    if (start.getDate() < 10 && start.getDate() > 0) {
      day = dayArray[start.getDate() - 1]
    } else
      day = start.getDate()

    const dateText = start.getFullYear() + '_' + start.getMonth() + '_' + day

    window.location.href = 'date/' + dateText
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
        this.setState({ isLoading: false })
        return { data: "" }
      })

      return JSON.parse(response.data)
    } else {
      const postResponse = await axios.post(apiRoutes.getCategories).then(
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
        this.setState({ isLoading: false })

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

  filterCategoryStructure(categoryStructure: SubCategoryResponse) {
    let subCategories: any = {}
    // retrieve the sub category
    for (const firstProperty in categoryStructure.additionalFields) {
      for (const secondProperty in categoryStructure.additionalFields[firstProperty][
        "subCategory"
      ]) {
        if (secondProperty === "category") continue
        subCategories[secondProperty] =
          categoryStructure.additionalFields[firstProperty]["subCategory"][
            secondProperty
          ]["title"]
      }
    }

    return subCategories
  }

  async componentDidMount() {
    // download the category structure if possible
    const categoryStructure = await this.getCategoryStructure()
    const subCategories = this.filterCategoryStructure(categoryStructure)
    console.log('subCategories: ', subCategories);
    const filesList = await this.getFileList()
    console.log('filesList: ', filesList);

    // empty array which will contain all big-calendar events
    const myEventsList: any = []

    // for each file the current user has linked to their account,
    // create a big-calendar event
    await filesList.files.forEach(async (file: any) => {
      // check to see if event exists
      if (file.eventOn) {
        // pack the data in big-calendar event object
        let eventName = file.filename
        if (file.metadata.category) {
          eventName = file.metadata.category
          if (file.metadata.additional_info.subCategory) {
            eventName = getSubcategoryName(subCategories, file.metadata.category, file.metadata.additional_info.subCategory)
          }
        }

        const tempObj: any = {
          title: '.',
          start: Date.parse(file.eventOn),
          end: Date.parse(file.eventOn),
          allDay: true,
          resource: {
            publicName: file.publicName,
            date: file.eventOn,
          },
        }

        // append the event to all events list
        myEventsList.push(tempObj)

        if (file.eventEnd && file.metadata.category === "Travel Bookings") {
          const tempObj: any = {
            title: '.',
            start: Date.parse(file.eventEnd),
            end: Date.parse(file.eventEnd),
            allDay: true,
            resource: {
              publicName: file.publicName,
              date: file.eventOn,
            },
          }

          // append the event to all events list
          myEventsList.push(tempObj)
        }
      }
    })

    // pass all these events to the calendar component and
    // load the calendar on the page
    const calendar = (
      <BigCalendar
        popup
        localizer={momentLocalizer(moment)}
        events={myEventsList}
        views={["month"]}
        startAccessor='start'
        endAccessor='end'
        style={{ height: "52vh"}}
        components={{ event: Event }}
        selectable={true}
        onSelectSlot={(slotInfo) => {
          this.dateClickHandler(slotInfo)
        }}
        longPressThreshold={1}
      />
    )
    this.setState({
      calendar: calendar,
      isLoading: false,
    })
  }

  render() {
    return (
      <div>
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
              text: "Okay",
              handler: () => {
                this.setState({ error: "" })
              },
            },
          ]}
        />
        <div className="calendar">
        {this.state.calendar}
        </div>
        <ConnectMenu />
      </div>
    )
  }
}

export default Calendar
