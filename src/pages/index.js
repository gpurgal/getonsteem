import React from 'react'
import Link from 'gatsby-link'

import CreationFrom from '../components/CreationForm'
import CreationInstructions from '../components/CreationInstructions'

const IndexPage = () => (
  <div className="container">
    <h1>Simple Steem Account creation tool!</h1>
    <div className="alert alert-info" role="alert">
      Check out{' '}
      <a href="https://steemit.com/introduceyourself/@purec/steem-account-creation-tool-and-introduceyourself">
        introduction post
      </a>
      {' '}on steemit!
    </div>
    <div className="row">
      <div className="col-lg-6">
        <CreationFrom />
      </div>
      <div className="col-lg-6">
        <CreationInstructions />
      </div>
    </div>
  </div>
)

export default IndexPage
