import { Framework, Host, normalizeAddress } from "@superfluid-finance/sdk-core";
import { ethers } from "hardhat";
import * as dotenv from 'dotenv';
import { BytesLike, Contract, Wallet } from "ethers";
import { HOST_ABI } from "../data/host_abi";
import { CASH_AGREEMENT_ABI } from "../data/cashFlow_abi";
import { GelatoOpsSDK, TaskTransaction } from "@gelatonetwork/ops-sdk";


dotenv.config();

async function stopStream() {

  let provider = ethers.provider;

  const privKeyDEPLOYER = process.env['DEPLOYER_KEY'] as BytesLike;
  const deployer_wallet = new Wallet(privKeyDEPLOYER);
  const deployer = await deployer_wallet.connect(provider);

  const privKeyUSER = process.env['USER1_KEY'] as BytesLike;
  const user_wallet = new Wallet(privKeyUSER);
  const user1 = await user_wallet.connect(provider);

  const gelatoOps = new GelatoOpsSDK(5, deployer);

  const sf = await Framework.create({
    chainId: 5, // you can also use chainId here instead
    provider: provider
  });

  let host = "0x22ff293e14F1EC3A09B137e9e06084AFd63adDF9"
  let cfa = "0xEd6BcbF6907D4feEEe8a8875543249bEa9D308E8"
  let superToken = "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00";

  let gelato ="0x683913B3A32ada4F8100458A3E1675425BdAa7DF"

  try {

    await sf.cfaV1.authorizeFlowOperatorWithFullControl({flowOperator:gelato,superToken:superToken})

    const hostContract= new Contract(host,HOST_ABI,deployer)  ;

    const cfaInterface = new ethers.utils.Interface(
        CASH_AGREEMENT_ABI
    );
    const hostInterface = new ethers.utils.Interface(
      HOST_ABI
    )

  
    const cfaCallData = cfaInterface.encodeFunctionData(
      "deleteFlow",
      [superToken,deployer.address, user1.address,"0x" ]
    );


    const hostCallData = hostInterface.encodeFunctionData("callAgreement",
        [cfa,cfaCallData,"0x"]      
    )

 
    // const params =  [cfa,cfaCallData,"0x"] ;
    // const action = 'callAgreement';
    // const unsignedTx = await  hostContract.populateTransaction[action](...params);
    // let tx = await deployer.sendTransaction(unsignedTx);


    //let tx = await deployer.sendTransaction({data:hostCallData})
   // await tx.wait()
      let execData = hostCallData;
      let execAddress = host;
      let startTime = +((new Date().getTime()/1000).toFixed(0))+ 300;

      const  { taskId, tx }: TaskTransaction = await gelatoOps.createTask({
        execAddress,
        execSelector: hostInterface.getSighash("callAgreement(address,bytes,bytes)"),
        execData,
        name: "Automated stip stream",
        dedicatedMsgSender:false,
        useTreasury:false,
      });
    
        console.log(taskId)

       await tx.wait()

  
    console.log(tx)

} catch (error) {
  
  console.error(error);
}

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
stopStream().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
