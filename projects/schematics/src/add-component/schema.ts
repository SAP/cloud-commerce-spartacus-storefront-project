import { Schema } from '../add-spartacus/schema';

// TODO:#12 - extend schema?
// TODO:#12 - add other properties from Angular's Component schema?
export interface ComponentSchema extends Schema {
  name: string;
  createModule: boolean;
  module?: string;

  export: boolean;
  entryComponent: boolean;
  selector?: string;
  skipSelector: boolean;
  flat: boolean;
  skipTests: boolean;
  type: string;
}
