import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  Configurator,
  ConfiguratorCommonsService,
  ConfiguratorGroupsService,
  GenericConfigurator,
  LanguageService,
} from '@spartacus/core';
import {
  ConfigRouterExtractorService,
  ConfigurationRouter,
} from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, switchMap, take } from 'rxjs/operators';
import { ConfigFormUpdateEvent } from './config-form.event';

@Component({
  selector: 'cx-config-form',
  templateUrl: './config-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigFormComponent implements OnInit {
  configuration$: Observable<
    Configurator.Configuration
  > = this.configRouterExtractorService.extractRouterData().pipe(
    filter(
      (routerData) =>
        routerData.pageType === ConfigurationRouter.PageType.CONFIGURATION
    ),
    switchMap((routerData) => {
      return this.configuratorCommonsService.getOrCreateConfiguration(
        routerData.owner
      );
    })
  );
  currentGroup$: Observable<
    Configurator.Group
  > = this.configRouterExtractorService
    .extractRouterData()
    .pipe(
      switchMap((routerData) =>
        this.configuratorGroupsService.getCurrentGroup(routerData.owner)
      )
    );

  activeLanguage$: Observable<string> = this.languageService.getActive();

  uiType = Configurator.UiType;

  constructor(
    protected configuratorCommonsService: ConfiguratorCommonsService,
    protected configuratorGroupsService: ConfiguratorGroupsService,
    protected configRouterExtractorService: ConfigRouterExtractorService,
    protected languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.configRouterExtractorService
      .extractRouterData()
      .pipe(take(1))
      .subscribe((routingData) => {
        //In case the 'forceReload' is set (means the page is launched from the cart),
        //we need to initialise the cart configuration
        if (routingData.forceReload) {
          this.configuratorCommonsService.removeConfiguration(
            routingData.owner
          );
        }

        //In case of resolving issues, check if the configuration contains conflicts,
        //if not, check if the configuration contains missing mandatory fields and show the according group
        if (routingData.resolveConflicts) {
        }
      });
  }

  updateConfiguration(event: ConfigFormUpdateEvent): void {
    const owner: GenericConfigurator.Owner = { key: event.productCode };

    this.configuratorCommonsService.updateConfiguration(
      event.productCode,
      event.groupId,
      event.changedAttribute
    );

    // Wait until update is done until setting the group status
    this.configuratorCommonsService
      .isConfigurationLoading(owner)
      .pipe(
        distinctUntilChanged(),
        filter((isLoading) => !isLoading),
        take(1)
      )
      .subscribe(() =>
        this.configuratorGroupsService.setGroupStatus(
          owner,
          event.groupId,
          false
        )
      );
  }
}
