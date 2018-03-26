import steem from 'steem'
import { resolve } from 'rsvp'
import { key_utils } from 'steem/lib/auth/ecc'
import { track } from './woopra'

export const getCreationFee = () =>
  steem.api
    .getConfigAsync()
    .then(config =>
      steem.api.getChainPropertiesAsync().then(chainProps => ({
        config,
        chainProps,
      }))
    )
    .then(({ config, chainProps }) => {
      const ratio = config['STEEM_CREATE_ACCOUNT_WITH_STEEM_MODIFIER']
      const fee = `${(
        parseFloat(chainProps.account_creation_fee) * ratio
      ).toFixed(3)} STEEM`
      return fee
    })

export const isUsernameAvailable = username =>
  steem.api
    .getAccountsAsync([username])
    .then(accData => accData.length == 0)
    .catch(e => {
      false
    })
    .finally(() => {
      false
    })

export const validateWif = wif => {
  if (wif.indexOf('STM') == 0) {
    return 'It looks like public key'
  } else {
    try {
      steem.auth.wifToPublic(wif)
      return null
    } catch (e) {
      return 'Incorrect key'
    }
  }
}

// https://github.com/steemit/condenser/blob/634c13cd0d2fafa28592e9d5f43589e201198248/app/components/elements/SuggestPassword.jsx
export const generatePassword = () => {
  const PASSWORD_LENGTH = 32
  const private_key = key_utils.get_random_key()
  return private_key.toWif().substring(3, 3 + PASSWORD_LENGTH)
}

const validateActiveWif = (username, wif) =>
  new Promise((resolve, reject) => {
    if (validateWif(wif)) {
      steem.api.getAccountsAsync([username]).then(([user]) => {
        if (!user) {
          return reject({ error: 'unknown_creator' })
        }
        const publicActive = user.active.key_auths[0][0]
        if (steem.auth.wifIsValid(wif, publicActive)) {
          resolve()
        } else {
          track('not_active_wif')
          reject({ error: 'not_active_wif' })
        }
      })
    } else {
      track('incorrect_wif')
      reject({ error: 'incorrect_wif' })
    }
  })

export const createAccount = (
  creatorWif,
  feeString,
  creator,
  newAccountName,
  newAccountPassword
) => {
  const publicKeys = steem.auth.generateKeys(
    newAccountName,
    newAccountPassword,
    ['posting', 'owner', 'active', 'memo']
  )

  const owner = {
    weight_threshold: 1,
    account_auths: [],
    key_auths: [[publicKeys.owner, 1]],
  }
  const active = {
    weight_threshold: 1,
    account_auths: [],
    key_auths: [[publicKeys.active, 1]],
  }
  const posting = {
    weight_threshold: 1,
    account_auths: [],
    key_auths: [[publicKeys.posting, 1]],
  }

  console.log('creating...')

  track('account_create')

  return validateActiveWif(creator, creatorWif).then(() =>
    steem.broadcast
      .accountCreateAsync(
        creatorWif,
        feeString,
        creator,
        newAccountName,
        owner,
        active,
        posting,
        publicKeys.memo,
        ''
      )
      .then(res => {
        track('account_create_success')
        return res
      })
      .catch(e => {
        track('account_create_error')
        throw e
      })
  )
}

const isBalanceError = e => {
  if (e.cause) {
    return (
      e.cause.toString().indexOf('Insufficient balance to create account') > -1
    )
  } else {
    return false
  }
}

export const getCreationError = e => {
  if (
    isBalanceError(e) &&
    e.data &&
    e.data.stack &&
    e.data.stack[0] &&
    e.data.stack[0].data
  ) {
    const data = e.data.stack[0].data
    return `Insufficient balance to create account. Balance is ${
      data['creator.balance']
    }. Required ${data.required}`
  } else {
    return 'Error when creating account. Check console log for more details.'
  }
}
