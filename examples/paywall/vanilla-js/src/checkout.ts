// Setting a global paywall config!

declare global {
  interface Window {
    unlockProtocolConfig: any
    unlockProtocol: any
  }
  interface Event {
    details: any
  }
}

export function setupCheckout(element: HTMLButtonElement) {
  // let counter = 0
  const checkout = () => {
    window.unlockProtocol.loadCheckoutModal()
  }
  element.addEventListener('click', () => checkout())

  window.addEventListener('unlockProtocol.transactionSent', function (event) {
    // This will include the metadata collected for that user
    console.log(event.details)
  })
}
