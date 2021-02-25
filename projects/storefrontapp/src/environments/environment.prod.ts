import { Environment } from './models/environment.model';

export const environment: Environment = {
  production: true,
  occBaseUrl: buildProcess.env.CX_BASE_URL ?? 'https://20.83.184.244:9002',
  occApiPrefix: '/occ/v2/',
  cds: buildProcess.env.CX_CDS,
  b2b: buildProcess.env.CX_B2B,
  cdc: buildProcess.env.CX_CDC,
};
