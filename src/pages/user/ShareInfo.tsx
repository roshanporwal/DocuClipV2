import { IonAlert, IonCheckbox, IonContent, IonIcon, IonModal, } from "@ionic/react"
import React from "react"
import { getToken, isLoggedIn } from "../../components/login/TokenProvider"
import "./profile.css"
import { close } from "ionicons/icons"
import QrCode from 'qrcode.react'

import AadharIcon from '../../assets/profile-icons/aadhaar-icon.png'
import AgeIcon from '../../assets/profile-icons/age-icon.png'
import BloodIcon from '../../assets/profile-icons/blood-group-icon.png'
import CardIcon from '../../assets/profile-icons/credit-card-icon.png'
import CityIcon from '../../assets/profile-icons/city_icon.png'
import DOBIcon from '../../assets/profile-icons/dob-icon.png'
import FatherIcon from '../../assets/profile-icons/father-icon.png'
import MailIcon from '../../assets/profile-icons/mail-icon.png'
import MobileIcon from '../../assets/profile-icons/mobile_icon.png'
import NameIcon from '../../assets/profile-icons/name_icon.png'
import SpouceIcon from '../../assets/profile-icons/spouce-icon.png'
import StateIcon from '../../assets/profile-icons/state_icon.png'
import VehicleIcon from '../../assets/profile-icons/vehicle-icon.png'
import MapIcon from '../../assets/profile-icons/map-icon.png'


type props = {}

type details = {
  userId: string
  userEmail: string
  userName: string
  fullname: string
  nickname: string
}
type states = {}

export default class ShareInfo extends React.Component<props, states> {
  
    main_details = {};
    additional_details = {};
    constructor(props: props) {
    super(props)

    if (!isLoggedIn() || getToken() === undefined) {
      window.location.replace("/")
    }

    const { userId, userEmail, userName, fullname, nickname } = getToken()

     this.main_details = {
        userId: userId,
        userEmail: userEmail,
        userName: userName,
        fullname: fullname,
        nickname: nickname
      }
    let add_data = localStorage.getItem('Additional Data');
  
    if(add_data){
        let {Address1,
            Address2,
            City,
            State,
            Father, 
            Spouce,
            Email,
            PAN,
            AadhaarCard,
            DOB,
            AgeinYear,
            Vehicle,
            BloodGroup} = JSON.parse(add_data);
        this.additional_details = {
              Address1 : {value:Address1,icon:MapIcon},
              Address2 : {value:Address2,icon:MapIcon},
              City : {value:City,icon:CityIcon},
              State : {value:State,icon:StateIcon},
              Father : {value:Father,icon:FatherIcon}, 
              Spouce : {value:Spouce,icon:SpouceIcon},
              Email : {value:Email,icon:MailIcon},
              PAN : {value:PAN,icon:CardIcon},
              AadhaarCard : {value:AadhaarCard,icon:AadharIcon},
              DOB : {value:DOB,icon:DOBIcon},
              AgeinYear : {value:AgeinYear,icon:AgeIcon},
              Vehicle : {value:Vehicle,icon:VehicleIcon},
              BloodGroup : {value:BloodGroup,icon:BloodIcon},
            }

        }
        this.state = {
            isModalOpen : false,
            error:null,
        }
    }
    showDate(date:Date){
        return date.toString().split('T')[0]
    }
    
    setShowModal(action:boolean){
        this.setState({isModalOpen : action})
    }

    generateQrCode(){
        // BarcodeScanner.encode(BarcodeScanner.Encode.TEXT_TYPE,this.state)
        // .then(data => {
        //     console.log(data)
        // },error => {
        //     console.log("Error : ",error)
        // });
        if(this.state["sharefields"])
            this.setShowModal(true)
        else
            this.setState({error:"Please select atleast one value"})
    }

    handleChange = (e: any) => {
        const { value, name } = e.target;
        this.setState({sharefields:{
            ...this.state["sharefields"], 
            [name]: value} }
        );
        console.log(this.state);
    };


  render() {
    return (
      <React.Fragment>
          <IonAlert
                isOpen={!!this.state["error"]}
                message={this.state["error"]}
                buttons={[
                {
                    text: "Okay",
                    handler: () => {
                    this.setState({error:null})
                    },
                },
                ]}
            />
          <IonModal isOpen={this.state["isModalOpen"]} cssClass="qr-modal">
              <IonContent>
                  <div className="text-center shareinfo-title">
                        <h1>Scan This Code to get Data</h1>
                  </div>
                  <div className="generated-qrcode text-center">
                        <QrCode value={JSON.stringify(this.state["sharefields"])} />
                  </div>
                    <div onClick={() => this.setShowModal(false)} className="text-center qr-close-sign ">
                        <IonIcon icon={close} size="large" />
                    </div>
                </IonContent>
          </IonModal>
        <div className="shareinfo-title">
            Select information to be shared
        </div>
        <div className="shareinfo-list">
            <div className='profile-card-item'>
                <div className="check-box-icon">
                    <IonCheckbox slot="start" color="primary" value={this.main_details["fullname"]} name="fullname" onIonChange={this.handleChange} />
                    <img src={NameIcon} height="30" width="28" />
                </div>
                <div className="details">
                    <span>Full name</span>
                    <p>{this.main_details["fullname"]}</p>
                </div>
            </div>
            <div className='profile-card-item'>
                <div className="check-box-icon">
                    <IonCheckbox slot="start" color="primary" value={this.main_details["userName"]} name="username" onIonChange={this.handleChange} />
                    <img src={MobileIcon} height="30" width="28" />
                </div>
                <div className="details">
                    <span>Mobile</span>
                    <p>{this.main_details["userName"]}</p>
                </div>
            </div>
            <div className='profile-card-item'>
                <div className="check-box-icon">
                    <IonCheckbox slot="start" color="primary" value={this.main_details["userEmail"]} name="useremail" onIonChange={this.handleChange}/>
                    <img src={MailIcon} height="30" width="28" />
                </div>
                <div className="details">
                    <span>Email Address</span>
                    <p>{this.main_details["userEmail"]}</p>
                </div>
            </div>
            <div className='profile-card-item'>
                <div className="check-box-icon">
                    <IonCheckbox slot="start" color="primary" value={this.main_details["nickname"]} name="nickname" onIonChange={this.handleChange} />
                    <img src={NameIcon} height="30" width="28" />
                </div>
                <div className="details">
                    <span>Nick name</span>
                    <p>{this.main_details["nickname"]}</p>
                </div>
            </div>
            {Object.keys(this.additional_details).map((item)=>{
                return(
                <div className='profile-card-item' key={item}>
                    <div className="check-box-icon">
                        <IonCheckbox slot="start" color="primary" value={this.additional_details[item]["value"]}  onIonChange={this.handleChange} name={item}/>
                        <img src={this.additional_details[item]["icon"]} height="30" width="28" />
                    </div>
                    <div className="details">
                        <span>{item}</span>
                        <p>{this.additional_details[item]["value"] ? item ==  "DOB" ? this.showDate(this.additional_details[item]["value"]) : this.additional_details[item]["value"] : "Not Uploaded"}</p>
                    </div>
                </div>)
            })}
            
        <div style={{marginBottom:"7rem"}}>
            <div className="profile-button text-center" onClick={() => this.generateQrCode()}>
                Click Here to share Qr code
            </div>
        </div>
        </div>
      </React.Fragment>
    )
  }
}
