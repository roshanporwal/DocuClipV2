import React from "react";
import { IonApp, IonRouterOutlet, IonSplitPane } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";

// import components
import View from "./pages/view/View";
import FilesListHandler from "./pages/view/FilesListHandler";
import MenuTemplate from "./pages/Toolbar";
import Upload from "./pages/upload/Upload";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";
import Register from "./pages/auth/Register";
import Calendar from "./pages/calendar/Calendar";
import QrScanner from "./pages/qrScanner/QrScanner";
import Intent from "./pages/upload/Intent";
import VisitingCard from "./pages/visitingcard/VisitingCard";
import CategoryRedirect from "./pages/CategoryRedirect";
import SingleFile from "./pages/singleFile/SingleFile";
import Menu from "./components/Menu";
import Download from "./components/download/Download";
import Profile from "./pages/user/Profile";
import Notifications from "./components/notifications/Notifications";
import ChangeInfo from "./pages/user/ChangeInfo";
import SubCategoryHome from "./components/view/SubCategoryHome";
import UploadSuccess from "./components/upload/UploadSuccess";
import OtpVerify from "./pages/auth/OtpVerify";
import ShareInfo from "./pages/user/ShareInfo";
import DeleteUser from "./pages/user/DeleteUser";
import HowToUse from "./pages/HowToUse";

const Routes: React.FC = () => {
  const locationPath = window.location.pathname;

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <IonRouterOutlet id="main">
            {/* Intent View */}
            <Route
              path="/upload_file"
              exact
              render={() => {
                return (
                  <MenuTemplate name={"Upload File"} component={<Intent />} />
                );
              }}
            />

            {/* profile View */}
            <Route
              path="/profile"
              exact
              render={() => {
                return (
                  <MenuTemplate name={"User Profile"} component={<Profile />} />
                );
              }}
            />
            <Route
              path="/profile/change-info"
              exact
              render={() => {
                return (
                  <MenuTemplate name={"Edit Info"} component={<ChangeInfo />} />
                );
              }}
            />
            <Route
              path="/profile/delete-account"
              exact
              render={() => {
                return (
                  <MenuTemplate
                    name={"Delete Account"}
                    component={<DeleteUser />}
                  />
                );
              }}
            />
            {/* Share Profile Info */}
            <Route
              path="/profile/share-info"
              exact
              render={() => {
                return (
                  <MenuTemplate
                    name={"User Profile"}
                    component={<ShareInfo />}
                  />
                );
              }}
            />
            <Route
              path="/howtouse"
              exact
              render={() => {
                return <MenuTemplate name={"Help"} component={<HowToUse />} />;
              }}
            />

            {/* Download Route */}
            <Route path="/download" component={CategoryRedirect} exact />
            <Route path="/download/:publicName" component={Download} />

            {/* SingleFile Route */}
            <Route path="/file" component={CategoryRedirect} exact />
            <Route path="/file/:publicName" component={SingleFile} />

            {/* ChangeInfo Route */}
            <Route path="/change" component={CategoryRedirect} exact />
            <Route path="/change/:publicName" component={ChangeInfo} />

            {/* Notifications Route */}
            <Route
              path="/notifications"
              exact
              render={() => {
                return (
                  <MenuTemplate
                    name={"Notifications"}
                    component={<Notifications />}
                    tabs={true}
                  />
                );
              }}
            />

            {/* Category View */}
            <Route
              path="/category"
              exact
              render={() => {
                return (
                  <MenuTemplate
                    name={"Categories"}
                    component={<View />}
                    tabs={true}
                  />
                );
              }}
            />
            <Route
              path="/category/:urlSafeCategory"
              component={SubCategoryHome}
            />
            <Route
              path="/category/:urlSafeCategory/:urlSafeSubCategory"
              component={FilesListHandler}
            />
            <Route path="/date/:dateText" component={FilesListHandler} />

            {/* Upload View */}
            <Route
              path="/upload"
              exact
              render={() => {
                return (
                  <MenuTemplate
                    name={"Upload"}
                    component={<Upload />}
                    tabs={true}
                  />
                );
              }}
            />
            <Route
              path="/upload_success"
              exact
              render={() => {
                return (
                  <MenuTemplate
                    name={"Success"}
                    component={<UploadSuccess />}
                  />
                );
              }}
            />

            {/* Visiting Card View */}
            <Route
              path="/visiting_card"
              exact
              render={() => {
                return (
                  <MenuTemplate
                    name={"Create Visiting Card"}
                    component={<VisitingCard />}
                    tabs={true}
                  />
                );
              }}
            />

            {/* Calendar View */}
            <Route
              path="/calendar"
              exact
              render={() => {
                return (
                  <MenuTemplate
                    name={"Calendar"}
                    component={<Calendar />}
                    tabs={true}
                  />
                );
              }}
            />

            {/* Qr Scanner View */}
            <Route
              path="/scanner"
              exact
              render={() => {
                return (
                  <MenuTemplate
                    name={"QR Scanner"}
                    component={<QrScanner />}
                    tabs={true}
                  />
                );
              }}
            />

            {/* Login View */}
            <Route
              path="/login"
              exact
              render={() => {
                return <Login />;
              }}
            />
            <Route
              path="/otp"
              exact
              render={() => {
                return <OtpVerify />;
              }}
            />

            {/* Logout View */}
            <Route
              path="/logout"
              exact
              render={() => {
                return <Logout />;
              }}
            />

            {/* Register View */}
            <Route
              path="/register"
              exact
              render={() => {
                return <Register />;
              }}
            />

            <Redirect from="/" to="/login" exact />
          </IonRouterOutlet>
          {/* Don't show menu on Login view */}
          {locationPath === "/login" ? null : <Menu />}
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default Routes;
