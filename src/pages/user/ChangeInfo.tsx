import {
  IonAlert,
  IonButton,
  IonDatetime,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonRow,
} from "@ionic/react"
import axios from "axios"
import { arrowBack } from "ionicons/icons"
import React from "react"
import { JsxEmit } from "typescript"
import { destroyToken, getToken, isLoggedIn, setToken } from "../../components/login/TokenProvider"
import apiRoutes from "../../components/Routes"
import "./profile.css"

type props = {}
type states = {
  
    username: string
    email: string
    fullname: string
    businessname: string
    nickname: string

    error: string
    isLoading: boolean,
    additionalData:{
      
        Father : string, 
        Gender : string,
        Address1 : string,
        Address2 : string,
        City : string,
        Pincode : string,
        State : string,
        Spouce : string,
        Email : string,
        PAN : string,
        AadhaarCard : string,
        DOB : string,
        AgeinYear : string,
        Vehicle : string,
        BloodGroup : string,
  }
}

type add_data = string

export default class ChangeInfo extends React.Component<props, states> {
  constructor(props: props) {
    super(props)

    if (! isLoggedIn()) {
      window.location.replace('/')
    }

    const { userEmail, userName, fullname, nickname , businessname,} = getToken()    
    let add_data = localStorage.getItem('Additional Data');
    if(add_data){
      let { Address1,Address2,City,Pincode, State,Gender,Father,Spouce,Email,PAN,AadhaarCard,DOB,AgeinYear,Vehicle,BloodGroup} = JSON.parse(add_data);
    
        this.state = {
            username: userName,
            email: userEmail.search(/'not_uploaded'/) == -1 ? userEmail : "Not Uploaded",
            fullname: fullname,
            businessname: businessname,
            nickname: nickname,
            error: "",
          isLoading: false,
            additionalData:{
              Email : Email,

              Father : Father,
              Gender:Gender, 
              Address1 : Address1,
              Address2 : Address2,
              City : City,
              Pincode : Pincode,
              State : State,
              Spouce : Spouce,
              PAN : PAN,
              AadhaarCard : AadhaarCard,
              DOB : DOB,
              AgeinYear : AgeinYear,
              Vehicle : Vehicle,
              BloodGroup : BloodGroup,
            }
          }
    }
    else{
      this.state = {
        username: userName,
        email: userEmail.search('not_uploaded') ===-1 ?  userEmail : "Not Uploaded",
        fullname: fullname,
        businessname: businessname,
        nickname: nickname,
        error: "",
      isLoading: false,
      additionalData:{

        Email : "",
        Father : "",
        Gender:"",
        Address1 : "",
        Address2 : "",
        City : "",
        Pincode : "",
        State : "", 
        Spouce : "",
        PAN : "",
        AadhaarCard : "",
        DOB : "",
        AgeinYear : "",
        Vehicle : "",
        BloodGroup : "",
      }
    }
    }
    
    
  }

  submitClickHandler = () => {
    this.setState({ isLoading: true })

    // TODO: implement update user info
    // 1. Add field validation (tick)
    // 2. Update fields and take back to profile view (tick)
    // 3. Remove old token and get new token in its place (untick)

    // validation
    if (!this.state.username || !this.state.email || !this.state.fullname || !this.state.nickname) {
      this.setState({ error: "None of the fields can be empty", isLoading: false })
      return
    }

    
    // update fields
    let userData = new FormData()
    const userId = getToken().userId
    userData.append("id", userId)
    userData.append("username", this.state.username)
    userData.append("email", this.state.email)
    userData.append("fullname", this.state.fullname)
    userData.append("nickname", this.state.nickname)

    axios
      .post(apiRoutes.profile.updateDetails, userData)
      .then((response) => {
        console.log('response.data: ', response.data);
        if (response.data.status === 'success') {
          // destroy the previous token and create a new one in its place
          destroyToken()

          const tokenData = {
            "status": "success",
            "userId": userId,
            "userEmail": this.state.email,
            "userName": this.state.username,
            "fullname": this.state.fullname,
            "businessname": this.state.businessname,
            "nickname": this.state.nickname,
            "jwtToken": ""
          }
          setToken(tokenData)

          window.location.replace('/profile')
        } else {
          this.setState({ error: response.data.error })
        }
      })
      .catch((error) => {
        this.setState({ error: "An error occurred while contacting the server. Please try again after a while.", isLoading: false })
        console.log("update error: ", error)
      })
    
      if(localStorage.getItem('Additional Data')){
        localStorage.removeItem('Addtional Data')
        localStorage.setItem('Additional Data',JSON.stringify(this.state.additionalData))
      }
      else{
        localStorage.setItem('Additional Data',JSON.stringify(this.state.additionalData))
      }

    this.setState({ isLoading: false })
  }

  onChangeHandler = (event: any) => {
    const name: string = event.target.name
    const value: string = event.target.value

    this.setState({ [name]: value } as any)
  }
  getAge = (dateString:string) => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }
  onAdditionalChangeHandler = (event: any) => {
    const name: string = event.target.name
    const value: string = event.target.value

      this.setState({additionalData :{ ...this.state.additionalData,[name]: value }} as any)

    if(this.state.additionalData.DOB !== ""){ 
      let age =  this.getAge(this.state.additionalData.DOB);
      this.setState({additionalData :{ ...this.state.additionalData,AgeinYear: age}} as any)
    }
  }


  render() {
    const inputFieldStyle = {
      width: "100%",
    }

    return (
      <React.Fragment>
            {/* <div onClick = {()=>window.history.back()}>
                <IonIcon icon={arrowBack} class="profile-page-icon" />
            </div> */}
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

        
{/* 
          <IonItem style={inputFieldStyle}>
            <IonLabel position='floating'>Email</IonLabel>
            <IonInput
              type='text'
              name='email'
              value={this.state.email}
              onIonChange={this.onChangeHandler}
            />
          </IonItem> */}

          
          <IonRow>
            <IonItem style={inputFieldStyle}>
            <IonLabel position='floating'> Full Name</IonLabel>
            <IonInput
              type='text'
              name='fullname'
              value={this.state.fullname}
              onIonChange={this.onChangeHandler}
            />
          </IonItem>
          <IonItem style={inputFieldStyle}>
            <IonLabel position='floating'> Business Name</IonLabel>
            <IonInput
              type='text'
              name='businessname'
              value={this.state.businessname}
              onIonChange={this.onChangeHandler}
            />
          </IonItem>
          <IonItem style={inputFieldStyle}>
            <IonLabel position='floating'>Mobile No</IonLabel>
            <IonInput
              type='text'
              name='username'
              value={this.state.username}
              onIonChange={this.onChangeHandler}
            />
          </IonItem>
          
          {/* <IonItem style={inputFieldStyle}>
            <IonLabel position='floating'>Nickname</IonLabel>
            <IonInput
              type='text'
              name='nickname'
              value={this.state.nickname}
              onIonChange={this.onChangeHandler}
            />
          </IonItem> */}
          {/* Additional Fields */}
          {/* <div className="center additional-data">
            <div className="text-center">
              Additional Data
            </div>
          </div> */}
          <IonItem style={inputFieldStyle}>
            <IonLabel position='floating'>Email</IonLabel>
            <IonInput
              type='text'
              name='Email'
              value={this.state.additionalData.Email}
              onIonChange={this.onAdditionalChangeHandler}
            />
          </IonItem>
          
           <IonItem style={inputFieldStyle}>
            <IonLabel position='floating'>Gender</IonLabel>
            <IonInput
              type='text'
              name='Gender'
              value={this.state.additionalData.Gender}
              onIonChange={this.onAdditionalChangeHandler}
            />
          </IonItem>
          <IonItem style={inputFieldStyle}>
            <IonLabel position='floating'>Father</IonLabel>
            <IonInput
              type='text'
              name='Father'
              value={this.state.additionalData.Father}
              onIonChange={this.onAdditionalChangeHandler}
            />
          </IonItem>
          <IonItem style={inputFieldStyle}>
            <IonLabel position='floating'>Spouse</IonLabel>
            <IonInput
              type='text'
              name='Spouce'
              value={this.state.additionalData.Spouce}
              onIonChange={this.onAdditionalChangeHandler}
            />
          </IonItem>
          
          <IonItem style={inputFieldStyle}>
            <IonLabel position='floating'>Address1</IonLabel>
            <IonInput
              type='text'
              name='Address1'
              value={this.state.additionalData.Address1}
              onIonChange={this.onAdditionalChangeHandler}
            />
          </IonItem>
          <IonItem style={inputFieldStyle}>
            <IonLabel position='floating'>Address2</IonLabel>
            <IonInput
              type='text'
              name='Address2'
              value={this.state.additionalData.Address2}
              onIonChange={this.onAdditionalChangeHandler}
            />
          </IonItem>
          <IonItem style={inputFieldStyle}>
            <IonLabel position='floating'>City</IonLabel>
            <IonInput
              type='text'
              name='City'
              value={this.state.additionalData.City}
              onIonChange={this.onAdditionalChangeHandler}
            />
          </IonItem>
          <IonItem style={inputFieldStyle}>
            <IonLabel position='floating'>PIN Code</IonLabel>
            <IonInput
              type='text'
              name='Pincode'
              value={this.state.additionalData.Pincode}
              onIonChange={this.onAdditionalChangeHandler}
            />
          </IonItem>
          <IonItem style={inputFieldStyle}>
            <IonLabel position='floating'>State</IonLabel>
            <IonInput
              type='text'
              name='State'
              value={this.state.additionalData.State}
              onIonChange={this.onAdditionalChangeHandler}
            />
          </IonItem>
          
          
          <IonItem style={inputFieldStyle}>
            <IonLabel position='floating'>PAN</IonLabel>
            <IonInput
              type='text'
              name='PAN'
              value={this.state.additionalData.PAN}
              onIonChange={this.onAdditionalChangeHandler}
            />
          </IonItem>
          <IonItem style={inputFieldStyle}>
            <IonLabel position='floating'>Aadhar Number</IonLabel>
            <IonInput
              type='text'
              name='AadhaarCard'
              value={this.state.additionalData.AadhaarCard}
              onIonChange={this.onAdditionalChangeHandler}
            />
          </IonItem>
          <IonItem style={inputFieldStyle}>
            <IonLabel position='stacked'>DOB</IonLabel>  
            <IonDatetime
                style={{width: "100%"}}
                displayFormat="DD, MMMM YYYY"
                min="1950"
                max="2022"
                name='DOB'
                value={this.state.additionalData.DOB}
                onIonChange={this.onAdditionalChangeHandler}
            />
          </IonItem>
          <IonItem style={inputFieldStyle}>
            <IonLabel position='floating'>Vehicle</IonLabel>
            <IonInput
              type='text'
              name='Vehicle'
              value={this.state.additionalData.Vehicle}
              onIonChange={this.onAdditionalChangeHandler}
            />
          </IonItem>
          
          <IonItem style={inputFieldStyle}>
            <IonLabel position='floating'>Blood Group</IonLabel>
            <IonInput
              type='text'
              name='BloodGroup'
              value={this.state.additionalData.BloodGroup}
              onIonChange={this.onAdditionalChangeHandler}
            />
          </IonItem>
          <div className="center" style={{marginBottom:"7rem"}}>
            <div className="profile-button text-center" onClick={this.submitClickHandler}>
              Update Info
            </div>
          </div>
        </IonRow>
      </React.Fragment>
    )
  }
}
