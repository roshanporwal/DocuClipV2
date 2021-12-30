import { IonAlert, IonLoading } from "@ionic/react"
import Axios from "axios"
import React from "react"
import MenuTemplate from "../../pages/Toolbar"
import FilesListHandler from "../../pages/view/FilesListHandler"
import apiRoutes from "../Routes"

import './subcategory.css'
// import network plugin
import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding,
} from "@capacitor/core"
import SubCategoryItem from "./subCategoryItem"
import Bus from '../../assets/sub-categories/bus.png'
import Flight from '../../assets/sub-categories/flight.png'
import Car from '../../assets/sub-categories/car.png'
import Hotel from '../../assets/sub-categories/hotel.png'
import HotelCard from '../../assets/sub-categories/hotelCard.png'
import Train from '../../assets/sub-categories/train.png'
import Appliances from '../../assets/sub-categories/applicances.png'

import MedicineInvoice from '../../assets/sub-categories/medicalinvoice.png'
import Prescription from '../../assets/sub-categories/prescription.png'
import PathReport from '../../assets/sub-categories/pathreport.png'
import Jewellery from '../../assets/sub-categories/jewellery.png'
import Grocery from '../../assets/sub-categories/grocery.png'
import Household from '../../assets/sub-categories/household.png'
import Apparel from '../../assets/sub-categories/apparels.png'
import Mobile from '../../assets/sub-categories/mobile.png'
import HealthandBeauty from '../../assets/sub-categories/beauty.png'
import SportsandFitness from '../../assets/sub-categories/sports.png'
import BagsandLuggage from '../../assets/sub-categories/bags.png'
import Books from '../../assets/sub-categories/books.png'
import LearningandDevelopment from '../../assets/sub-categories/learning.png'
import MusicandMovies from '../../assets/sub-categories/music.png'
import HandicraftArtandCollectibles from '../../assets/sub-categories/handicraft.png'
import Others from '../../assets/sub-categories/others.png'
import HandOut from '../../assets/sub-categories/hand-out.png'
import Agenda from '../../assets/sub-categories/agenda.png'
import Menu from '../../assets/sub-categories/menu.png'
import Personal from '../../assets/sub-categories/personal.png'
import MarkSheet from '../../assets/sub-categories/marksheet.png'
import Certificate from '../../assets/sub-categories/certificate.png'
import AdmitCard from '../../assets/sub-categories/admit.png'
import Migration from '../../assets/sub-categories/migration.png'
import Life from '../../assets/sub-categories/life.png'
import General from '../../assets/sub-categories/general.png'
import Mediclaim from '../../assets/sub-categories/mediclaim.png'

import Travel from '../../assets/sub-categories/agenda.png'

import Gaming from '../../assets/sub-categories/agenda.png'

import Industrial from '../../assets/sub-categories/agenda.png'

import Machinery from '../../assets/sub-categories/agenda.png'

import RealEstate from '../../assets/sub-categories/agenda.png'

import TrafficChallan from '../../assets/sub-categories/TrafficChallan.png'

import RC from '../../assets/sub-categories/RC.png'

import PUC from '../../assets/sub-categories/PUC.png'

import Insurance from '../../assets/sub-categories/Insurance.png'

import FreeService from '../../assets/sub-categories/FreeService.png'

import OwnersManual from '../../assets/sub-categories/Manual.png'

import Invoice from '../../assets/sub-categories/Invoice.png'

import Electricity from '../../assets/sub-categories/electricity.png'
import Gas from '../../assets/sub-categories/Gas.png'
import PropertyTax from '../../assets/sub-categories/tax.png'
import BankStatement from '../../assets/sub-categories/statement.png'
import Creditcardbill from '../../assets/sub-categories/creditcard.png'
import PAN from '../../assets/sub-categories/PAN.png'
import VoterID from '../../assets/sub-categories/voterid.png'
import AadharCard from '../../assets/sub-categories/Adhaarcard.png'
import Photo from '../../assets/sub-categories/photo.png'
import Passport from '../../assets/sub-categories/passport.png'
import DrivingLiscence from '../../assets/sub-categories/drivinglicence.png'
import GoBack from "../goBack"



type props = {
  match: { params: { urlSafeCategory?: string } }
}
type states = {
  isLoading: boolean
  categories: any
  subCategories: any
  selectedCategory: string
  isEmpty: boolean
  isStructureNotFound: boolean
}

type SubCategoryResponse = {
  categories: Array<string>
  additionalFields: Object
}


 
class SubCategoryHome extends React.Component<props, states> {
  constructor(props: props) {
    super(props)
  
    const title = this.props.match.params.urlSafeCategory
    let selectedCategory: string = ""

    // if title doesn't exist, then redirect to home - shouldn't happen, just an edge case
    if (title) {
      const titleArray = title.split("_")
      for (var i = 0; i < titleArray.length; i++) {
        titleArray[i] = titleArray[i][0].toUpperCase() + titleArray[i].slice(1)
      }
      selectedCategory = titleArray.join(" ")
    }

    this.state = {
      isLoading: true,
      categories: null,
      selectedCategory: selectedCategory,
      isEmpty: false,
      subCategories: [],
      isStructureNotFound: false
    }
    

  }
  SubCategoryIcons = {
      BusTicket : Bus,
      CarBookings : Car,
      HotelBookings : Hotel,
      FlightTicket : Flight,
      TrainTicket:Train,
      HotelFacilityCard : HotelCard,
      Prescription: Prescription,
      PathReport : PathReport,
      MedicineInvoice : MedicineInvoice,
      ElectronicAppliances : Appliances,
      Jewellery : Jewellery,
      Grocery : Grocery,
      Household : Household,
      ApparelsandShoes : Apparel,
      MobileandComputer : Mobile,
      HealthandBeauty : HealthandBeauty,
      SportsandFitness : SportsandFitness,
      BagsandLuggage : BagsandLuggage,
      Books : Books,
      LearningandDevelopment : LearningandDevelopment,
      MusicandMovies : MusicandMovies,
      HandicraftArtandCollectibles : HandicraftArtandCollectibles,
      Others : Others,
      HandOut : HandOut,
      Agenda : Agenda,
      Menu: Menu,
      Personal :Personal,
      Business : Agenda,
      MarkSheet : MarkSheet,
      Certificate : Certificate,
      AdmitCard : AdmitCard,
      MigrationCertificate : Migration,
      Life : Life,
      General : General,
      Mediclaim : Mediclaim,
      RealEstate,
      Vehicles : Bus,
      Travel,
      Industrial,
      Machinery,
      GamingandSoftware:Gaming,
      RC,
      PUC,
      Insurance,
      FreeService,
      OwnersManual,
      Invoice,
      TrafficChallan,
      Mobile,
      Electricity,
      Gas,
      PropertyTax,
      BankStatement,
      Creditcardbill,
      PAN,
      VoterID,
      AadharCard,
      Photo,
      Passport,
      DrivingLiscence
    }
   getIcons = (title:string) => {
     let strippedtitle = title.replace(/\s/g,'').replaceAll(',','').replace('&','and').replace('-','').replaceAll("'",'')
      return this.SubCategoryIcons[strippedtitle]
    }


  async getCategoryStructure(): Promise<SubCategoryResponse> {
    const { Network } = Plugins
    let status = await Network.getStatus()

    if (status.connected === false) {
      const { Filesystem } = Plugins

      let response = await Filesystem.readFile({
        path: "structure.txt",
        directory: FilesystemDirectory.Data,
        encoding: FilesystemEncoding.UTF8,
      })
      .catch((error) => {
        console.log(error)
        this.setState({ isStructureNotFound: true, isLoading: false })

        return {data: ''}
      })

      return JSON.parse(response.data)
    } else {
      const postResponse = await Axios.post(apiRoutes.getCategories).then(
        async (response) => {
          const { Filesystem } = Plugins

          try {
            await Filesystem.writeFile({
              path: "structure.txt",
              data: JSON.stringify(response.data),
              directory: FilesystemDirectory.Data,
              encoding: FilesystemEncoding.UTF8,
            })
          } catch (e) {
            console.error("Unable to write file", e)
          }

          return response.data
        }
      )

      return postResponse
    }
  }

  async componentDidMount() {
    this.getCategoryStructure()
      .then((data) => {
        // get all latest categories from additionalFields
        const categories: any = []
        for (const property in data.additionalFields) {
          if (
            Object.prototype.hasOwnProperty.call(
              data.additionalFields,
              property
            )
          ) {
            categories.push(data.additionalFields[property].title)
          }
        }

        // set the categories and additionalFields as an entire object to this component's state
        this.setState({ categories: categories })
        return data.additionalFields
      })
      .then((additionalFields) => {
        let subCategories: any = []
        // retrieve the sub category
        for (const property in additionalFields) {
          if (
            Object.prototype.hasOwnProperty.call(additionalFields, property)
          ) {
            if (/* 
              additionalFields[property].title.toLowerCase() ===
              this.state.selectedCategory.toLowerCase() */
              additionalFields[property].title ===
              this.state.selectedCategory
            ) {
              subCategories = additionalFields[property].subCategory
            }
          }
        }

        return subCategories
      })
      .then((subCategories) => {
        if (
          Object.keys(subCategories).length === 0 ||
          subCategories.hasOwnProperty("category")
        ) {
          this.setState({ isEmpty: true })
        } else {
          let subCategoryInfo = []
          for (const subCategoryTitle in subCategories) {
            subCategoryInfo.push({
              title: subCategories[subCategoryTitle].title,
            })
          }
          this.setState({ subCategories: subCategoryInfo })
          console.log(subCategories)
        }
      })
      .then(() => this.setState({ isLoading: false }))
  }
    

  render() {
    return (
      <React.Fragment>
        <IonLoading
          isOpen={this.state.isLoading}
          onDidDismiss={() => this.setState({ isLoading: false })}
          message={"Please wait..."}
        />

        <IonAlert
          isOpen={this.state.isStructureNotFound}
          message="Structure data not found. Please connect to the internet and open the category to download the structure"
          buttons={[
            {
              text: "Okay",
              handler: () => {
                this.setState({ isStructureNotFound: false })
                window.location.replace('/category')
              },
            },
          ]}
          onDidDismiss={() => {
            this.setState({ isStructureNotFound: false })
            window.location.replace('/category')
          }}
        />

        <MenuTemplate
          name={this.state.selectedCategory}
          component={
            <React.Fragment>
              {this.state.isEmpty ? (
                <FilesListHandler title={this.state.selectedCategory} />
              ) : (
                <div className='subcategory-slots'>
                  {this.state.subCategories.map(
                    (category: any, index: number) => {
                      return <SubCategoryItem 
                                key={index} 
                                title={category.title}
                                image={this.getIcons(category.title)}
                              />
                    }
                  )}
                </div>
              )}
            </React.Fragment>
          }
        />
      </React.Fragment>
    )
  }
}

export default SubCategoryHome
