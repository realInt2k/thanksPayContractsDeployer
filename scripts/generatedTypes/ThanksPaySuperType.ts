
import { ThanksPaySecurityType } from "./ThanksPaySecurityTypes";
import { ThanksPayDataType } from "./ThanksPayDataTypes";
import { ThanksPayMainType } from "./ThanksPayMainTypes";
import { ThanksPayRelayType } from "./ThanksPayRelayTypes";
import { ThanksPayCheckType } from "./ThanksPayCheckTypes";

export type ThanksPaySuperType = {
  thanksPaySecurity: ThanksPaySecurityType,
  thanksPayData: ThanksPayDataType,
  thanksPayMain: ThanksPayMainType,
  thanksPayRelay: ThanksPayRelayType,
  thanksPayCheck: ThanksPayCheckType,
};