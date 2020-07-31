import { Component } from '@angular/core';
import {
  Configurator,
  ConfiguratorCommonsService,
  ConfiguratorGroupsService,
} from '@spartacus/core';
import { ConfigRouterExtractorService, ICON_TYPE } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'cx-config-group-title',
  templateUrl: './config-group-title.component.html',
})
export class ConfigGroupTitleComponent {
  configuration$: Observable<
    Configurator.Configuration
  > = this.configRouterExtractorService
    .extractRouterData()
    .pipe(
      switchMap((routerData) =>
        this.configuratorCommonsService.getConfiguration(routerData.owner)
      )
    );

  displayedGroup$: Observable<
    Configurator.Group
  > = this.configRouterExtractorService
    .extractRouterData()
    .pipe(
      switchMap((routerData) =>
        this.configuratorGroupsService.getCurrentGroup(routerData.owner)
      )
    );

  iconTypes = ICON_TYPE;

  constructor(
    protected configuratorCommonsService: ConfiguratorCommonsService,
    protected configuratorGroupsService: ConfiguratorGroupsService,
    protected configRouterExtractorService: ConfigRouterExtractorService
  ) {}
}
