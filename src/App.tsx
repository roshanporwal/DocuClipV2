import React from "react"

import "./globalStyle.css"

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css"

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css"
import "@ionic/react/css/structure.css"
import "@ionic/react/css/typography.css"

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css"
import "@ionic/react/css/float-elements.css"
import "@ionic/react/css/text-alignment.css"
import "@ionic/react/css/text-transformation.css"
import "@ionic/react/css/flex-utils.css"
import "@ionic/react/css/display.css"

/* Theme variables */
import "./theme/variables.css"

/* Code app imports */
import {
  Plugins
  //PushNotification,
  //PushNotificationToken,
  //PushNotificationActionPerformed,
} from "@capacitor/core"

import Routes from "./Routes"
import { IonAlert } from "@ionic/react"

type states = {
  shouldRedirect: boolean
  test: string
}
class App extends React.Component<{}, states> {
  constructor(props: {}) {
    super(props)

    this.state = {
      shouldRedirect: false,
      test: "none",
    }

    this.handleIntents = this.handleIntents.bind(this)

    this.handlePermissions()
    this.handleIntents()
    //this.handlePushNotifications()
  }

  /**
   * Handles intents received on cold starts + when app is running
   */
  handleIntents = () => {
    // FIXME: for some reason I am forced to do this. Reason:
    // 'this' implicitly has type 'any' because it does not have a type annotation.
    /**
     * Receives intent (file shared by another app) and processes it
     * at file upload
     *
     * @param Intent Cordova Intent
     */
    const recieveIntent = (Intent: any) => {
      if (Intent.clipItems) {
        // set local storage item then redirect to a different page. Easiest way to make
        // redirect work :(
        localStorage.setItem("FILE", JSON.stringify(Intent.clipItems[0]))

        this.setState({ shouldRedirect: true })
      }
    }

    document.addEventListener("deviceReady", () => {
      // since cordova plugins are used in a capacitor app, react doesn't know
      // that the 'plugin' property exists. To stop react, or more specifically
      // typescript from freaking out, I had to make TS just treat 'window' as a JS variable
      let windowObj: any = window

      if (windowObj.plugins && windowObj.plugins.intentShim) {
        // responds to intents which launch the app themselves
        windowObj.plugins.intentShim.getIntent(
          (Intent: any) => {
            if (sessionStorage.getItem("isCalledOnce") !== "true") {
              try {
                recieveIntent(Intent)
              } catch (error) {
                console.log("Error handled: ", error)
              }
            }
          },
          () => {
            console.log("Error getting launch intent")
          }
        )

        windowObj.plugins.intentShim.onIntent((Intent: any) => {
          if (Intent.hasOwnProperty('extras') && Intent.extras.hasOwnProperty('LocalNotificationUserAction')) {
            const options = JSON.parse(Intent.extras.LocalNotficationObject)
            window.location.href = "/file/" + options.extra[1]
          }
          try {
            recieveIntent(Intent)
          } catch (error) {
            console.log("Error handled: ", error)
          }
        })
      }

      window.addEventListener("onunload", () => {
        sessionStorage.setItem("isCalledOnce", "false")
      })
    })
  }

  /**
   * Asks for file system permissions to save or read files
   */
  handlePermissions = () => {
    // ask for permission to access filesystem
    // Filesystem.requestPermissions()

    //const { PushNotifications } = Plugins

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    // PushNotifications.requestPermission().then((result) => {
    //   if (result.granted) {
    //     // Register with Apple / Google to receive push via APNS/FCM
    //     PushNotifications.register()
    //   } else {
    //     // Show some error
    //   }
    // })
    // TODO: if permissions are denied, then contingency action must be taken
  }

  handlePushNotifications = () => {
   /* const { PushNotifications } = Plugins

    // On success, we should be able to receive notifications
    PushNotifications.addListener("registrationError", (error: any) => {
      alert("Error on registration: " + JSON.stringify(error))
    })

    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotification) => {
        alert("Push received: " + JSON.stringify(notification))
      }
    )

    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification: PushNotificationActionPerformed) => {
        alert("Push action performed: " + JSON.stringify(notification))
      }
    )*/
  }

  render() {
    return (
      <React.Fragment>
        <IonAlert
          isOpen={this.state.shouldRedirect}
          message='Are you sure you want to upload the file?'
          buttons={[
            {
              text: "No",
              handler: () => {
                localStorage.removeItem("FILE")
                this.setState({ shouldRedirect: false })
                sessionStorage.setItem("isCalledOnce", "true")
              },
            },
            {
              text: "Yes",
              handler: () => {
                this.setState({ shouldRedirect: false })
                window.location.href = "/upload_file"
                sessionStorage.setItem("isCalledOnce", "true")
              },
            },
          ]}
          onDidDismiss={() => sessionStorage.setItem("isCalledOnce", "true")}
        />
        <Routes />
      </React.Fragment>
    )
  }
}

export default App
