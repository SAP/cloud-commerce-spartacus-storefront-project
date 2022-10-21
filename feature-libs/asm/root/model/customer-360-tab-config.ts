import { Customer360SectionConfig } from './customer-360-section-config';
import { AsmCustomer360Query } from './customer-360.model';

export interface AsmCustomer360TabComponent {
  component: string;
  /** Data that can be associated to a component used to fetch information from a backend. */
  requestData?: AsmCustomer360Query;
  config?: Customer360SectionConfig;
}

export abstract class AsmCustomer360TabConfig {
  components: Array<AsmCustomer360TabComponent>;
  i18nNameKey: string;
}
