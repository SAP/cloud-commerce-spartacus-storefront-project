import { Injectable } from '@angular/core';
import { AuthService } from '@spartacus/core';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { expand, filter, switchMap } from 'rxjs/operators';
import { CpqAccessData } from './cpq-access-data.models';
import { CpqAccessLoaderService } from './cpq-access-loader.service';

export abstract class CpqConfiguratorTokenConfig {
  cpqConfigurator: {
    /* We should stop using/sending a token shortly before expiration,
     * to avoid that it is actually expired when evaluated in the target system */
    tokenExpirationBuffer: number;
    tokenMaxValidity: number;
  };
}

export const DefaultCpqConfiguratorTokenConfig: CpqConfiguratorTokenConfig = {
  cpqConfigurator: {
    tokenExpirationBuffer: 10000, // ten seconds
    tokenMaxValidity: 24 * 60 * 60 * 1000, //one day
  },
};

const EXPIRED_TOKEN = {
  accessToken: 'INVALID DUMMY',
  accessTokenExpirationTime: 0,
};

@Injectable({ providedIn: 'root' })
export class CpqAccessStorageService {
  constructor(
    protected cpqAccessLoaderService: CpqAccessLoaderService,
    protected authService: AuthService,
    protected config: CpqConfiguratorTokenConfig
  ) {}

  protected cpqAccessObservable: Observable<CpqAccessData>;
  protected currentCpqAccessSubscription: Subscription;
  protected cpqAccessDataCache: BehaviorSubject<CpqAccessData>;

  getCachedCpqAccessData(): Observable<CpqAccessData> {
    if (!this.cpqAccessObservable) {
      this.initCpqAccessObservable();
    }
    return this.cpqAccessObservable;
  }

  protected initCpqAccessObservable() {
    this.cpqAccessDataCache = new BehaviorSubject(EXPIRED_TOKEN);
    this.cpqAccessObservable = this.cpqAccessDataCache.pipe(
      // Never expose expired tokens - either cache was invalidated with expired token,
      // or the cached one expired before a new one was fetched.
      filter((data) => !this.isTokenExpired(data))
    );
    this.authService.isUserLoggedIn().subscribe((loggedIn) => {
      if (loggedIn) {
        // user logged in - start/stop to ensure token is refreshed
        this.stopAutoFetchingCpqAccessData();
        this.startAutoFetchingCpqAccessData();
      } else {
        // user logged of - cancel token fetching
        this.stopAutoFetchingCpqAccessData();
        this.cpqAccessDataCache.next(EXPIRED_TOKEN); // invalidate cache
      }
    });
  }

  protected stopAutoFetchingCpqAccessData() {
    this.currentCpqAccessSubscription?.unsubscribe();
  }

  protected startAutoFetchingCpqAccessData() {
    this.currentCpqAccessSubscription = this.cpqAccessLoaderService
      .getCpqAccessData()
      .pipe(
        expand((data) =>
          timer(this.fetchNextTokenIn(data)).pipe(
            switchMap(() => this.cpqAccessLoaderService.getCpqAccessData())
          )
        )
      )
      .subscribe((accessData) => {
        this.cpqAccessDataCache.next(accessData);
      });
  }

  protected fetchNextTokenIn(data: CpqAccessData) {
    // we schedule a request to update our cache some time before expiration
    console.log(this.config);
    let fetchNextIn: number =
      data.accessTokenExpirationTime -
      Date.now() -
      this.config.cpqConfigurator.tokenExpirationBuffer;
    if (fetchNextIn < 5) {
      fetchNextIn = 5;
    }
    if (fetchNextIn > this.config.cpqConfigurator.tokenMaxValidity) {
      fetchNextIn = this.config.cpqConfigurator.tokenMaxValidity;
    }
    return fetchNextIn;
  }

  protected isTokenExpired(tokenData: CpqAccessData) {
    return (
      Date.now() >
      tokenData.accessTokenExpirationTime -
        this.config.cpqConfigurator.tokenExpirationBuffer
    );
  }
}
