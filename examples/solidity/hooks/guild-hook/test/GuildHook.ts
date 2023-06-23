const { expect } = require('chai')
const { ethers, unlock } = require('hardhat')

describe('GuildHook', function () {
  it('Should work', async function () {
    const [user] = await ethers.getSigners()
    const signer = ethers.Wallet.createRandom()
    const sender = '0xF5C28ce24Acf47849988f147d5C75787c0103534'.toLowerCase()

    const GuildHook = await ethers.getContractFactory('GuildHook')
    const hook = await GuildHook.deploy()
    await hook.deployed()

    await hook.addSigner(signer.address)

    // signing wrong message
    expect(
      await hook.checkIsSigner(sender, await signer.signMessage('hello'))
    ).to.equal(false)
    expect(
      await hook.checkIsSigner('hello', await signer.signMessage(sender))
    ).to.equal(false)

    // wrong signer
    expect(
      await hook.checkIsSigner(sender, await user.signMessage(sender))
    ).to.equal(false)

    // Correct signer, correct message
    const message = 'hello'
    const messageHash = ethers.utils.solidityKeccak256(
      ['string'],
      [message.toLowerCase()]
    )
    const signedMessage = await signer.signMessage(
      ethers.utils.arrayify(messageHash)
    )
    expect(ethers.utils.verifyMessage(message, signedMessage), signer.address)
    expect(await hook.checkIsSigner(message, signedMessage)).to.equal(true)
  })

  it('should work as a hook', async function () {
    const [user, another, aThird] = await ethers.getSigners()
    const signer = ethers.Wallet.createRandom()

    await unlock.deployProtocol()
    const expirationDuration = 60 * 60 * 24 * 7
    const maxNumberOfKeys = 100
    const keyPrice = 0

    const { lock } = await unlock.createLock({
      expirationDuration,
      maxNumberOfKeys,
      keyPrice,
      name: 'ticket',
    })
    const GuildHook = await ethers.getContractFactory('GuildHook')
    const hook = await GuildHook.deploy()
    await hook.deployed()
    await hook.addSigner(signer.address)

    // Set the hook on avatar
    await (
      await lock.setEventHooks(
        hook.address,
        ethers.constants.AddressZero,
        ethers.constants.AddressZero,
        ethers.constants.AddressZero,
        ethers.constants.AddressZero,
        ethers.constants.AddressZero,
        ethers.constants.AddressZero
      )
    ).wait()

    const messageHash = ethers.utils.solidityKeccak256(
      ['string'],
      [user.address.toLowerCase()]
    )
    const signedMessage = await signer.signMessage(
      ethers.utils.arrayify(messageHash)
    )

    const anotherMessageHash = ethers.utils.solidityKeccak256(
      ['string'],
      [another.address.toLowerCase()]
    )
    const anotherSignedMessage = await signer.signMessage(
      ethers.utils.arrayify(anotherMessageHash)
    )

    // Health check!
    expect(
      ethers.utils.verifyMessage(user.address.toLowerCase(), signedMessage),
      signer.address
    )
    expect(
      await hook.checkIsSigner(user.address.toLowerCase(), signedMessage)
    ).to.equal(true)

    // Let's now purchase a key!
    const tx = await lock.purchase(
      [0],
      [user.address, another.address],
      [user.address, another.address],
      [user.address, another.address],
      [signedMessage, anotherSignedMessage]
    )
    const receipt = await tx.wait()

    // Let's now purchase a key with the wrong signed message
    await expect(
      lock.purchase(
        [0],
        [aThird.address],
        [aThird.address],
        [aThird.address],
        [signedMessage]
      )
    ).to.revertedWith('WRONG_SIGNATURE')

    // Let's now purchase a key with no signed message
    await expect(
      lock.purchase(
        [0],
        [aThird.address],
        [aThird.address],
        [aThird.address],
        [[]]
      )
    ).to.revertedWith('ECDSA: invalid signature length')
  })

  it('should be able to add and remove signers from owner', async () => {
    const [user, anotherUser] = await ethers.getSigners()
    const signer = ethers.Wallet.createRandom()
    const GuildHook = await ethers.getContractFactory('GuildHook')
    const hook = await GuildHook.deploy()
    await hook.deployed()

    // Add a signer
    await hook.addSigner(signer.address)
    expect(await hook.signers(signer.address)).to.equal(true)
    expect(await hook.owner()).to.equal(user.address)

    // Transfer ownership
    expect(hook.transferOwnership(anotherUser.address))
    expect(await hook.owner()).to.equal(anotherUser.address)

    // Add a signer again from previous owner
    const anotherSigner = ethers.Wallet.createRandom()
    await expect(hook.addSigner(anotherSigner.address)).to.revertedWith(
      'Ownable: caller is not the owner'
    )
    expect(await hook.signers(anotherSigner.address)).to.equal(false)

    // Add a signer from new owner
    await hook.connect(anotherUser).addSigner(anotherSigner.address)
    expect(await hook.signers(anotherSigner.address)).to.equal(true)

    // Remove signer from new owner
    await hook.connect(anotherUser).removeSigner(signer.address)
    expect(await hook.signers(signer.address)).to.equal(false)
  })
})
