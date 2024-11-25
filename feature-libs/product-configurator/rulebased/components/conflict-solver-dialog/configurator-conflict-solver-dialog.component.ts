/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  LaunchDialogService,
  ICON_TYPE,
  FocusConfig,
  KeyboardFocusService,
} from '@spartacus/storefront';
import { Observable, Subscription } from 'rxjs';
import { ConfiguratorRouter } from '@spartacus/product-configurator/common';
import { Configurator } from '../../core/model/configurator.model';
import { ConfiguratorCommonsService } from '../../core/facade/configurator-commons.service';
import { take } from 'rxjs/operators';
import { ConfiguratorStorefrontUtilsService } from '../service/configurator-storefront-utils.service';
import { FocusDirective } from '../../../../../projects/storefrontlib/layout/a11y/keyboard-focus/focus.directive';
import { FeatureDirective } from '@spartacus/core';
import { IconComponent } from '../../../../../projects/storefrontlib/cms-components/misc/icon/icon.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { ConfiguratorGroupComponent } from '../group/configurator-group.component';
import { TranslatePipe } from '@spartacus/core';
import { MockTranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-configurator-conflict-solver-dialog',
  templateUrl: './configurator-conflict-solver-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FocusDirective,
    FeatureDirective,
    IconComponent,
    NgIf,
    ConfiguratorGroupComponent,
    AsyncPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class ConfiguratorConflictSolverDialogComponent
  implements OnInit, OnDestroy
{
  iconTypes = ICON_TYPE;
  uiType = Configurator.UiType;

  focusConfig: FocusConfig = {
    trap: true,
    block: true,
    autofocus: true,
    focusOnEscape: true,
  };

  protected subscription = new Subscription();

  routerData$: Observable<ConfiguratorRouter.Data>;
  conflictGroup$: Observable<Configurator.Group>;

  constructor(
    protected configuratorStorefrontUtilsService: ConfiguratorStorefrontUtilsService,
    protected configuratorCommonsService: ConfiguratorCommonsService,
    protected launchDialogService: LaunchDialogService,
    protected focusService: KeyboardFocusService
  ) {}

  init(
    conflictGroup: Observable<Configurator.Group>,
    routerData: Observable<ConfiguratorRouter.Data>
  ): void {
    this.focusService.clear();
    this.conflictGroup$ = conflictGroup;
    this.routerData$ = routerData;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.launchDialogService.data$.subscribe((dialogData) => {
        this.init(dialogData.conflictGroup, dialogData.routerData);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Closes a modal with a certain reason.
   * Scrolls to the top of the configuration form.
   * Sets focus to the first attribute.
   *
   * @param {any} reason - Reason
   */
  dismissModal(reason?: any): void {
    this.routerData$
      .pipe(take(1))
      .subscribe((routerData) =>
        this.configuratorCommonsService.dismissConflictSolverDialog(
          routerData.owner
        )
      );
    this.launchDialogService.closeDialog(reason);

    this.configuratorStorefrontUtilsService.scrollToConfigurationElement(
      '.VariantConfigurationTemplate'
    );
    this.configuratorStorefrontUtilsService.focusFirstAttribute();
  }
}
