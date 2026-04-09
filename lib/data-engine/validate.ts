import { IcdCodeSchema } from './schema';

/**
 * Validates a batch of ICD-10 codes from the raw data.
 * Flags a code as 'Not Ready' if the Billable Status or Parent Code is missing.
 * 
 * @param rawCodes Array of unvalidated or partially validated code objects
 * @returns Array of processed codes with their readiness status updated
 */
export function validateAndProcessCodes(rawCodes: Partial<IcdCodeSchema>[]): IcdCodeSchema[] {
  return rawCodes.map((codeObj) => {
    const isMissingBillableStatus = codeObj.billable_flag === undefined || codeObj.billable_flag === null;
    const isMissingParent = codeObj.parent_code === undefined || codeObj.parent_code === null || codeObj.parent_code === '';

    return {
      ...codeObj,
      code: codeObj.code || 'UNKNOWN',
      plain_english_explanation: codeObj.plain_english_explanation || '',
      compare_targets: codeObj.compare_targets || [],
      parent_code: codeObj.parent_code || null,
      billable_flag: codeObj.billable_flag || false,
    } as IcdCodeSchema;
  });
}
