import { networkNameType } from '@scripts/types/networkNameType';
import { ThanksPaySuperType } from '../generatedTypes/ThanksPaySuperType';

import {
  ThanksPayData,
  ThanksPayMain,
  ThanksPayRelay,
  ThanksPayCheck,
  ThanksPaySecurity,
} from '@scripts/classes';

const NETWORK: networkNameType = 'ganache';

export class ThanksPayServer {
  private thanksPayData: ThanksPayData;
  private thanksPayMain: ThanksPayMain;
  private thanksPayRelay: ThanksPayRelay;
  private thanksPayCheck: ThanksPayCheck;
  private thanksPaySecurity: ThanksPaySecurity;

  constructor() {
    this.thanksPayData = new ThanksPayData(NETWORK);
    this.thanksPayMain = new ThanksPayMain(NETWORK);
    this.thanksPayRelay = new ThanksPayRelay(NETWORK);
    this.thanksPayCheck = new ThanksPayCheck(NETWORK);
    this.thanksPaySecurity = new ThanksPaySecurity(NETWORK);
    console.log(
      'ThanksPayServer is created. Network is: ',
      NETWORK,
    )
  }

  public getArguments(functionName: string): any {
    if (
      functionName === 'registerWorker' ||
      functionName === 'registerPartner' 
    ) {
      return this.thanksPayData.getRequiredOrder(functionName);
    }
    if( 
      functionName === 'partnerAddBonus' || 
      functionName === 'partnerAddBalance' ||
      functionName === 'partnerWithdraw' ||
      functionName == 'workerGetsThanksPay'
    ) {
      return this.thanksPayMain.getRequiredOrder(functionName);
    }
  }

  public methods = {
    registerWorker: async (
      args: ThanksPaySuperType['thanksPayData']['registerWorker'],
    ): Promise<any> => {
      return await this.thanksPayData.methods['registerWorker'](args);
    },
    registerPartner: async (
      args: ThanksPaySuperType['thanksPayData']['registerPartner'],
    ): Promise<any> => {
      const receipt = await this.thanksPayData.methods['registerPartner'](args);
      console.log(receipt);
      return receipt;
    },
    partnerAddBonus: async (
      args: ThanksPaySuperType['thanksPayMain']['partnerAddBonus'],
    ): Promise<any> => {
      return await this.thanksPayMain.methods['partnerAddBonus'](args);
    },
    partnerAddBalance: async (
      args: ThanksPaySuperType['thanksPayMain']['partnerAddBalance'],
    ): Promise<any> => {
      return await this.thanksPayMain.methods['partnerAddBalance'](args);
    },
    partnerWithdraw: async (
      args: ThanksPaySuperType['thanksPayMain']['partnerWithdraw'],
    ): Promise<any> => {
      return await this.thanksPayMain.methods['partnerWithdraw'](args);
    },
    workerGetsThanksPay: async (
      args: ThanksPaySuperType['thanksPayMain']['workerGetsThanksPay'],
    ): Promise<any> => {
      return await this.thanksPayMain.methods['workerGetsThanksPay'](args);
    },
  };
}
