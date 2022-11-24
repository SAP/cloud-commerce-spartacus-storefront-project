/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { ConfiguratorRouterExtractorService } from '@spartacus/product-configurator/common';
import {
  IntersectionOptions,
  IntersectionService,
} from '@spartacus/storefront';
import { Observable } from 'rxjs';
import {
  distinctUntilKeyChanged,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { ConfiguratorCommonsService } from '../../core/facade/configurator-commons.service';
import { Configurator } from '../../core/model/configurator.model';
import { ConfiguratorStorefrontUtilsService } from '../service/configurator-storefront-utils.service';

@Component({
  selector: 'cx-configurator-overview-menu',
  templateUrl: './configurator-overview-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguratorOverviewMenuComponent {
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#the_root_element__and_root_margin
    //https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin
    // top, right, bottom, left

    /**
     const options: IntersectionOptions = { rootMargin: '800px 0px -500px 0px' };
     const allHeadings =
     this.configuratorStorefrontUtilsService.getElements('h2');
     if (allHeadings) {
      for (let index = 0; index < allHeadings.length; index++) {
        this.intersectionService
          .isIntersecting(allHeadings[index], options)
          .subscribe((isIntersected) => {
            const id = allHeadings[index]?.id.replace(
              '-ovGroup',
              '-ovMenuItem'
            );
            if (id) {
              const querySelector = '#' + id;
              let groupItem =
                this.configuratorStorefrontUtilsService.getElement(
                  querySelector
                );
              if (!isIntersected) {
                groupItem?.classList.remove('active');
              } else {
                //groupItem?.classList.add('active');
                this.makeAllButtonsActive(groupItem);
                //this.enableActiveClass(id);
              }
            }
          });
      }
    }
     */

    const options: IntersectionOptions = { rootMargin: '0px 0px -500px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        let id = entry.target.getAttribute('id');
        if (id) {
          id = id?.replace('-ovGroup', '-ovMenuItem');
          const querySelector = '#' + id;
          let groupItem =
            this.configuratorStorefrontUtilsService.getElement(querySelector);

          //TODO: do we want to set a setting which defines where the top is => Ask Christoph
          if (
            entry.intersectionRatio > 0 &&
            entry.target.getBoundingClientRect().top <= 25
          ) {
            this.makeAllMenuItemsActive(groupItem);
          } else {
            groupItem?.classList.remove('active');
          }
        }
      });
    }, options);

    const groups =
      this.configuratorStorefrontUtilsService.getElements('div.cx-group');
    if (groups) {
      for (let index = 0; index < groups.length; index++) {
        observer.observe(groups[index]);
      }
    }
  }

  protected collectAllMenuItems(element: HTMLElement | undefined): Element[] {
    let menuItems: Element[] = [];
    if (element) {
      while (element?.parentElement?.classList?.contains('cx-menu-group')) {
        const child = element?.parentElement?.querySelector('.cx-menu-item');
        if (child) {
          if (menuItems.indexOf(child) === -1) {
            menuItems.unshift(child);
          }
        }
        element = element?.parentElement;
      }
    }
    return menuItems;
  }

  protected makeAllMenuItemsActive(element: HTMLElement | undefined) {
    if (element) {
      this.collectAllMenuItems(element).forEach((node) => {
        if (!node?.classList.contains('active')) {
          node?.classList.add('active');
        }
      });
    }
  }

  ovGroups$: Observable<Configurator.GroupOverview[] | undefined> =
    this.configRouterExtractorService.extractRouterData().pipe(
      switchMap((routerData) =>
        this.configuratorCommonsService.getOrCreateConfiguration(
          routerData.owner
        )
      ),
      distinctUntilKeyChanged('configId'),
      switchMap((configuration) =>
        this.configuratorCommonsService.getConfigurationWithOverview(
          configuration
        )
      ),
      filter((configuration) => configuration.overview != null),
      map((configuration) => configuration.overview?.groups),
      tap((data) => {
        if (data) {
          this.setHeight();
        }
      })
    );

  protected setHeight() {
    const ovForm = this.configuratorStorefrontUtilsService.getElement(
      'cx-configurator-overview-form'
    );

    const formHeight = ovForm?.getBoundingClientRect()?.height
      ? Math.round(ovForm?.getBoundingClientRect()?.height)
      : 0;

    if (formHeight) {
      this.configuratorStorefrontUtilsService.changeStyling(
        'cx-configurator-overview-menu',
        'height',
        formHeight + 'px'
      );
    }
  }

  constructor(
    protected configuratorCommonsService: ConfiguratorCommonsService,
    protected configRouterExtractorService: ConfiguratorRouterExtractorService,
    protected configuratorStorefrontUtilsService: ConfiguratorStorefrontUtilsService,
    protected intersectionService: IntersectionService
  ) {}

  /**
   * Retrieves the styling for the group levels.
   *
   * @param {number} level - Group level. 1 is top level.
   * @return {string} - corresponding style classes
   */
  getGroupLevelStyleClasses(level: number): string {
    return 'cx-menu-group' + ' groupLevel' + level;
  }

  /**
   * Navigates to group in OV form
   *
   * @param {string} id - Group id
   */
  navigateToGroup(prefix: string, id: string): void {
    const ovGroupId = this.configuratorStorefrontUtilsService.createOvGroupId(
      prefix,
      id
    );

    this.configuratorStorefrontUtilsService.scrollToConfigurationElement(
      '#' + ovGroupId + ' h2'
    );
  }

  /**
   * Retrieves the ids for the overview group headers
   *
   * @param {string} idPrefix - Prefix (reflects the parent groups in the hierarchy)
   * @param {string} groupId - local group id
   * @return {string} - unique group id
   */
  getGroupId(idPrefix: string, groupId: string): string {
    return this.configuratorStorefrontUtilsService
      ? this.configuratorStorefrontUtilsService.createOvGroupId(
          idPrefix,
          groupId
        )
      : idPrefix + groupId + '-ovGroup';
  }

  /**
   * Retrieves the ids for the overview menu group items
   *
   * @param {string} idPrefix - Prefix (reflects the parent groups in the hierarchy)
   * @param {string} groupId - local group id
   * @return {string} - unique group id
   */
  getMenuItemId(idPrefix: string, groupId: string): string {
    return this.configuratorStorefrontUtilsService
      ? this.configuratorStorefrontUtilsService.createOvMenuItemId(
          idPrefix,
          groupId
        )
      : idPrefix
      ? idPrefix + '--' + groupId + '-ovMenuItem'
      : groupId + '-ovMenuItem';
  }
}
