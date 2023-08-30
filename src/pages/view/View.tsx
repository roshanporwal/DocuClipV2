import React, { useState, useEffect } from "react";
import { IonAlert } from "@ionic/react";


import "./view.css";
import CategoryHome from "../../components/view/CategoryHome";
import EnterNamePage from "../auth/EnterNamePage";
import { isLoggedIn } from "../../components/login/TokenProvider";
import { getToken } from "../../components/login/TokenProvider";
import {Plugins, Capacitor} from '@capacitor/core';
import axios from "axios";
import apiRoutes from "../../components/Routes";

/**
 * This will call api/fileretrivalapi/listall to get a list of all the files which belong
 * to the current logged in user
 */
const View: React.FC = () => {
  const [error, setError] = useState<string>()
  const [fullname, setFullName] = useState<string>()
  const [userName, setUserName] = useState<string>()
  
  // redirect user to login page if user is not logged in
  useEffect(() => {
    if (isLoggedIn() === false) {
      window.location.replace("/");
    }
    const data1=localStorage.getItem('REACT_TOKEN_AUTH');
    if(data1 !== null){
      const data=JSON.parse(data1);
      setFullName(data.fullname);
      setUserName(data.username);
    }
    
    
    /*axios.get(apiRoutes.getUserInfo).then((response: any) =>{console.log(response.data);}).catch(error => {
      // Handle any errors
      console.error(error);
    });*/
    if (Capacitor.isNative) {
      Plugins.App.addListener("backButton", (e) => {
        if (window.location.pathname === "/category") {
          // Show A Confirm Box For User to exit app or not
          //let ans = window.confirm("Are you sure to exit App?");
            Plugins.App.exitApp(); 
        }/* else if (window.location.pathname === "/category") {
           // Show A Confirm Box For User to exit app or not
          let ans = window.confirm("Are you sure to exit App?");
          if (ans) {
            Plugins.App.exitApp();
          } 
        } */
      });
    }
    
  }, []);



  //Div covering category doesn't include the whole thing
  return (
    <React.Fragment>
      <IonAlert
        isOpen={!!error}
        message={error}
        buttons={[
          {
            text: "Okay",
            handler: () => {
              setError("");
            },
          },
        ]}
      />
      
      {/* Category Tab doesn't cover the full scree */}
      { fullname==='0' ? <EnterNamePage userName={userName}/> : <CategoryHome />}
      
    </React.Fragment>
  );
};

export default View;
