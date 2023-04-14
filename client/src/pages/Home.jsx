import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import TimeLine from '../components/TimeLine'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { ABI, ADMIN_ADDRESS, CONTRACT_ADDRESS } from '../../constants'

function Home() {
  const { isWeb3Enabled, account } = useMoralis()

  //   Buyer state
  const [buyer, setBuyer] = useState('')

  //   Contract balance
  const [balance, setBalance] = useState(null)

  //   Seller State
  const [seller, setSeller] = useState('')

  //   buyer confirmation status
  const [buyerConfirmed, setBuyerConfirmed] = useState(false)

  //   seller confirmed status
  const [sellerConfirmed, setSellerConfirmed] = useState(false)

  const [adminAddress, setAdminAddress] = useState(
    '0x5cbdf5f9e468df3888e04155668ccafc6f6c4dcf'
  )

  useEffect(() => {
    if (isWeb3Enabled) {
      populateData()
    }
  }, [
    isWeb3Enabled,
    account,
    buyerConfirmed,
    balance,
    buyerConfirmed,
    sellerConfirmed,
  ])

  // Fetch the buyer and seller address
  const populateData = async () => {
    try {
      const returnedBuyer = await getBuyer()
      setBuyer(returnedBuyer)

      const returnedSeller = await getSeller()
      setSeller(returnedSeller)

      const buyerStatus = await getBuyerConfirmation()
      setBuyerConfirmed(buyerStatus)

      const sellerStatus = await getSellerConfirmation()
      setSellerConfirmed(sellerStatus)

      const balanceResult = await getBalance()
      setBalance(balanceResult.toString())
    } catch (error) {
      console.log(error.response)
    }
  }

  const { runContractFunction: getBuyer } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'getBuyer',
    params: {},
  })

  //   Get balance
  const { runContractFunction: getBalance } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'getBalance',
    params: {},
  })

  const { runContractFunction: getSeller } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'getSeller',
    params: {},
  })

  //   Get buyer Confirmation status
  const { runContractFunction: getBuyerConfirmation } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'getBuyerConfirmation',
    params: {},
  })

  //   Get seller Confirmation status
  const { runContractFunction: getSellerConfirmation } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'getSellerConfirmation',
    params: {},
  })

  //   CONTRACT MUTATION FUNCTIONS
  //   Deposit money
  const {
    isLoading,
    runContractFunction: deposit,
    isFetching,
    error,
  } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'deposit',
    params: {},
    msgValue: 1,
  })

  //   Buyer Confirm delivery
  const {
    // isLoading,
    runContractFunction: confirmSellerDelivery,
    // isFetching,
    // error,
  } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'confirmSellerDelivery',
    params: {},
  })

  //   Seller Confirms receipt
  const {
    // isLoading,
    runContractFunction: confirmBuyerReceipt,
    // isFetching,
    // error,
  } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'confirmBuyerReceipt',
    params: {},
  })

  const depositFunds = async () => {
    try {
      await deposit()
    } catch (err) {
      console.log(error)
    }
  }

  const confirmDelivery = async () => {
    try {
      await confirmSellerDelivery()
    } catch (err) {
      console.log(error)
    }
  }

  const confirmReceipt = async () => {
    try {
      await confirmBuyerReceipt()
    } catch (err) {
      console.log(error)
    }
  }

  return (
    <Layout>
      <button
        onClick={depositFunds}
        className="bg-green-500 p-3 rounded-full px-5 text-white my-12"
      >
        Deposit Payment
      </button>

      {balance && <h1 className="text-xl font-bold">Escrow bal: {balance}</h1>}

      <h2>
        Admin:{' '}
        <span className="text-blue-600 cursor-pointer ml-2">
          {`${adminAddress.substring(0, 4)}....${adminAddress.substring(
            adminAddress.length - 4
          )}`}
        </span>
      </h2>
      <h2>
        Buyer:
        {buyer && (
          <span className="text-blue-600 ml-2 cursor-pointer">
            {`${buyer.substring(0, 4)}....${buyer.substring(
              adminAddress.length - 4
            )}`}
          </span>
        )}
      </h2>
      <h2>
        Seller:
        {seller && (
          <span className="text-blue-600 ml-2 cursor-pointer">
            {`${seller.substring(0, 4)}....${seller.substring(
              adminAddress.length - 4
            )}`}
          </span>
        )}
      </h2>

      {/* Timeline */}
      <div className="flex flex-1 items-center">
        {account &&
          buyer.toLocaleLowerCase() === account.toLocaleLowerCase() &&
          !buyerConfirmed && (
            <button
              onClick={confirmDelivery}
              className="bg-blue-300 h-10 rounded-full border-2 border-blue-600 px-4 text-blue-600"
            >
              Confirm Delivery
            </button>
          )}
        {account &&
          seller.toLocaleLowerCase() === account.toLocaleLowerCase() &&
          !sellerConfirmed && (
            <button
              onClick={confirmReceipt}
              className="bg-orange-300 h-10 rounded-full border-2 border-orange-600 px-4 text-orange-600"
            >
              Confirm Recipt
            </button>
          )}
      </div>

      <TimeLine
        buyerConfirmed={buyerConfirmed}
        sellerConfirmed={sellerConfirmed}
      />
    </Layout>
  )
}

export default Home
