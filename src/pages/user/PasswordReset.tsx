import {
  IonAlert,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonRow,
} from "@ionic/react"
import axios from "axios"
import React from "react"
import { getToken, isLoggedIn } from "../../components/login/TokenProvider"
import apiRoutes from "../../components/Routes"

import "./profile.css"

type props = {}
type states = {
  oldPassword: string
  newPassword: string
  newPasswordRepeat: string
  error: string
  isLoading: boolean
}

export default class PasswordReset extends React.Component<props, states> {
  constructor(props: props) {
    super(props)

    if (! isLoggedIn()) {
      window.location.replace('/')
    }

    this.state = {
      oldPassword: "",
      newPassword: "",
      newPasswordRepeat: "",
      error: "",
      isLoading: false,
    }
  }

  submitClickHandler = () => {
    this.setState({ isLoading: true })
    //TODO: add empty string validation after implementation
    if (this.state.newPassword === this.state.newPasswordRepeat) {
      const { userName } = getToken()

      let credentialData = new FormData()
      credentialData.append("username", userName)
      credentialData.append("password", this.state.oldPassword)
      axios
        .post(apiRoutes.login, credentialData)
        .then((response) => {
          if (response.data.status !== "success") {
            this.setState({
              isLoading: false,
              error: "Your old password is incorrect",
            })
          }
        })
        .catch((error) => {
          this.setState({
            isLoading: false,
            error: error,
          })
        })
        .then(() => {
          const { userId } = getToken()

          const passwordData = new FormData()
          passwordData.append('userId', userId)
          passwordData.append('newPassword', this.state.newPassword)
          axios.post(apiRoutes.changePassword, passwordData)
            .then((response) => {
              if (response.data.status === 'success') {
                window.location.replace('/profile')
              }
            }).catch((error) => {
              console.log('error: ', error);
              this.setState({
                isLoading: false,
                error: "There was an internal error"
              })
            })
        })
    } else this.setState({ error: "New passwords do not match" })

    this.setState({ isLoading: false })
  }

  onChangeHandler = (event: any) => {
    const name: string = event.target.name
    const value: string = event.target.value

    this.setState({ [name]: value } as any)
  }

  render() {
    const inputFieldStyle = {
      width: "100%",
    }

    return (
      <React.Fragment>
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

        <IonLoading
          isOpen={this.state.isLoading}
          onDidDismiss={() => this.setState({ isLoading: false })}
          message={"Please wait..."}
        />

        <IonRow>
          <IonItem style={inputFieldStyle}>
            <IonLabel position='floating'>Old Password</IonLabel>
            <IonInput
              type='password'
              name='oldPassword'
              value={this.state.oldPassword}
              onIonChange={this.onChangeHandler}
            />
          </IonItem>

          <IonItem style={inputFieldStyle}>
            <IonLabel position='floating'>New Password</IonLabel>
            <IonInput
              type='password'
              name='newPassword'
              value={this.state.newPassword}
              onIonChange={this.onChangeHandler}
            />
          </IonItem>

          <IonItem style={inputFieldStyle}>
            <IonLabel position='floating'>Repeat New Password</IonLabel>
            <IonInput
              type='password'
              name='newPasswordRepeat'
              value={this.state.newPasswordRepeat}
              onIonChange={this.onChangeHandler}
            />
          </IonItem>

          <IonButton style={inputFieldStyle} onClick={this.submitClickHandler}>
            Change Password
          </IonButton>
        </IonRow>
      </React.Fragment>
    )
  }
}
