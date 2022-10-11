import { OccConfig } from '@spartacus/core';
import { AccountSummaryOccEndpoints } from '../model';

const accountSummaryHeaderOccEndpoints: AccountSummaryOccEndpoints = {
  accountSummary: 'users/${userId}/orgUnits/${orgUnitId}/accountSummary',
  accountSummaryDocument: 'users/${userId}/orgUnits/${orgUnitId}/orgDocuments',
  accountSummaryDocumentAttachment:
    'users/${userId}/orgUnits/${orgUnitId}/orgDocuments/${orgDocumentId}/attachments/${orgDocumentAttachmentId}',
};

export const defaultOccAccountSummaryConfig: OccConfig = {
  backend: {
    occ: {
      endpoints: {
        ...accountSummaryHeaderOccEndpoints,
      },
    },
  },
};
