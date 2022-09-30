import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';
dotenv.config();
const INFURA_ID = process.env["INFURA_ID"];

const defaultNetwork = "localhost";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork,
  networks: {
    hardhat: {
      forking: {
        url: `https://goerli.infura.io/v3/1e43f3d31eea4244bf25ed4c13bfde0e`,
        blockNumber: 7631671,
      },
    },
    localhost: {
      url: 'http://localhost:8545',
      chainId: 31337,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_ID}`,
      accounts: [process.env["DEPLOYER_KEY"] as string],
    },
  },
};

export default config;
