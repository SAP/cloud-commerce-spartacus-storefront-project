import { Injectable } from '@angular/core';
import {
  ConfiguratorGroupsService,
  GenericConfigurator,
} from '@spartacus/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfigUtilsService {
  constructor(private configuratorGroupsService: ConfiguratorGroupsService) {}

  isCartEntryOrGroupVisited(
    owner: GenericConfigurator.Owner,
    groupId: string
  ): Observable<boolean> {
    return this.configuratorGroupsService.isGroupVisited(owner, groupId).pipe(
      take(1),
      map((result) => {
        if (owner.type === GenericConfigurator.OwnerType.CART_ENTRY || result) {
          return true;
        }
        return false;
      })
    );
  }
}
