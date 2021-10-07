// main
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router';

// Statoc componenets import
import MenuTemplate from './Toolbar'

// Components import
import ExploreContainer from '../components/ExploreContainer';
import Login from './auth/Login'
import Logout from './auth/Logout'
import Upload from './upload/Upload'
import Home from './home/Home'
import View from './view/View'

// helper and css
import { isLoggedIn } from '../components/login/TokenProvider';
import './Page.css';

const Page: React.FC = () => {

    const { name } = useParams<{ name: string; }>();

    if (name === 'Login') {
        return (
            <Login />
        )
    } else if (name === 'Logout') {
        return (
            <Logout />
        )
    } else if (name === 'Upload') {
        if (isLoggedIn() === false) {
            window.location.replace("/")
        }
        return (
            <MenuTemplate name={name} component={<Upload />} />
        )
    } else if (name === 'Home') {
        if (isLoggedIn() === false) {
            window.location.replace("/")
        }
        return (
            <MenuTemplate name={name} component={<Home />} />
        )
    } else if (name === 'Category') {
        if (isLoggedIn() === false) {
            window.location.replace("/")
        }
        return (
            <MenuTemplate name={name} component={<View />} />
        )
    } else {
        if (isLoggedIn() === false) {
            window.location.replace("/")
        }
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>{name}</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent fullscreen>
                    <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">{name}</IonTitle>
                    </IonToolbar>
                    </IonHeader>
                    <ExploreContainer name={name} />
                </IonContent>
            </IonPage>
        );
    }

};

export default Page;
