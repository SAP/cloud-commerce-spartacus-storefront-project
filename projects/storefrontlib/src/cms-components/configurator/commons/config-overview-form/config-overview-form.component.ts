import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Configurator, ConfiguratorCommonsService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { ConfigRouterExtractorService } from '../../generic/service/config-router-extractor.service';

@Component({
  selector: 'cx-config-overview-form',
  templateUrl: './config-overview-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigOverviewFormComponent implements OnInit {
  configuration$: Observable<Configurator.Configuration>;

  constructor(
    private configuratorCommonsService: ConfiguratorCommonsService,
    private configRouterExtractorService: ConfigRouterExtractorService
  ) {}

  ngOnInit(): void {
    this.configuration$ = this.configRouterExtractorService
      .extractRouterData()
      .pipe(
        switchMap((routerData) =>
          this.configuratorCommonsService.getOrCreateConfiguration(
            routerData.owner
          )
        ),
        take(1),
        switchMap((configuration) =>
          this.configuratorCommonsService.getConfigurationWithOverview(
            configuration
          )
        ),
        filter(
          (configuration) =>
            configuration.overview !== undefined &&
            configuration.overview !== null
        )
      );
    this.configRouterExtractorService
      .extractRouterData()
      .pipe(take(1))
      .subscribe((routingData) => {
        //In case the 'forceReload' is set (means the page is launched from the checkout in display only mode),
        //we need to initialise the cart configuration
        if (routingData.forceReload) {
          this.configuratorCommonsService.removeConfiguration(
            routingData.owner
          );
        }
      });
  }

  hasAttributes(configuration: Configurator.Configuration): boolean {
    if (!(configuration?.overview?.groups?.length > 0)) {
      return false;
    }

    return (
      configuration.overview.groups.find(
        (group) => group.attributes.length > 0
      ) !== null
    );
  }
}
