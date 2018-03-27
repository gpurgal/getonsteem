import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'

import Header from '../components/Header'
import './index.css'

if (process.env.NODE_ENV === `production`) {
  Raven.config(
    'https://1a38b1cb5f3f43ecbeabea642a4dbdcf@sentry.io/671851'
  ).install()
}

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
