const { run } = require('hardhat')

const verifyContract = async (contractAddress) => {
  console.log('Verifying contract...')
  try {
    await run('verify:verify', {
      address: contractAddress,
    })

    console.log('Contract verified!')
  } catch (err) {
    console.log(err)
  }
}

module.exports = { verifyContract }
