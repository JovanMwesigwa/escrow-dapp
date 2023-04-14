import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import TimeLine from '../components/TimeLine'
import { useMoralis, useWeb3Contract } from 'react-moralis'

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

  return (
    <Layout>
      <button className="p-3 px-5 my-12 text-white bg-green-500 rounded-full">
        Deposit Payment
      </button>

      <h1 className="text-xl font-bold">Escrow bal: </h1>

      <h2>
        Admin:{' '}
        <span className="ml-2 text-blue-600 cursor-pointer">
          {`${adminAddress.substring(0, 4)}....${adminAddress.substring(
            adminAddress.length - 4
          )}`}
        </span>
      </h2>
      <h2>Buyer:</h2>
      <h2>Seller:</h2>

      {/* Timeline */}
      <div className="flex items-center flex-1">
        <button className="h-10 px-4 mr-5 text-blue-600 bg-blue-300 border-2 border-blue-600 rounded-full">
          Confirm Delivery
        </button>
        <button className="h-10 px-4 text-orange-600 bg-orange-300 border-2 border-orange-600 rounded-full">
          Confirm Recipt
        </button>
      </div>

      <TimeLine
        buyerConfirmed={buyerConfirmed}
        sellerConfirmed={sellerConfirmed}
      />
    </Layout>
  )
}

export default Home
