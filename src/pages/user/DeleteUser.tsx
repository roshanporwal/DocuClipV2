import {
  IonAlert,
  IonButton,
  IonLoading,
  IonRow,
} from "@ionic/react"
import Axios from "axios"
import axios from "axios"
import React from "react"
import { getToken, isLoggedIn } from "../../components/login/TokenProvider"
import apiRoutes from "../../components/Routes"

import "./profile.css"

type props = {}
type states = {
  username:any,
  modalOpen:boolean
  error: string
  isLoading: boolean
}

export default class DeleteUser extends React.Component<props, states> {
  constructor(props: props) {
    super(props)
    const { userName } = getToken();
    if (! isLoggedIn()) {
      window.location.replace('/')
    }

    this.state = {
        username:userName,
      modalOpen:false,
        error: "",
      isLoading: false,
    }
  }
  deleteHandler(){
    console.log(this.state.username);
    let credentialData = new FormData()
    credentialData.append("username", this.state.username as string)
     const postResponse =  Axios.post(apiRoutes.deleteAccount,credentialData).then( (response) => {
        console.log(response);
        if(response.data.deleted == "success"){
           window.location.replace('/logout');
        }
        else{
            this.setState({error:'Some thing went wrong'})
        }
     });
  }
  render() {
    const inputFieldStyle = {
      width: "100%",
    }

    return (
      <React.Fragment>
          <IonAlert
          isOpen={this.state.modalOpen}
          backdropDismiss={false}
          message={'Are you sure you want to delete your account'}
          buttons={[
            {
              text: "Cancel",
              handler: () => {
               window.location.replace('/category')
                },
            },
            {
              text:'Delete Account',
              handler:() =>{
                this.deleteHandler()
              }
            }
          ]}
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

        <IonLoading
          isOpen={this.state.isLoading}
          onDidDismiss={() => this.setState({ isLoading: false })}
          message={"Please wait..."}
        />

        <div style={{marginTop:80}}>
            <p>Warning : Deleting this account would result in deleting all the files you stored on the server</p>
            <div style={{alignItems:'center'}}>
                <div className="button" onClick={() => this.setState({modalOpen:true}) }>
                    Delete My Account
                </div>
            </div>
        </div>
      </React.Fragment>
    )
  }
}
