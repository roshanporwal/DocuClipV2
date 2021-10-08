import React from "react";

// import component
import CategoryItem from "./CategoryItem";

// import assets
import visitingCardsSvg from "../../assets/category-icons/visiting_icon.png";
import flightSvg from "../../assets/category-icons/booking_icon.png";
import shoppingBagSvg from "../../assets/category-icons/shopping_icon.png";
import groupSvg from "../../assets/category-icons/conference_icon.png";
import storeSvg from "../../assets/category-icons/transport_icon.png";
import vectorSvg from "../../assets/category-icons/medical_icon.png";
import fileCopySvg from "../../assets/category-icons/others-icon.png";
import { isLoggedIn } from "../login/TokenProvider";
import DineOut from "../../assets/category-icons/dine_icon.png";
import Insurance from "../../assets/category-icons/policy_icon.png";
import Education from "../../assets/category-icons/export_icon.png";
import Publicity  from "../../assets/category-icons/publicity-icon.png";
import KYC  from "../../assets/category-icons/identity_icon.png"

import Utility  from "../../assets/category-icons/bills_icon.png";
import SocialInvites  from "../../assets/category-icons/social_icon.png"

interface Categories {
  title: string;
  image: string;
}

// categories available
const categories: Categories[] = [
  {
    title: "Travel Bookings",
    image: flightSvg,
  },
  {
    title: "Medical",
    image: vectorSvg,
  },
  {
    title: "Shopping",
    image: shoppingBagSvg,
  },
  {
    title: "Vehicles",
    image: storeSvg,
  },
  {
    title: "Utility Bills",
    image: Utility,
  },
  {
    title: "Insurance Policy",
    image: Insurance,
  },
  {
    title: "Personal identification",
    image: KYC,
  },
  {
    title: "Education",
    image: Education,
  },
  {
    title: "Visiting Cards",
    image: visitingCardsSvg,
  },
  {
    title: "dineOut",
    image: DineOut,
  },
  {
    title: "Conference",
    image: groupSvg,
  },
  {
    title: "Social Invites",
    image: SocialInvites,
  },
  {
    title: "Publicity Material",
    image: Publicity,
  },
  {
    title: "Others",
    image: fileCopySvg,
  },
];

/*
  changeCategory prop passed from the parent is sent to the child
  so it can update the current selected category to update the page
*/
type props = {}
type states = {
  notificationsCount: number
};

class CategoryHome extends React.Component<props, states> {
  constructor(props: props) {
    super(props)

    if (!isLoggedIn()) {
      window.location.replace('/')
    }

    this.state = {
      notificationsCount: 0
    }
  }

  render() {
    return (
      <React.Fragment>
          <div className="category-slots">
            {categories.map((category, index) => {
              return (
                <CategoryItem
                  key={index}
                  title={category.title}
                  image={category.image}
                />
              );
            })}
          </div>
      </React.Fragment>
    )
  }
}

export default CategoryHome;
