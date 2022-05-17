import { QuoteList } from '../../core/model';
import { facadeFactory, QueryState } from '@spartacus/core';
import { Observable } from 'rxjs';
import { COMMERCE_QUOTES_FEATURE } from '../feature-name';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
  useFactory: () =>
    facadeFactory({
      facade: CommerceQuotesFacade,
      feature: COMMERCE_QUOTES_FEATURE,
      methods: ['getQuotesState'],
    }),
})
export abstract class CommerceQuotesFacade {
  /**
   * Returns the query list state.
   */
  abstract getQuotesState(): Observable<QueryState<QuoteList | undefined>>;
}
