import React from 'react'

import Tick from './tick.png'

type props = {}
type states = {}

class UploadSuccess extends React.Component<props, states> {
  componentDidMount() {
    setTimeout(() => {
      window.location.replace('/category')
    }, 3000);
  }

  render() {
    return (
      <React.Fragment>
        <img src={Tick} alt="success" style={{ margin: 'auto' }} />
        <p style={{ margin: 'auto' }}>Upload Success</p>
      </React.Fragment>
    )
  }
}

export default UploadSuccess