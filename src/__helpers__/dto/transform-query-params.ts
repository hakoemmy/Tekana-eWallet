import { TransformFnParams } from 'class-transformer';
import { isBooleanString, isNumberString } from 'class-validator';

export abstract class ForQueryParams {
  static forOptionalDate(forOptionalDate: TransformFnParams) {
    if (forOptionalDate.value === null) return undefined;
    return new Date(forOptionalDate.value);
  }
  static forOptionalBoolean(n: TransformFnParams) {
    if (isBooleanString(n.value)) return JSON.parse(n.value);
    if (n.value === null) return undefined;
    return n.value;
  }

  static forOptionalString(n: TransformFnParams) {
    if (n.value === null) return undefined;
    return n.value;
  }

  static forOptionalNumber(n: TransformFnParams) {
    if (isNumberString(n.value)) return JSON.parse(n.value);
    if (n.value === null) return undefined;
    return n.value;
  }
}
