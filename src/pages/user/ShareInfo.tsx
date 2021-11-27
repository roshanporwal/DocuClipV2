import { IonAlert, IonCheckbox, IonContent, IonIcon, IonModal, } from "@ionic/react"
import React from "react"
import { getToken, isLoggedIn } from "../../components/login/TokenProvider"
import "./profile.css"
import { close, share } from "ionicons/icons"
import QrCode from 'qrcode.react'

import AadharIcon from '../../assets/profile-icons/aadhaar-icon.png'
import AgeIcon from '../../assets/profile-icons/age-icon.png'
import BloodIcon from '../../assets/profile-icons/blood-group-icon.png'
import CardIcon from '../../assets/profile-icons/credit-card-icon.png'
import CityIcon from '../../assets/profile-icons/city_icon.png'
import DOBIcon from '../../assets/profile-icons/dob-icon.png'
import FatherIcon from '../../assets/profile-icons/father-icon.png'
import GenderIcon from '../../assets/profile-icons/gender-icon.png'
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
type states = {
    isModalOpen : boolean,
    error:any,
    additional_details : object,
}

export default class ShareInfo extends React.Component<props, states> {
  
    main_details = {};
    constructor(props: props) {
    super(props)

    if (!isLoggedIn() || getToken() === undefined) {
      window.location.replace("/")
    }

    const { userId, userEmail, userName, fullname, nickname } = getToken()

     this.main_details = {
        userId: userId,
        userEmail: userEmail,
        mobile: userName,
        fullname: fullname,
        nickname: nickname
      }

    this.state = {
            isModalOpen : false,
            error:null,
            additional_details :{
              Fullname: {value:fullname,icon:NameIcon,checked:false},
              Mobile: {value:userName,icon:MobileIcon,checked:false},
        }
    }
    let add_data = localStorage.getItem('Additional Data');
  
    if(add_data){
        let {Address1,
            Address2,
            City,
            State,
            Father, 
            Spouce,
            Gender,
            Email,
            PAN,
            AadhaarCard,
            DOB,
            AgeinYear,
            Vehicle,
            BloodGroup} = JSON.parse(add_data);
            this.state = {
            isModalOpen : false,
            error:null,
            additional_details :{
              Fullname: {value:fullname,icon:NameIcon,checked:false},
              Mobile: {value:userName,icon:MobileIcon,checked:false},
              Email : {value:Email,icon:MailIcon,checked:false},
              Gender : {value:Gender,icon:GenderIcon,checked:false}, 
              Father : {value:Father,icon:FatherIcon,checked:false}, 
              Spouce : {value:Spouce,icon:SpouceIcon,checked:false},
              Address1 : {value:Address1,icon:MapIcon,checked:false},
              Address2 : {value:Address2,icon:MapIcon,checked:false},
              City : {value:City,icon:CityIcon,checked:false},
              State : {value:State,icon:StateIcon,checked:false},
              PAN : {value:PAN,icon:CardIcon,checked:false},
              AadhaarCard : {value:AadhaarCard,icon:AadharIcon,checked:false},
              DOB : {value:new Date(DOB).toLocaleString('en-GB', { day:'2-digit',month:'2-digit',year:'numeric' }),icon:DOBIcon,checked:false},
              AgeinYear : {value:AgeinYear,icon:AgeIcon,checked:false},
              Vehicle : {value:Vehicle,icon:VehicleIcon,checked:false},
              BloodGroup : {value:BloodGroup,icon:BloodIcon,checked:false},
            },
        }
        }
        
    }
    showDate(date:Date){
        return date.toString().split('T')[0]
    }
    
    setShowModal(action:boolean){
        this.setState({isModalOpen : action})
    }

    generateQrCode(){
        if(this.state.additional_details)
            this.setShowModal(true)
        else
            this.setState({error:"Please select atleast one value"})
    }

    getQRData(){
        let shares: string[] = [];
        Object.keys(this.state.additional_details).map((item) =>{
            let val = `${item} : ${this.state.additional_details[item]["value"]}`
            if(this.state.additional_details[item]["checked"])  
                shares.push(val)  
        });
        console.log(shares);
        return JSON.stringify(shares);

    }

    handleChange = (e: any) => {
        const { value, name } = e.target;
        let oldval = this.state.additional_details[name]
        this.setState({additional_details:{
            ...this.state.additional_details, 
            [name]: {value,icon:oldval.icon,checked:true} }}
        );
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
                        <QrCode value={this.getQRData()} />
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
            {/* <div className='profile-card-item'>
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
                    <IonCheckbox slot="start" color="primary" value={this.main_details["mobile"]} name="mobile" onIonChange={this.handleChange} />
                    <img src={MobileIcon} height="30" width="28" />
                </div>
                <div className="details">
                    <span>Mobile</span>
                    <p>{this.main_details["mobile"]}</p>
                </div>
            </div> */}
            {/* <div className='profile-card-item'>
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
            </div> */}
            {Object.keys(this.state.additional_details).map((item)=>{
                return(
                <div className='profile-card-item' key={item}>
                    <div className="check-box-icon">
                        <IonCheckbox slot="start" color="primary" value={this.state.additional_details[item]["value"]}  onIonChange={this.handleChange} name={item}/>
                        <img src={this.state.additional_details[item]["icon"]} height="30" width="28" />
                    </div>
                    <div className="details">
                        <span>{item}</span>
                        <p>{this.state.additional_details[item]["value"] ? item ==  "DOB" ? this.showDate(this.state.additional_details[item]["value"]) : this.state.additional_details[item]["value"] : "Not Uploaded"}</p>
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
