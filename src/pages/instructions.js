import React from 'react'
import Link from 'gatsby-link'

const Instructions = () => (
  <div>
    <div>If you have a STEEM account you can easily create a new one!</div>
    <div>
      Current creation fee is displayed on the account creation form. You must
      have at least <i>creation fee</i> STEEM on you <i>creator</i> account.
    </div>
    <div>This fee will be transfered to the new account as STEEM POWER</div>

    <div className="jumbotron">
      <p className="lead">Creation Instructions</p>
      <hr className="my-4" />
      <p>
        <ol>
          <li>
            <div>
              Find your active private key. One way is to go to your wallet
              steemit.com and look for ACTIVE in <i>Permissions</i> tab
            </div>
            <div>
              Or open{' '}
              <b>
                https://steemit.com/@<i>getonsteem</i>/permissions
              </b>{' '}
              and change <i>getonsteem</i> to your username.
            </div>
            <div>
              Click on 'Login to show' to display private active key.
            </div>
          </li>
          <li>
            In <Link to="/">account creation form</Link> provide your username
            and active private key
          </li>
          <li>Choose your new username.</li>
          <li>
            Generate a new password by clicking 'Generate' button. You can also
            provide your own password. Remember to <b>backup your password</b>! There is no way to recover your pasword/account.
          </li>
          <li>
            If everyting is correct check that you've backed up your password and click 'Create'
          </li>
          <li>Congratulations. Your new Steem account is now created!</li>
        </ol>
      </p>
      <p className="lead">
        <Link
          to="/"
        >
          Go to account creation form
        </Link>
      </p>
    </div>
  </div>
)

export default Instructions
