import { IonIcon } from "@ionic/react"
import React from "react"
import "./profile.css"
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

type details = {
  userId: string
  userEmail: string
  userName: string
  fullname: string
  nickname: string
}

type props = { details: details }
type states = {
              Address1 : any,
              Address2 : any,
              City : any,
              State : any,
              Father : any, 
              Spouce : any,
              Email :any,
              PAN : any,
              AadhaarCard : any,
              DOB : any,
              AgeinYear : any,
              Vehicle : any,
              BloodGroup : any,
}

export default class UserDetails extends React.Component<props, states> {

  constructor(props: props) {
    super(props)

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


        this.state = {
              Address1 : {value:Address1,icon:MapIcon},
              Address2 : {value:Address2,icon:MapIcon},
              City : {value:City,icon:CityIcon},
              State : {value:State,icon:StateIcon},
              Father : {value:Father,icon:FatherIcon}, 
              Spouce : {value:Spouce,icon:SpouceIcon},
              Email:{value:Email,icon:MailIcon},
              PAN : {value:PAN,icon:CardIcon},
              AadhaarCard : {value:AadhaarCard,icon:AadharIcon},
              DOB : {value:DOB,icon:DOBIcon},
              AgeinYear : {value:AgeinYear,icon:AgeIcon},
              Vehicle : {value:Vehicle,icon:VehicleIcon},
              BloodGroup : {value:BloodGroup,icon:BloodIcon},
          }

    }
    else{
      this.state = {
              Address1 : {value: "",icon:MapIcon},
              Address2 : {value: "",icon:MapIcon},
              City : {value: "",icon:CityIcon},
              State : {value: "",icon:StateIcon},
              Father : {value: "",icon:FatherIcon}, 
              Spouce : {value: "",icon:SpouceIcon},
              Email:{value:"",icon:MailIcon},
              PAN : {value: "",icon:CardIcon},
              AadhaarCard : {value: "",icon:AadharIcon},
              DOB : {value: "",icon:DOBIcon},
              AgeinYear : {value: "",icon:AgeIcon},
              Vehicle : {value: "",icon:VehicleIcon},
              BloodGroup : {value: "",icon:BloodIcon},
          }
    }
    
  }

  showDate(date:Date){
    return date.toString().split('T')[0]
  }

  showMail(){
    let mail = this.props.details.userEmail
    if(mail.search(/'not_uploaded'/) == -1)
    {
      return this.props.details.userEmail;
    }
      return "Not Uploaded";

  }
  
  render() {
      
    return (
      <>
      <div className="MainDetails">

        <div className='profile-card-item'>
          <img src={NameIcon}/>
          <div className="details"> 
            <span>Full name</span>
            <p>{this.props.details.fullname}</p>
          </div>
        </div>

        <div className='profile-card-item'>
          <img src={MobileIcon}/>
          <div className="details"> 
            <span>Mobile</span>
            <p>{this.props.details.userName}</p>
          </div>
        </div>
        {/* <div className='profile-card-item'>
          <img src={MailIcon} width="28px"/>
          <div className="details"> 
            <span>Email Address</span>
            <p>{this.showMail()}</p>
          </div>
        </div>
 */}
        {/* <div className='profile-card-item'>
          <img src={NameIcon} />
          <div className="details"> 
            <span>Nick name</span>
            <p>{this.props.details.nickname}</p>
          </div>
        </div> */}
      </div>
      <div className="subDetails">

        {Object.keys(this.state).map((item)=>{
          console.log(this.state[item]["value"])
            return(
            <div className='profile-card-item' key={item}>
                <img src={this.state[item]["icon"]} height="30" width="28" />
              <div className="details"> 
                <span>{item}</span>
                <p>{this.state[item]["value"] ? item ==  "DOB" ? this.showDate(this.state[item]["value"]) : this.state[item]["value"] : "Not Uploaded"}</p>
              </div>
            </div>)
        })}
      </div>
      </>
    )
  }
}
