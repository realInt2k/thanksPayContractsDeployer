import { networkNameType } from "@scripts/types/networkNameType";
import { ThanksPayContracts } from "./baseContractClass";
import thanksSecurityABI from "../../abis/ThanksSecurity.json";
import thanksPaySecurityWrapperABI from "../../abis/ThanksSecurityWrapper.json";
import { ThanksPaySecurityType } from "@scripts/generatedTypes/ThanksPaySecurityType";
import { ThanksPaySecurityAdditionalType } from "@scripts/types/contractType";
import { CheckReturn, ViewReturn } from "@scripts/types/returnType";

import { ethers } from "ethers";

export class ThanksPaySecurity extends ThanksPayContracts {
  constructor(networkName: networkNameType) {
    super("THANKS_PAY_SECURITY_ADDR", networkName, thanksSecurityABI);
  }

  public methods = {
    authorize: async (args: ThanksPaySecurityAdditionalType["authorize"]) => {
      // first, get the currently authorized addresses
      const getOldAuthorizedContractAddresses = (await this.sendTx(
        "getAuthorizedContracts",
        []
      )) as ViewReturn;

      const getCurAuthorizedHumanaAddresses = (await this.sendTx(
        "getAuthorizedHuman",
        []
      )) as ViewReturn;
      // excluse the address of the signer
      const oldAuthorizedContracts =
        getOldAuthorizedContractAddresses.values.return;
      const oldAuthorizedHuman = getCurAuthorizedHumanaAddresses.values.return;
      // old (aka current) registered contract addresses will authorize new contract addresses
      // and they will authorize all the new human addresses
      if (oldAuthorizedContracts) {
        // change the mapping below to for-loop please:
        for (let i = 0; i < oldAuthorizedContracts.length; i++) {
          const address = oldAuthorizedContracts[i];
          // create an ethers contract instance for each address based on ThanksSecurityWrapper ABI
          const contract = new ethers.Contract(
            address,
            thanksPaySecurityWrapperABI,
            this.signer
          );
          // call the authorize method on each contract
          const tx = await contract.authorize(args.contractAddresses);
          await tx.wait();
          console.log("old autho. new contract addrs ??");
          const tx1 = await contract.authorize(args.humanAddresses);
          await tx1.wait();
          console.log("old autho. new human addrs ??");
        }
      }

      // new addresses that are contract will authorize old contract addresses as well
      // also, the new addresses will authorize themselves
      // also, they will also authorize all the old human addresses, and new human addresses
      for (let i = 0; i < args.contractAddresses.length; i++) {
        const address = args.contractAddresses[i];
        const contract = new ethers.Contract(
          address,
          thanksPaySecurityWrapperABI,
          this.signer
        );
        // call the authorize method on each contract
        const tx = await contract.authorize(args.contractAddresses);
        const receipt = await tx.wait();
        console.log("new autho. new contract addrs ??");
        const tx2 = await contract.authorize(oldAuthorizedContracts);
        const receipt2 = await tx2.wait();
        console.log("new autho. old contract addrs ??");
        const tx3 = await contract.authorize(args.humanAddresses);
        const receipt3 = await tx3.wait();
        console.log("new autho. new human addrrs ??");
        const tx4 = await contract.authorize(oldAuthorizedHuman);
        const receipt4 = await tx4.wait();
        console.log("new autho. old human addrrs ??");
      }
      // finally, add authorization to the old contract
      // return await this.sendTx("authorize", args.contractAddresses);
    },

    isAuthorized: async (args: ThanksPaySecurityAdditionalType["isAuthorized"]) => {
      return (await this.sendTx("isAuthorized", args)) as CheckReturn;
    },
  };
}
