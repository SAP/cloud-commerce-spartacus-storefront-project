import { Injectable } from '@angular/core';
import { Config } from '@spartacus/core';

export interface QuoteUIConfigFragment {
  maxCharsForComments?: number;
}

@Injectable({
  providedIn: 'root',
  useExisting: Config,
})
export abstract class QuoteUIConfig {
  quote?: QuoteUIConfigFragment;
}
