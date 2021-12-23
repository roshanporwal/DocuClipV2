import { IonButton, IonIcon, IonRouterLink } from "@ionic/react"
import React from "react"
import { getToken, isLoggedIn } from "../../components/login/TokenProvider"
import {createOutline, shareSocial} from 'ionicons/icons'
import "./profile.css"
import UserDetails from "./UserDetails"
import ProfileImage from "../../assets/blankimage.png"
import GoBack from "../../components/goBack"


type props = {}

type details = {
  userId: string
  userEmail: string
  userName: string
  fullname: string
  nickname: string
}
type states = {
  details: details
}

export default class Profile extends React.Component<props, states> {
  constructor(props: props) {
    super(props)

    if (!isLoggedIn() || getToken() === undefined) {
      window.location.replace("/")
    }

    const { userId, userEmail, userName, fullname, nickname } = getToken()

    this.state = {
      details: {
        userId: userId,
        userEmail: userEmail,
        userName: userName,
        fullname: fullname,
        nickname: nickname
      },
    }
  }

  render() {
    return (
      <React.Fragment>
        <GoBack />
        <div className='profile-card-content'>
          {/* <div className="profile-photo">
            <img src={ProfileImage}/>
          </div> */}
          <div className="edit-and-share"> 
            <div>   
              <IonRouterLink href="/profile/change-info">
                <IonIcon icon={createOutline} class="profile-page-icon" />
              </IonRouterLink>
            </div>
            <div>
              <IonRouterLink  href='/profile/share-info'>
                <IonIcon icon={shareSocial} class="profile-page-icon" />
              </IonRouterLink>
            </div>
          </div>
        </div>
        <div className="user-details">
          <UserDetails details={this.state.details} />
        </div>
      </React.Fragment>
    )
  }
}
