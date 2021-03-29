import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x98DBd9995327F25C59F516F65560626B5Eec6510"
);

export default instance;
