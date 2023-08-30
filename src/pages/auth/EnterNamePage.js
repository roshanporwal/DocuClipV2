import { IonContent , IonInput} from "@ionic/react";
import React from 'react';
import {useState} from 'react';
import apiRoutes from "../../components/Routes";
import axios from 'axios';

const EnterNamePage = (props) =>{
    const [fullName, setFullName]= useState('');
    let credentialData = new FormData()
    credentialData.append("username", props.userName);
    credentialData.append("fullname", fullName);
    const onChangeHandler=(e)=>{
        setFullName(e.target.value);
    }
    const registerClickHandler=()=>{
      if(!fullName)
      {
        alert('Please Enter name!');
        return;
      }
      
      let username= localStorage.getItem('username');
      let credentialData = new FormData()
      credentialData.append("username", username);
      credentialData.append("fullname", fullName);
      console.log(credentialData);
      axios
      .post(apiRoutes.addName, credentialData)
      .then((response) => {
        
        const data=JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH'));
        data['fullname']=response.data.fullname;
        localStorage.setItem('REACT_TOKEN_AUTH',JSON.stringify(data));
        window.location.replace("/category");
      }).catch((error) => {
        console.log(error)
      });
      
    }

    return(
        // eslint-disable-next-line react/jsx-no-undef
        <React.Fragment>
        
            
              <div style={{height: window.innerHeight*0.7,display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <h1 style={{textAlign: 'center'}}>Please Enter Your Name</h1>
              <div className='input-sign-up' style={{width: '100%'}}>
                <IonInput
                  type='text'
                  name='fullname'
                  value={fullName}
                  onIonChange={onChangeHandler}
                  placeholder="Enter Your Full Name"
                  className="ioninput"
                />
              </div>
              <div className='row-vertical'>
              
              
              <button
                className='center button signup-button' style={{margin: 40, marginTop: 20, fontSize: '18px', color: 'black', background: '#B4ECF0'}}
                onClick={registerClickHandler}
              >
                {/* <Link to='register'>Sign up</Link> */}
                Save
              </button>
            </div>
            </div>
            
        
        </React.Fragment>
    )
}

export default EnterNamePage;