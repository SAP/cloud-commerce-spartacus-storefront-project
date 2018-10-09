import { Injectable } from '@angular/core';
import * as fromStore from '../store';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {
  readonly redirectUrl$: Observable<string> = this.store.pipe(
    select(fromStore.getRedirectUrl)
  );

  constructor(private store: Store<fromStore.RouterState>) {}

  public go(path: string, query?: any) {
    this.store.dispatch(
      new fromStore.Go({
        path: [path, query]
      })
    );
  }

  clearRedirectUrl() {
    this.store.dispatch(new fromStore.ClearRedirectUrl());
  }

  back() {
    this.store.dispatch(new fromStore.Back());
  }
}
