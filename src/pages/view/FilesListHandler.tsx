import React from "react"
import FilesList from "../../components/view/FilesList"
import MenuTemplate from "../Toolbar"

type props = { match?: any; title?: string }
type states = { redirect: string; subCategory: string; isDate: boolean; category: string }

class FilesListHandler extends React.Component<props, states> {
  constructor(props: props) {
    super(props)

    let title = this.props.match?.params.urlSafeCategory
    let subCategory = this.props.match?.params.urlSafeSubCategory
    let date = this.props.match?.params.dateText
    let redirect: string = ""

    // if title doesn't exist, then redirect to home - shouldn't happen, just an edge case
    if (title) {
      title = title.split("_")
      for (let i = 0; i < title.length; i++) {
        title[i] = title[i][0].toUpperCase() + title[i].slice(1)
      }
      redirect = title.join(" ")
    }

    if (subCategory) {
      subCategory = subCategory.split("_")
      for (let i = 0; i < subCategory.length; i++) {
        subCategory[i] = subCategory[i][0].toUpperCase() + subCategory[i].slice(1)
      }
      redirect = subCategory.join(" ")
    }

    let isDate = false;
    if (date) {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ]
      date = date.split("_")

      const currentMonth = months[date[1]]
      redirect = `${currentMonth} ${date[2]}, ${date[0]}`
      isDate = true
    }

    if (! redirect) {
      redirect = this.props.title!
    }

    this.state = {
      redirect: redirect,
      subCategory: subCategory,
      isDate: isDate,
      category: title
    }
  }

  render() {
    return (
      this.state.isDate ?
        <MenuTemplate
          name={this.state.redirect}
          component={<FilesList redirect={this.state.redirect} subCategory={this.state.subCategory} showCategoryTitle={true} />}
        />
      :
        <MenuTemplate
          name={this.state.redirect}
          component={<FilesList redirect={this.state.redirect} subCategory={this.state.subCategory} category={this.state.category} />}
        />
    )
  }
}

export default FilesListHandler
