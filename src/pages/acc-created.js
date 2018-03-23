import React from 'react'

const AccountCreated = () => (
  <div className="jumbotron">
    <p className="lead">The account was succesfully created</p>
    <hr className="my-4" />
    <p>You can now log in to steemit.com using your newly created account</p>
    <p className="lead">
      <a
        className="btn btn-primary btn-lg"
        href="https://steemit.com"
        role="button"
      >
        Go to steemit.com
      </a>
    </p>
  </div>
)

export default AccountCreated
