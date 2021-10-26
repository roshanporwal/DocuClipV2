import React from "react";

interface props {
  image?: string;
  title: string;
}
const SubCategoryItem: React.FC<props> = (props) => {
  /*
        This function will call a method in it's 'grandparent' which will
        update the current selected category to the one user clicked on
        i.e. the current component
    */
  const clickHandler = () => {
    let urlName = props.title;
    urlName = urlName.replace(" ", "_");
    const currentUrl = window.location.href 
    window.location.href = currentUrl + `/${urlName}`
  };

  return (
    <div className="subcategory-cards-div" onClick={clickHandler}>
      <div className="subcategory-cards ion-activatable ripple-parent">
        <div className="subcategory-icon">
          {props.image ? <img src={props.image} alt="logo" height="25px" width="25px"/> : null}
        </div>
        <p className="subcategory-title">{props.title}</p>
      </div>
    </div>
  );
};

export default SubCategoryItem;
