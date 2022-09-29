import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';
dotenv.config();
const INFURA_ID = process.env["INFURA_ID"];
const defaultNetwork = "goerli";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork,
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_ID}`,
      accounts: [process.env["DEPLOYER_KEY"] as string],
    },
  },
};

export default config;
