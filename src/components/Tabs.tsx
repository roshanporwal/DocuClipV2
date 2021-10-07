import React from "react"
import { IonBadge, IonIcon, IonTabButton,IonMenuToggle,IonRouterLink } from "@ionic/react"
import {
  calendar,
  cloudUploadSharp,
  notifications,
  scanCircleOutline,
  personCircle,
} from "ionicons/icons"
import MenuButton from "../assets/category-button.png"
import { getToken, isLoggedIn } from "./login/TokenProvider"
import apiRoutes from "./Routes"
import Axios from "axios"

type props = {}
type states = { notificationsCount: number }

class Tabs extends React.Component<props, states> {
  constructor(props: props) {
    super(props)

    this.state = {
      notificationsCount: 0,
    }
  }

  checkCurrentPage(tabhref:any){
    if (window.location.href.endsWith(tabhref))
      return true
    return false 
  }


  componentDidMount() {
    if (isLoggedIn()) {
      const formData = new FormData()
      formData.append("userId", getToken().userId)
      Axios.post(apiRoutes.notifications.get, formData)
        .then((response) => {
          if (response.data.status === "success") {
            this.setState({ notificationsCount: response.data.count })
          }
        })
        .catch((error) => {
          console.log("error: ", error)
        })
    }
  }
  render() {
    return (
      <>
        <div className="menu-container">
          
          <div className='menu-tabs tabs-left'>
            <IonRouterLink className={`menu-tabs-icon ${this.checkCurrentPage('/calendar') ? 'text-dark': null}`} href='/calendar'>
              <IonIcon icon={calendar} />
            </IonRouterLink>

            <IonRouterLink className={`menu-tabs-icon ${this.checkCurrentPage('/upload') ? 'text-dark': null}`}   href='/upload'>
              <IonIcon icon={cloudUploadSharp} />
            </IonRouterLink>
          </div>
          
          <div className="menu-tabs tabs-right">
            <IonRouterLink className={`menu-tabs-icon ${this.checkCurrentPage('/notifications') ? 'text-dark': null}`} href='/notifications'>
              <IonIcon icon={notifications} />
              <IonBadge color='danger'>{this.state.notificationsCount}</IonBadge>

            </IonRouterLink>
            <IonRouterLink className={`menu-tabs-icon ${this.checkCurrentPage('/profile') ? 'text-dark': null}`} href="/profile" >        
              <IonIcon icon={personCircle} />
            </IonRouterLink>

            
          </div>
        </div>
        <IonTabButton className={`scan-icon ${this.checkCurrentPage('/scanner') ? 'text-dark': null}`} href='/scanner'>
            <IonIcon icon={scanCircleOutline} />
        </IonTabButton>
      </>
      );
  }
} 

export default Tabs
