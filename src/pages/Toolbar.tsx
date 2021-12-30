import React from "react"
import { IonButtons, IonContent, IonPage, IonRouterLink } from "@ionic/react"
import BottomBar from "../assets/bottombar.svg"
import "./Toolbar.css"
import MenuButton from "../assets/category-button.png"
import Tabs from "../components/Tabs"
import topSvg from "../assets/top-bg.svg"
import bottomSvg from "../assets/bottom-bg.svg"
import GoBack from "../components/goBack"
//This is the file that calls all other file
const MenuTemplate: React.FC<{
  name: string
  component: any
  tabs?: boolean
}> = (props) => {/* 
  const classNameValue = props.tabs ? 'header-margin-tabs main-container' : 'header-margin main-container' */
  return (
    <IonPage >
      <IonContent className="main-page">
        <div className="top-svg-bg">
          <img src={topSvg} />
        </div>
            <div className='toolbar'>
             
                {props.name == 'Categories' ? 
                  (
                      <div>
                        <p className='toolbar-header'>{props.name}</p>
                      </div>
                  )
                  : 
                  (
                     <div style={{display:'flex',alignItems:'center',marginLeft:10,height:'4em'}}>
                      <GoBack />
                      <div>
                        <p className='toolbar-header'>{props.name}</p>
                      </div>
                    </div>
                  )
                }
              {/* <p style={{ color: "grey", fontSize: "10px", margin: 'auto 0 10px auto' }}>beta_22</p> */}
              <div className="back-to-cat">
                <IonRouterLink routerLink="/category">
                  <img src={MenuButton} alt='menu' />
                </IonRouterLink>
              </div>
            </div>
            {/* //All components go here */}
              <div className="header-margin-tabs main-container">
                {props.component}
              </div>
            {/* Tabs placed at bottom */}
            <div className="bottom-bar">
              <img src={BottomBar} alt="" />
            </div>
            <div className="toolbar-tabs">
                <Tabs />
            </div>
          
          <div className="bottom-svg-bg">
            <img src={bottomSvg} />
          </div> 
          
      </IonContent>

    </IonPage>
  )
}

export default MenuTemplate
