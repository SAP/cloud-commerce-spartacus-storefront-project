import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { RoutingService, CmsService } from '@spartacus/core';

import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class CmsPageGuard implements CanActivate {
  static guardName = 'CmsPageGuard';

  constructor(
    private routingService: RoutingService,
    private cmsService: CmsService
  ) {}

  canActivate(): Observable<boolean> {
    let pageId: string;

    return this.routingService.getPageContext().pipe(
      // this is a temporary workaround to prevent infinite redirect to not found page (if not properly configured on the backend)
      // will be removed/refactored in follow up tickets (
      tap(pageContext => {
        pageId = pageContext.id;
      }),
      switchMap(pageContext => this.cmsService.hasPage(pageContext)),
      catchError(() => of(false)),
      tap(hasPage => {
        if (!hasPage && pageId !== '/notFound') {
          this.routingService.go(['notFound']);
        }
      })
    );
  }
}
