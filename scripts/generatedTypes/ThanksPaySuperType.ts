
import { ThanksPaySecurityTypes } from "./ThanksPaySecurityTypes";
import { ThanksPayDataTypes } from "./ThanksPayDataTypes";
import { ThanksPayMainTypes } from "./ThanksPayMainTypes";
import { ThanksPayRelayTypes } from "./ThanksPayRelayTypes";
import { ThanksPayCheckTypes } from "./ThanksPayCheckTypes";

export type ThanksPaySuperType = {
  thanksPaySecurity: ThanksPaySecurityTypes,
  thanksPayData: ThanksPayDataTypes,
  thanksPayMain: ThanksPayMainTypes,
  thanksPayRelay: ThanksPayRelayTypes,
  thanksPayCheck: ThanksPayCheckTypes,
};