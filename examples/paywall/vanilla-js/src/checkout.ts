// Setting a global paywall config!

declare global {
  interface Window {
    unlockProtocolConfig: any
    unlockProtocol: any
  }
  interface Event {
    detail: any
  }
}

export function setupCheckout(element: HTMLButtonElement) {
  // let counter = 0
  const checkout = () => {
    window.unlockProtocol.loadCheckoutModal()
  }
  element.addEventListener('click', () => checkout())

  const events = [
    'unlockProtocol.transactionSent',
    'unlockProtocol.status',
    'unlockProtocol.authenticated',
    'unlockProtocol.metadata',
  ]
  events.forEach((eventName) => {
    window.addEventListener(eventName, function (event) {
      console.group(`Received ${eventName}`)
      console.log(event.detail)
      console.groupEnd()
    })
  })
}
