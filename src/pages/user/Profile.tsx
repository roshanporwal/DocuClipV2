import { IonButton, IonIcon, IonRouterLink } from "@ionic/react";
import React from "react";
import { getToken, isLoggedIn } from "../../components/login/TokenProvider";
import { createOutline, shareSocial } from "ionicons/icons";
import "./profile.css";
import UserDetails from "./UserDetails";
import ProfileImage from "../../assets/blankimage.png";
import GoBack from "../../components/goBack";
import axios from "axios";
import apiRoutes from "../../components/Routes";

type props = {};

type details = {
  userId: string;
  userEmail: string;
  userName: string;
  fullname: string;
  businessname: string;
  nickname: string;
};
type states = {
  details: details;
  secretKey: string;
};

export default class Profile extends React.Component<props, states> {
  constructor(props: props) {
    super(props);

    if (!isLoggedIn() || getToken() === undefined) {
      window.location.replace("/");
    }

    const { userId, userEmail, userName, fullname, nickname, businessname } =
      getToken();

    this.state = {
      details: {
        userId: userId,
        userEmail: userEmail,
        userName: userName,
        fullname: fullname,
        businessname: businessname,
        nickname: nickname,
      },
      secretKey: "----",
    };

    this.generateSecretKey = this.generateSecretKey.bind(this);
  }

  generateSecretKey() {
    let OTP = (Math.floor(Math.random() * 10000) + 10000)
      .toString()
      .substring(1);
    //setSecretKey(OTP);
    let credentialData = new FormData();
    credentialData.append("username", this.state.details.userName);
    credentialData.append("secretcode", OTP);
    axios
      .post(apiRoutes.generateSecretCode, credentialData)
      .then((response: any) => {
        if (response.data.status === "success") {
          console.log("SecretCode stored in Database");
          this.setState({ secretKey: OTP });
        }
      })
      .catch((error: any) => {
        alert(error);
        this.setState({ secretKey: "----" });
      });
  }

  render() {
    return (
      <React.Fragment>
        <div className="profile-card-content">
          {/* <div className="profile-photo">
            <img src={ProfileImage}/>
          </div> */}
          <div className="edit-and-share">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                width: "40%",
              }}
            >
              <div>
                <IonRouterLink href="/profile/change-info">
                  <IonIcon icon={createOutline} class="profile-page-icon" />
                </IonRouterLink>
              </div>
              <div>
                <IonRouterLink href="/profile/share-info">
                  <IonIcon icon={shareSocial} class="profile-page-icon" />
                </IonRouterLink>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                lineHeight: "4px",
                width: "60%",
              }}
            >
              <button
                style={{
                  backgroundColor: "#B4ECF0",
                  borderRadius: "5px",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "black",
                }}
                onClick={this.generateSecretKey}
              >
                Secret Key
              </button>
              <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                {this.state.secretKey}
              </p>
            </div>
          </div>
        </div>
        <div className="user-details">
          <UserDetails details={this.state.details} />
        </div>
      </React.Fragment>
    );
  }
}
