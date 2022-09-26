import * as React from 'react'
import { ethers } from 'ethers'
import { UnlockV11, PublicLockV11 } from "@unlock-protocol/contracts";

import {
  erc20ABI,
  useAccount,
  useSendTransaction,
  useWaitForTransaction,
  useContractRead,
  usePrepareContractWrite
} from 'wagmi'

const lockInterface = new ethers.utils.Interface(PublicLockV11.abi)


export function DeployLock() {
  const { address: creator } = useAccount()

  const [calldata, setCalldata] = React.useState('')
  const [name, setName] = React.useState('My Membership')
  const [price, setPrice] = React.useState(1)
  const [duration, setDuration] = React.useState(30) // in days
  const [supply, setSupply] = React.useState(10000)
  const [currency, setCurrency] = React.useState('') // address of the ERC20. If 0x0, uses base currency

  const { data: decimals } = useContractRead({
    addressOrName: currency,
    contractInterface: erc20ABI,
    functionName: 'decimals',
    enabled: currency !== ethers.constants.AddressZero
  })


  React.useEffect(() => {
    const prepareCalldata = async () => {
      setCalldata(lockInterface.encodeFunctionData(
        'initialize(address,uint256,address,uint256,uint256,string)',
        [
          creator,
          duration * 60 * 60 * 24, // duration is in days!
          currency || ethers.constants.AddressZero,
          ethers.utils.parseUnits(price.toString(), decimals || 18),
          supply,
          name,
        ]
      ))
    }
    prepareCalldata()
  }, [creator, duration, currency, price, supply, name, decimals])


  const { config } = usePrepareContractWrite({
    addressOrName: '0x627118a4fB747016911e5cDA82e2E77C531e8206',
    contractInterface: UnlockV11.abi,
    functionName: 'createUpgradeableLockAtVersion',
    args: [calldata, 11] // We currently deploy version 11
  })
  const { data: transaction, sendTransaction } = useSendTransaction(config)

  const { isLoading, isSuccess, data: receipt, isError } = useWaitForTransaction({
    hash: transaction?.hash,
  })


  if (isLoading) return <div>Processing… <br /> {transaction?.hash}</div>
  if (isError) return <div>Transaction error!</div>
  if (isSuccess) return <div>Success! <br />Lock Deployed at {receipt.logs[0].address}</div>

  return (
    <form
      className='w-1/2'
      onSubmit={async (e) => {
        e.preventDefault()
        sendTransaction()
      }}
    >

      <p className='block text-left'>Deploy a new membership contract!</p>

      <div className="mb-6">
        <label className="text-base	block text-left">Name:</label>
        <input
          aria-label="Name"
          className='text-base px-4 py-3 w-full rounded text-black text-base'
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>

      <div className="mb-6">
        <label className="text-base	block text-left">Duration (days):</label>
        <input
          aria-label="Duration"
          className='text-base px-4 py-3 w-full rounded text-black text-base'
          onChange={(e) => setDuration(e.target.value)}
          type="number"
          value={duration}
        />
      </div>

      <div className="mb-6">
        <label className="text-base	block text-left">Supply:</label>
        <input
          aria-label="Supply"
          className='text-base px-4 py-3 w-full rounded text-black text-base'
          onChange={(e) => setSupply(e.target.value)}
          type="number"
          value={supply}
        />
      </div>

      <div className="mb-6">
        <label className="text-base	block text-left">Currency (address of the ERC20 contract used as currency for purchases. Leave empty to use the chain's base currency):</label>
        <input
          aria-label="Currency"
          className='text-base px-4 py-3 w-full rounded text-black text-base'
          onChange={(e) => setCurrency(e.target.value)}
          type="text"
          value={currency}
        />
      </div>

      <div className="mb-6">
        <label className="text-base block text-left">Price:</label>
        <input
          aria-label="Price"
          className='text-base px-4 py-3 w-full rounded text-black text-base'
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          value={price}
        />
      </div>

      <button type="submit" disabled={isLoading} className="block w-full mt-8 px-4 py-3 text-white text-base bg-blue-700 hover:bg-blue-800 focus:outline-none rounded-lg text-center">
        Send
      </button>
    </form>
  )
}


export default DeployLock
