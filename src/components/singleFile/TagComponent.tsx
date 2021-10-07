import React from 'react'

type props = {
    tagTitle: string
}

export default class TagComponent extends React.Component<props> {
    render() {
        return (
            <div className="singleFile-tag">
                <p>{this.props.tagTitle}</p>
            </div>
        )
    }
}