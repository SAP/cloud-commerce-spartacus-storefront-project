/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CommonConfigurator,
  CommonConfiguratorUtilsService,
  ConfiguratorRouter,
  ConfiguratorRouterExtractorService,
} from '@spartacus/product-configurator/common';
import { ICON_TYPE } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { ConfiguratorCommonsService } from '../../core/facade/configurator-commons.service';
import { Configurator } from '../../core/model/configurator.model';
import { NgIf, AsyncPipe } from '@angular/common';
import { IconComponent } from '../../../../../projects/storefrontlib/cms-components/misc/icon/icon.component';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { UrlPipe } from '../../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';

@Component({
  selector: 'cx-configurator-overview-notification-banner',
  templateUrl: './configurator-overview-notification-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    IconComponent,
    RouterLink,
    AsyncPipe,
    TranslatePipe,
    UrlPipe,
    MockTranslatePipe,
  ],
})
export class ConfiguratorOverviewNotificationBannerComponent {
  routerData$: Observable<ConfiguratorRouter.Data> =
    this.configRouterExtractorService.extractRouterData();

  configuration$: Observable<Configurator.Configuration> =
    this.routerData$.pipe(
      filter(
        (routerData) =>
          routerData.owner.type === CommonConfigurator.OwnerType.PRODUCT ||
          routerData.owner.type === CommonConfigurator.OwnerType.CART_ENTRY
      ),
      switchMap((routerData) =>
        this.configuratorCommonsService.getConfiguration(routerData.owner)
      )
    );

  configurationOverview$: Observable<Configurator.Overview | undefined> =
    this.configuration$.pipe(map((configuration) => configuration.overview));

  numberOfIssues$: Observable<number> = this.configuration$.pipe(
    map((configuration) => {
      //In case overview carries number of issues: We take it from there.
      //otherwise configuration's number will be accurate
      const configOv = configuration.overview;
      if (configOv?.totalNumberOfIssues) {
        return configOv.numberOfIncompleteCharacteristics !== undefined
          ? configOv.numberOfIncompleteCharacteristics
          : configOv.totalNumberOfIssues;
      } else {
        return configuration.totalNumberOfIssues
          ? configuration.totalNumberOfIssues
          : 0;
      }
    })
  );

  numberOfConflicts$: Observable<number> = this.configuration$.pipe(
    map((configuration) => {
      return configuration.overview?.numberOfConflicts ?? 0;
    })
  );

  skipConflictsOnIssueNavigation$: Observable<boolean> =
    this.configuration$.pipe(
      map((configuration) => {
        return (configuration.overview?.numberOfConflicts ?? 0) > 0;
      })
    );

  iconTypes = ICON_TYPE;

  constructor(
    protected configuratorCommonsService: ConfiguratorCommonsService,
    protected configRouterExtractorService: ConfiguratorRouterExtractorService,
    protected commonConfigUtilsService: CommonConfiguratorUtilsService
  ) {}
}
