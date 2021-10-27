import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import React from 'react';
import { useLocation } from 'react-router-dom';
import {
    logOutOutline,
    logOutSharp,
    listOutline,
    listSharp,
    cloudUploadOutline,
    cloudUploadSharp,
    calendarOutline,
    calendarSharp,
    qrCodeOutline,
    qrCodeSharp,
    trashBin,
    trashBinSharp,
    // cardOutline,
    // cardSharp
} from 'ionicons/icons';

import { getToken, isLoggedIn } from './login/TokenProvider'
import './Menu.css';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Category',
    url: '/category',
    iosIcon: listOutline,
    mdIcon: listSharp
  },
  // {
  //   title: 'Create Visiting Card',
  //   url: '/visiting_card',
  //   iosIcon: cardOutline,
  //   mdIcon: cardSharp
  // },
  {
    title: 'Calendar',
    url: '/calendar',
    iosIcon: calendarOutline,
    mdIcon: calendarSharp
  },
  {
    title: 'Upload',
    url: '/upload',
    iosIcon: cloudUploadOutline,
    mdIcon: cloudUploadSharp
  },
  {
    title: 'QR Scanner',
    url: '/scanner',
    iosIcon: qrCodeOutline,
    mdIcon: qrCodeSharp
  },
  {
    title: 'Logout',
    url: '/logout',
    iosIcon: logOutOutline,
    mdIcon: logOutSharp
  },
  {
    title: 'Delete Account',
    url: '/profile/delete-account',
    iosIcon: trashBin,
    mdIcon: trashBinSharp,
  }
];

const Menu: React.FC = () => {
    const location = useLocation();

    if (isLoggedIn() === false) {
        return <></>
    }

    const token = getToken()

    return (
        <IonMenu contentId="main" type="overlay">
        <IonContent>
            <IonList id="inbox-list">
              <IonMenuToggle autoHide={false}>
                <IonItem routerLink='/profile' routerDirection="none" lines="none" detail={false}>
                  <div className="menu-title">
                    <IonListHeader class="ion-text-capitalize">Actions</IonListHeader>
                  </div>
                </IonItem>
              </IonMenuToggle>
              {appPages.map((appPage, index) => {
                  return (
                  <IonMenuToggle key={index} autoHide={false}>
                      <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                        <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                        <IonLabel>{appPage.title}</IonLabel>
                      </IonItem>
                  </IonMenuToggle>
                  );
              })}
            </IonList>
        </IonContent>
        </IonMenu>
    );
};

export default Menu;
