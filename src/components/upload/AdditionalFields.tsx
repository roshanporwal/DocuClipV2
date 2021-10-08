import React from 'react'
import { IonIcon, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonDatetime } from '@ionic/react'
import {chevronForward} from 'ionicons/icons'

type props = {
    selectedCategory: string,
    additionalFields: any,
    parentSetState: any,
}
type state = {
    renderedView: null | JSX.Element
    values: any,
    subCategoryInput: JSX.Element,
    selectedSubCategory: null | string,
    hasSubCategories: boolean,
    subCategories: any
}

class AdditionalFields extends React.Component<props, state> {
    constructor(props: props) {
        super(props)

        this.state = {
            renderedView: null,
            values: null,
            subCategoryInput: <React.Fragment />,
            selectedSubCategory: null,
            hasSubCategories: true,
            subCategories: null
        }
    }

    // on any input change, all the data from these dynamic fields are packed
    // in an object and updated on the parent component
    onChangeHandler = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
            values: { ...this.state.values, [name]: value, subCategory: this.state.selectedSubCategory }
        })

        this.props.parentSetState('additionalFieldsData', this.state.values)
    }

    // mirrors the same functionality of the above method, but designed specifically for dates
    onDateChangeHandler = (event: any, flag: string) => {
        const value = event.target.value;

        if (flag === 'eventOn') {
            this.setState({
                values: { ...this.state.values, eventOn: value, subCategory: this.state.selectedSubCategory }
            })

            this.props.parentSetState('additionalFieldsData',
                { ...this.state.values, eventOn: value, subCategory: this.state.selectedSubCategory })
        } else if (flag === 'eventEnd') {
            this.setState({
                values: { ...this.state.values, eventEnd: value, subCategory: this.state.selectedSubCategory }
            })

            this.props.parentSetState('additionalFieldsData',
                { ...this.state.values, eventEnd: value, subCategory: this.state.selectedSubCategory })
        } else {
            console.log("ERROR!")
        }
    }

    componentDidMount() {
        this.props.parentSetState('isLoading', true)
        let subCategories: any = []
        // retrieve the sub category
        for (const property in this.props.additionalFields) {
            if (Object.prototype.hasOwnProperty.call(this.props.additionalFields, property)) {
                if (this.props.additionalFields[property].title === this.props.selectedCategory) {
                    subCategories = this.props.additionalFields[property].subCategory
                }
            }
        }

        // retrieve each title from sub categories
        let subCategoryTitles = []
        let subCategoryPropertyNames: any = []
        for (const property in subCategories) {
            if (Object.prototype.hasOwnProperty.call(subCategories, property)) {
                subCategoryTitles.push(subCategories[property].title)
                subCategoryPropertyNames.push(property)
            }
        }

        // check to see if subcategory options are not required to display. If so, render the fields
        // directly. If not, then display dropdown to see sub categories. Once a sub category is selected
        // then render the view.
        if (subCategoryTitles[0] === '' && subCategoryPropertyNames[0] === 'category') {
            this.renderFields(subCategories.category.fields)
        } else {
            this.setState({
                subCategoryInput: (
                    <IonItem>
                        <IonLabel position="floating">Sub Category</IonLabel>
                        <IonSelect placeholder="Select One" onIonChange={this.customSelectChangeHandler}>
                            {
                                subCategoryTitles.map((value: any, index: number) =>
                                    <IonSelectOption value={subCategoryPropertyNames[index]} key={index} >{value}</IonSelectOption>
                                )
                            }
                        </IonSelect>
                    </IonItem>
                )
            })
        }
        this.setState({ subCategories: subCategories })
        this.props.parentSetState('isLoading', false)
    }

    customSelectChangeHandler = (event: any) => {
        this.setState({ selectedSubCategory: event.target.value, values: { subCategory: event.target.value } })
        this.renderFields(this.state.subCategories[event.target.value].fields)
    }

    renderFields = (fields: any) => {
        const temp_items: any = []
        // loop through the fields to render the sub categories
        fields.forEach((field: any, index: number) => {
            // append these fields to 'items' array
            temp_items.push(
                <div key={index} className="additional-fields-input">
                    <IonIcon slot='start' size="small" md={chevronForward} ios={chevronForward} />
                    <IonItem style={{width: "100%"}} >
                        <IonLabel position="floating">{field.title}</IonLabel>
                        {
                            field.type !== 'datetime-local'
                                ?
                                    <IonInput
                                        style={{width: "100%"}}
                                        type={field.type}
                                        size={field.size}
                                        name={field.name}
                                        onIonChange={this.onChangeHandler}
                                    />
                                :
                                    <IonDatetime
                                        style={{width: "100%"}}
                                        displayFormat="MMMM DD, YYYY"
                                        min="2000"
                                        max="2100"
                                        onIonChange={(e) => this.onDateChangeHandler(e, field.flag)}
                                        name={field.name}
                                    />
                        }
                    </IonItem>
                    {field.helper ?? <IonLabel className="text-muted" style={{marginLeft: '15px'}}>{field.helper}</IonLabel>}
                </div>
            )
        })

        // set state to finalize component rendering
        this.setState({
            renderedView: temp_items
        })
    }

    render() {
        return (
            <div className='additional-fields'>
                {this.state.subCategoryInput || null}
                {this.state.renderedView != null ? this.state.renderedView : null}
            </div>
        )
    }
}

export default AdditionalFields