import React from 'react'
import Link from 'gatsby-link'

const CreationInstructions = () => (
  <div className="jumbotron" style={{ padding: '15px' }}>
    <div>If you have a STEEM account you can easily create a new one!</div>
    <div>
      Current creation fee is displayed on the account creation form. You must
      have at least <i>creation fee</i> STEEM on you <i>creator</i> account.
    </div>
    <div>This fee will be transfered to the new account as STEEM POWER</div>

    <div>
      <hr className="my-4" />
      <div className="alert alert-dark" role="alert">
        <h3 style={{ padding: 10, margin: 0 }}>Creation Instructions</h3>
      </div>
      <ol>
        <li>
          <div>
            Find your active private key. One way is to go to your wallet on
            steemit.com and look for ACTIVE in <i>Permissions</i> tab.
          </div>
          <div>
            Or open{' '}
            <b>
              https://steemit.com/@<i>getonsteem</i>/permissions
            </b>{' '}
            and change <i>getonsteem</i> to your username.
          </div>
          <div>Click on 'Login to show' to display private active key and copy it.</div>
        </li>
        <li>
          In the account creation form provide your username and the copyied active private
          key.
        </li>
        <li>Choose your new username.</li>
        <li>
          Generate a new password by clicking 'Generate' button. You can also
          provide your own password. Remember to <b>backup your password</b>!
          There is no way to recover your pasword/account.
        </li>
        <li>
          If everyting is correct check that you've backed up your password and
          click 'Create'.
        </li>
        <li>Congratulations. Your new Steem account is now created!</li>
      </ol>
    </div>
  </div>
)

export default CreationInstructions
