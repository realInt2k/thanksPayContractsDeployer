
import { ThanksPaySecurityType } from "./ThanksPaySecurityType";
import { ThanksPayDataType } from "./ThanksPayDataType";
import { ThanksPayMainType } from "./ThanksPayMainType";
import { ThanksPayRelayType } from "./ThanksPayRelayType";
import { ThanksPayCheckType } from "./ThanksPayCheckType";
import { oldThanksType } from "./oldThanksType";

export type ThanksPaySuperType = {
  thanksPaySecurity: ThanksPaySecurityType,
  thanksPayData: ThanksPayDataType,
  thanksPayMain: ThanksPayMainType,
  thanksPayRelay: ThanksPayRelayType,
  thanksPayCheck: ThanksPayCheckType,
  oldThanks: oldThanksType,
};