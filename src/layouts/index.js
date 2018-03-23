import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'

import Header from '../components/Header'
import './index.css'

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet
      title="Create Steem Account"
      meta={[
        { name: 'description', content: 'Create Steem Account' },
        { name: 'keywords', content: 'steem, account, create' },
      ]}
    />
    <Header />
    <div className="container">{children()}</div>
  </div>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
