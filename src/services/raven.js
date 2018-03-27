const captureException = e => {
  if (process.env.NODE_ENV === `production`) {
    Raven.captureException(e)
  } else {
    console.log('Capture Raven', e);
  }
}

export { captureException }
