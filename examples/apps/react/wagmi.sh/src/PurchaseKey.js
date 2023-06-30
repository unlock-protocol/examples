import * as React from 'react'
import { ethers } from 'ethers'
import { PublicLockV11 } from "@unlock-protocol/contracts";

import {
  useAccount,
  useContractRead,
  useSendTransaction,
  useWaitForTransaction,
  usePrepareContractWrite,
  erc20ABI,
  useBalance
} from 'wagmi'


export function PurchaseKeyForm({ lock, setLock, currency, keyPrice, purchaser }) {
  const [recipient, setRecipient] = React.useState(purchaser)
  const [referrer, setReferrer] = React.useState(purchaser)
  const [manager, setManager] = React.useState(purchaser)

  const { data: currencyName } = useContractRead({
    addressOrName: currency,
    contractInterface: erc20ABI,
    functionName: 'name',
    enabled: currency !== ethers.constants.AddressZero
  })

  const { config, error: transactionPrepareError } = usePrepareContractWrite({
    addressOrName: lock,
    contractInterface: PublicLockV11.abi,
    functionName: 'purchase',
    args: [
      [keyPrice],
      [recipient],
      [referrer],
      [manager],
      [[]]
    ],
    overrides: {
      // We must set a value if the contract is using the base currency...
      // Otherwise, make sure the sender has approved the right amount of ERC20
      value: currency !== ethers.constants.AddressZero ? ethers.constants.Zero : keyPrice
    }
  })

  const { data: transaction, sendTransaction } = useSendTransaction(config)

  const { isLoading, isSuccess, data: receipt, isError } = useWaitForTransaction({
    hash: transaction?.hash,
  })

  const { data: userERC20Balance } = useContractRead({
    addressOrName: lock,
    contractInterface: erc20ABI,
    functionName: 'balanceOf',
    args: [purchaser],
    enabled: currency && currency !== ethers.constants.AddressZero
  })

  const { data: { value: userBalance } } = useBalance({
    addressOrName: purchaser,
  })

  if (isLoading) return <div>Processing… <br /> {transaction?.hash}</div>
  if (isError) return <div>Transaction error!</div>
  if (isSuccess) return <div>Success! <br />Purchased! {receipt.logs[0].address}</div>

  let hasSufficientFunds = true
  if (currency !== ethers.constants.AddressZero) {
    hasSufficientFunds = userERC20Balance?.gte && userERC20Balance?.gte(keyPrice)
  } else {
    hasSufficientFunds = userBalance?.gte && userBalance?.gte(keyPrice)
  }


  const disabled = isLoading || transactionPrepareError || !hasSufficientFunds

  return (
    <form
      className='w-1/2'
      onSubmit={async (e) => {
        e.preventDefault()
        sendTransaction()
      }}
    >
      <div className="mb-6">
        <label className="text-base	block text-left">Lock:</label>
        <input
          aria-label="Lock"
          className='text-base px-4 py-3 w-full rounded text-black text-base'
          onChange={(e) => setLock(e.target.value)}
          value={lock}
        />
      </div>

      <div className="mb-6">
        <label className="text-base block text-left">Recipient (address who receives the membership NFT):</label>
        <input
          aria-label="Recipient"
          className='text-base px-4 py-3 w-full rounded text-black text-base'
          onChange={(e) => setRecipient(e.target.value)}
          type="text"
          value={recipient}
        />
      </div>

      <div className="mb-6">
        <label className="text-base block text-left">Referrer (address that receive the Unlock Governance Tokens and, if applicable, a referrer fee):</label>
        <input
          aria-label="Referrer"
          className='text-base px-4 py-3 w-full rounded text-black text-base'
          onChange={(e) => setReferrer(e.target.value)}
          type="text"
          value={referrer}
        />
      </div>

      <div className="mb-6">
        <label className="text-base block text-left">Manager (address that has the transfer rights on the NFT):</label>
        <input
          aria-label="Manager"
          className='text-base px-4 py-3 w-full rounded text-black text-base'
          onChange={(e) => setManager(e.target.value)}
          type="text"
          value={manager}
        />
      </div>

      {hasSufficientFunds && transactionPrepareError && <p className='text-red-300 text-left'>There is an error when preparing the transaction...</p>}
      {!hasSufficientFunds && <p className='text-red-300 text-left'>The user does not have sufficient funds {currency === ethers.constants.AddressZero ? '' : `in ${currencyName}`} to pay for the membership</p>}

      <button type="submit" disabled={disabled} className="block w-full mt-8 px-4 py-3 w-full text-white text-base bg-blue-700 hover:bg-blue-800 focus:outline-none rounded-lg text-center">
        Send
      </button>
    </form>
  )
}


export function PurchaseKey() {
  const { address: purchaser } = useAccount()

  // DAI lock 0xC99794927355F7E3755Fe5fA1c45aA3cD3084e5d
  // Eth lock 0xBA570C1b9E70f63b9de9e9228c88cA58310b3a56
  const [lock, setLock] = React.useState('0xBA570C1b9E70f63b9de9e9228c88cA58310b3a56')

  const { data: currency } = useContractRead({
    addressOrName: lock,
    contractInterface: PublicLockV11.abi,
    functionName: 'tokenAddress',
  })

  const { data: keyPrice } = useContractRead({
    addressOrName: lock,
    contractInterface: PublicLockV11.abi,
    functionName: 'keyPrice',
  })

  if (ethers.utils.isAddress(lock) && (!currency || !keyPrice)) {
    return <div>Loading...</div>
  }

  return (
    <PurchaseKeyForm purchaser={purchaser} lock={lock} setLock={setLock} currency={currency} keyPrice={keyPrice} />
  )
}


export default PurchaseKey
