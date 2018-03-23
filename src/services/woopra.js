export const track = (event, options) => {
  if (process.env.NODE_ENV === `production`) {
    woopra.track(event, options || {})
  } else {
    console.log('Woopra track ', event)
    console.log('with options ', options)
  }
}
