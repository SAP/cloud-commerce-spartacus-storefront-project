import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { expand, filter, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Cpq } from '../../cpq/cpq.models';
import { CpqAccessLoaderService } from './cpq-access-loader.service';

const ONE_DAY = 24 * 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class CpqAccessStorageService {
  /* We should stop using/sending a token shortly before expiration,
   * to avoid that it is actaully expired when evaluated in the target system */
  static TOKEN_EXPIRATION_BUFFER = new InjectionToken<number>(
    'TOKEN_EXPIRATION_BUFFER',
    {
      factory: CpqAccessStorageService.defaultValue,
    }
  );

  constructor(
    protected cpqAccessLoaderService: CpqAccessLoaderService,
    @Inject(CpqAccessStorageService.TOKEN_EXPIRATION_BUFFER)
    protected EXPIRATION_BUFFER: number
  ) {}

  protected cpqAccessData: Observable<Cpq.AccessData>;
  protected currentCpqAccessData: Cpq.AccessData;
  protected cache: BehaviorSubject<Cpq.AccessData>;

  private static defaultValue() {
    return 1000;
  }

  getCachedCpqAccessData(): Observable<Cpq.AccessData> {
    if (!this.cpqAccessData) {
      this.cpqAccessData = this.cpqAccessLoaderService.getCpqAccessData().pipe(
        // schedule an auto refresh of token, when it expires
        tap((data) => console.log(`fetched first token ${data.accessToken}`)),
        expand((data) =>
          timer(this.fetchNextTokenIn(data)).pipe(
            tap(() =>
              console.log(`refreshing token data ${data.accessToken} now`)
            ),
            switchMap(() => this.cpqAccessLoaderService.getCpqAccessData())
          )
        ),
        tap((data) => console.log(`received a token ${data.accessToken} now`)),
        tap((data) => (this.currentCpqAccessData = data)), // store current data
        shareReplay(1),
        //token might be expired in the meantime and a new one was not feched, yet,
        filter((data) => !this.isTokenExpired(data)),
        tap((data) => console.log(`sending token ${data.accessToken} now`))
      );
    }
    return this.cpqAccessData;
  }

  protected fetchNextTokenIn(data: Cpq.AccessData) {
    // we schedule a request to update our cache some time before expiration
    let fetchNextIn: number =
      data.accessTokenExpirationTime - Date.now() - this.EXPIRATION_BUFFER;
    console.log(
      `${data.accessTokenExpirationTime} - ${Date.now()} - ${
        this.EXPIRATION_BUFFER
      }`
    );
    console.log(`${data.accessToken} will be refrshed in ${fetchNextIn} ms`);
    if (fetchNextIn < 5) {
      fetchNextIn = 5;
    }
    if (fetchNextIn > ONE_DAY) {
      fetchNextIn = ONE_DAY;
    }
    return fetchNextIn;
  }

  protected isTokenExpired(tokenData: Cpq.AccessData) {
    return (
      Date.now() > tokenData.accessTokenExpirationTime - this.EXPIRATION_BUFFER
    );
  }
}
