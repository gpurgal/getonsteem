import React from 'react'
import Link, { navigateTo } from 'gatsby-link'
import steem from 'steem'
import cn from 'classnames'
import Spinner from '../Spinner'

import {
  getCreationFee,
  isUsernameAvailable,
  createAccount,
  validateWif,
  generatePassword,
  getCreationError,
} from '../../services/steemService'

class CreationForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      fields: {
        creatorName: '',
        creatorWif: '',
        username: '',
        password: '',
      },

      available: false,
      creationFee: null,

      creatingAccount: false,
      accountCreated: false,
      showPassword: true,

      savePasswordChecked: false,

      creationError: null,
      errors: {
        creatorName: null,
        creatorWif: null,
        username: null,
        password: null,
      },
    }
  }

  componentWillMount() {
    getCreationFee().then(fee => {
      this.setState({
        creationFee: fee.toString(),
      })
    })
  }

  handleChange = name => e =>
    this.setState({
      fields: {
        ...this.state.fields,
        [name]: e.target.value,
      },
      errors: {
        ...this.state.errors,
        [name]: null,
      }
    })

  onUserNameChange = e => {
    const username = e.target.value
    this.setState({
      fields: {
        ...this.state.fields,
        username,
      },
    })

    const invalid = steem.utils.validateAccountName(username)
    this.setState({
      errors: {
        ...this.state.errors,
        username: invalid,
      },
    })
  }

  onGeneratePassword = () =>
    this.setState({
      fields: {
        ...this.state.fields,
        password: generatePassword(),
      },
    })

  togglePassword = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    })
  }

  onWifBlur = () => {
    this.setState({
      errors: {
        ...this.state.errors,
        creatorWif:
          this.state.fields.creatorWif &&
          validateWif(this.state.fields.creatorWif),
      },
    })
  }

  checkUsernameAvailability = username => {
    if (this.state.errors.username) {
      return
    }

    this.setState({
      checkingAvailability: true,
    })

    isUsernameAvailable(username)
      .then(available => {
        this.setState({
          available,
          errors: {
            ...this.state.errors,
            username: available ? null : 'Not available',
          },
        })
      })
      .finally(() => {
        this.setState({ checkingAvailability: false })
      })
  }

  creatorExists = () =>
    isUsernameAvailable(this.state.fields.creatorName).then(available => {
      this.setState({
        errors: {
          ...this.state.errors,
          creatorName: available ? 'User does not exist' : null,
        },
      })
    })

  submitForm = e => {
    e.preventDefault()
    const { username, password, creatorName, creatorWif } = this.state.fields
    const creationFee = this.state.creationFee

    this.setState({
      creatingAccount: true,
      creationError: null,
    })

    createAccount(creatorWif, creationFee, creatorName, username, password)
      .then(res => {
        console.log(res)
        navigateTo('/acc-created')
      })
      .catch(e => {
        if (e.error == 'not_active_wif') {
          this.setState({
            errors: {
              ...this.state.errors,
              creatorWif: 'This should be an active key',
            },
          })
        } else if (e.error == 'unknown_creator') {
          this.setState({
            errors: {
              ...this.state.errors,
              creatorName: 'Unknown user',
            },
          })
        } else {
          this.setState({
            creationError: getCreationError(e),
          })
        }
        this.setState({
          creatingAccount: false,
        })
        console.error(e)
      })
  }

  isCreateButtonDisabled = () => {
    const fieldErrors = Object.keys(this.state.errors).reduce((acc, en) => {
      return Boolean(this.state.errors[en]) || acc
    }, false)

    const atLeastOneFieldEmpty = Object.keys(this.state.fields).reduce(
      (acc, f) => {
        return this.state.fields[f].length == 0 || acc
      },
      false
    )

    return (
      !this.state.savePasswordChecked || atLeastOneFieldEmpty || fieldErrors
    )
  }

  render() {
    return this.state.accountCreated ? (
      <AccountCreated />
    ) : (
      <div>
        <div className="alert alert-primary" role="alert">
          <span>Current account creation fee: </span>
          {this.state.creationFee || <Spinner />}
        </div>
        {this.state.creationError && (
          <div className="alert alert-danger" role="alert">
            {this.state.creationError}
          </div>
        )}
        <form onSubmit={this.submitForm}>
          <div className="form-group">
            <label htmlFor="creatorName">Creator name</label>
            <input
              type="text"
              className={cn('form-control', {
                'is-invalid': this.state.fields.creatorName && this.state.errors.creatorName,
              })}
              id="creatorName"
              placeholder="Enter creator name"
              onChange={this.handleChange('creatorName')}
              onBlur={this.creatorExists}
              value={this.state.fields.creatorName}
            />
            <div className="invalid-feedback">{this.state.errors.creatorName}</div>
          </div>
          <div className="form-group">
            <label htmlFor="creatorWif">Creator active key</label>
            <input
              type="password"
              className={cn('form-control', {
                'is-invalid': this.state.errors.creatorWif,
              })}
              id="creatorWif"
              placeholder="Enter creator active key"
              onChange={this.handleChange('creatorWif')}
              onBlur={this.onWifBlur}
              value={this.state.fields.creatorWif}
            />
            <div className="invalid-feedback">{this.state.errors.creatorWif}</div>
          </div>

          <div className="form-group">
            <label htmlFor="username">New username</label>
            <input
              type="text"
              className={cn('form-control', {
                'is-invalid': this.state.errors.username,
                'is-valid':
                  this.state.fields.username && !this.state.errors.username,
              })}
              id="username"
              placeholder="Enter username"
              onChange={this.onUserNameChange}
              value={this.state.fields.username}
              onBlur={() =>
                this.checkUsernameAvailability(this.state.fields.username)
              }
            />
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">{this.state.errors.username}</div>
          </div>
          <div className="form-group">
            <label htmlFor="password">New username password</label>
            <button
              type="button"
              style={{ float: 'right' }}
              onClick={this.onGeneratePassword}
              className="btn btn-outline-primary btn-sm"
            >
              Generate
            </button>
            <div className="input-group mb-3">
              <input
                type={this.state.showPassword ? 'text' : 'password'}
                id="password"
                className="form-control"
                placeholder="Password"
                onChange={this.handleChange('password')}
                value={this.state.fields.password}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={this.togglePassword}
                >
                  {this.state.showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="passwordCopyCheck"
              checked={this.state.savePasswordChecked}
              onChange={() =>
                this.setState({
                  savePasswordChecked: !this.state.savePasswordChecked,
                })
              }
            />
            <label className="form-check-label" htmlFor="passwordCopyCheck">
              I've copied and saved my password
            </label>
          </div>
          <div className="row">
            <div className="col col-12 text-center">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={this.submitForm}
                disabled={
                  this.isCreateButtonDisabled() || this.state.creatingAccount
                }
              >
                Create!
                {this.state.creatingAccount && (
                  <span>
                    <Spinner width={20} height={12} />
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default CreationForm
