const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(process.env.mnemonic, process.env.infura);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);
  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: "0x" + compiledFactory.bytecode }) // add 0x bytecode
    .send({ from: accounts[0] }); // remove 'gas'

  console.log("interface", compiledFactory.interface);
  console.log("Contract deployed to", result.options.address);
};

deploy();
