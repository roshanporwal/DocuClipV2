import React, { useState, useEffect } from 'react';
import "./profile.css"
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
import BusinessIcon from '../../assets/profile-icons/briefcase.png'
import { flame } from 'ionicons/icons';
import axios from 'axios';
import apiRoutes from '../../components/Routes';

type details = {
  userId: string
  userEmail: string
  userName: string
  fullname: string
  businessname: any
  nickname: string
}

type props = { details: details }
type states = {
      Email :any,
      Gender:any,
      Father : any,
      Spouce : any,
      Address1 : any,
      Address2 : any,
      City : any,
      Pincode : any,
      State : any, 
      PAN : any,
      AadhaarCard : any,
      DOB : any,
      AgeinYear : any,
      Vehicle : any,
      BloodGroup : any,
      
}

const UserDetails: React.FC<{ details: details }> = ({ details }) => {
  const [state, setState] = useState<states>({
    //businessname: { value: '', icon: BusinessIcon },
    Email: { value: '', icon: MailIcon },
    Gender: { value: '', icon: GenderIcon },
    Father: { value: '', icon: FatherIcon },
    Spouce: { value: '', icon: SpouceIcon },
    Address1: { value: '', icon: MapIcon },
    Address2: { value: '', icon: MapIcon },
    City: { value: '', icon: CityIcon },
    Pincode: { value: '', icon: MapIcon },
    State: { value: '', icon: StateIcon },
    PAN: { value: '', icon: CardIcon },
    AadhaarCard: { value: '', icon: AadharIcon },
    DOB: { value: '', icon: DOBIcon },
    AgeinYear: { value: '', icon: AgeIcon },
    Vehicle: { value: '', icon: VehicleIcon },
    BloodGroup: { value: '', icon: BloodIcon },
  });
 //const [secretKey, setSecretKey] = useState<any>('----');

  useEffect(() => {
    const data1:any=localStorage.getItem('REACT_TOKEN_AUTH');
    const data=JSON.parse(data1);
    if(data.fullname === '0'){
      window.location.replace('/category');
    }
    const add_data = localStorage.getItem('Additional Data');

    if (add_data) {
      const {
       // businessname,
        Address1,
        Address2,
        City,
        Pincode,
        State,
        Father,
        Spouce,
        Email,
        Gender,
        PAN,
        AadhaarCard,
        DOB,
        AgeinYear,
        Vehicle,
        BloodGroup,
      } = JSON.parse(add_data);

      setState({
       // businessname: { value: businessname, icon: BusinessIcon },
        Email: { value: Email, icon: MailIcon },
        Gender: { value: Gender, icon: GenderIcon },
        Father: { value: Father, icon: FatherIcon },
        Spouce: { value: Spouce, icon: SpouceIcon },
        Address1: { value: Address1, icon: MapIcon },
        Address2: { value: Address2, icon: MapIcon },
        City: { value: City, icon: CityIcon },
        Pincode: { value: Pincode, icon: MapIcon },
        State: { value: State, icon: StateIcon },
        PAN: { value: PAN, icon: CardIcon },
        AadhaarCard: { value: AadhaarCard, icon: AadharIcon },
        DOB: { value: new Date(DOB).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }), icon: DOBIcon },
        AgeinYear: { value: AgeinYear, icon: AgeIcon },
        Vehicle: { value: Vehicle, icon: VehicleIcon },
        BloodGroup: { value: BloodGroup, icon: BloodIcon },
      });
    }
  }, []);

  /*const generateSecretKey = () =>{
    let OTP = (Math.floor(Math.random() * 10000) + 10000)
    .toString()
    .substring(1)
    //setSecretKey(OTP);
    let credentialData = new FormData()
      credentialData.append("username", details.userName);
      credentialData.append("secretcode", OTP);
      axios
      .post(apiRoutes.generateSecretCode, credentialData)
      .then((response) => { if(response.data.status==='success'){
        console.log('SecretCode stored in Database');
        setSecretKey(OTP);
      }
      })
      .catch((error) => {
        console.log(error)
        setSecretKey('----');
      });
  }*/

  const showDate = (date: Date) => {
    return date.toString().split('T')[0];
  };

  const showMail = () => {
    let mail = details.userEmail;
    if (mail.search(/'not_uploaded'/) === -1) {
      return details.userEmail;
    }
    return 'Not Uploaded';
  };

  return (
    <>
      <div className="MainDetails">
      <div className='profile-card-item'>
          <img src={NameIcon}/>
          <div className="details"> 
            <span>Full name</span>
            <p>{details.fullname}</p>
          </div>
        </div>

        <div className='profile-card-item'>
          <img src={BusinessIcon} width={'28px'}/>
          <div className="details"> 
            <span>Business name</span>
            <p>{details.businessname ? details.businessname: 'Not Uploaded'}</p>
          </div>
        </div>

        <div className='profile-card-item'>
          <img src={MobileIcon}/>
          <div className="details"> 
            <span>Mobile</span>
            <p>{details.userName}</p>
          </div>
        </div>

      </div>
      <div className="subDetails">
        {Object.keys(state).map((item) => {
          console.log(state[item]['value']);
          return (
            <div className='profile-card-item' key={item}>
                <img src={state[item]["icon"]} height="30" width="28" />
              <div className="details"> 
                <span>{item}</span>
                <p>{state[item]["value"] ? item ===  "DOB" ? showDate(state[item]["value"]) : state[item]["value"] : "Not Uploaded"}</p>
              </div>
            </div>)
        })}
      </div>
      {/*<div style={{display: 'flex', flexDirection: 'row',marginTop:'15px', justifyContent: 'space-around',lineHeight: '4px', height: '40px'}}>
        <button style={{backgroundColor: 'lightgreen', borderRadius: "5px", fontSize: '18px', fontWeight: 700}} onClick={generateSecretKey}>Generate Secret Key</button>
        <p style={{fontSize: '18px', fontWeight: 'bold'}}>{secretKey}</p>
      </div>*/}
      
    </>
  );
};

export default UserDetails;

