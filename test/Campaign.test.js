const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async ()=>{
    accounts = await web3.eth.getAccounts();

    //Do this when you havent deployed a contract yet
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data: compiledFactory.bytecode})
        .send({from: accounts[0], gas: '1000000'})

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    //Do this when you have deployed a contract already
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface), campaignAddress)

})

describe('Campaigns', () => {
    it('both have an address', () => {
        assert.ok(factory.options.address)
        assert.ok(campaign.options.address)
    })

    it('marks caller as manager', async () => {
        const manager = await campaign.methods.manager().call()

        assert.strictEqual(accounts[0], manager)
    })

    it('able to donate money', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '500'
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call()
        assert(isContributor)

    })

    it('requires a min contribution', async () =>{
        try {
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '50'
            })
            assert(false)
        } catch (err) {
            assert(err)
        }
    })

    it('allows a manager to make a payment request', async () => {
        await campaign.methods.createRequest('buy batteries', '100', accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        })
        const request = await campaign.methods.requests(0).call()

        assert(request)
        assert.strictEqual('buy batteries', request.description)
    })

    it('end to end test', async () => {

        await campaign.methods.contribute().send({
            from: accounts[1],
            value: web3.utils.toWei('1', 'ether')
        })

        await campaign.methods.createRequest('buy things', web3.utils.toWei('0.5', 'ether'), accounts[0]).send({
            from: accounts[0],
            gas: '1000000'
        })

        const request = await campaign.methods.requests(0).call()
        assert.strictEqual('buy things', request.description)

        await campaign.methods.approveRequest(0).send({
            from: accounts[1],
            gas: '1000000'
        })

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })

        const isFinalized = await campaign.methods.requests(0).call()
        assert(isFinalized.complete)
    })
})