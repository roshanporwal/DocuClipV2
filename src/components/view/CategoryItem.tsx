import React from "react";

interface props {
  image?: string;
  title: string;
}
const CategoryItem: React.FC<props> = (props) => {
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
    <div className="category-cards-div" onClick={clickHandler}>
      <div className="category-cards ion-activatable ripple-parent">
        <div className="category-icon">
          {props.image ? <img src={props.image} alt="logo" height="45px" width="45px"/> : null}
        </div>
        <p className="category-title">{props.title}</p>
      </div>
    </div>
  );
};

export default CategoryItem;
