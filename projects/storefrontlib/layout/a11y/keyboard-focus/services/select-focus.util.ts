/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { inject, Injectable, Optional } from '@angular/core';
import { WindowRef } from '@spartacus/core';
import { filter, Observable, take } from 'rxjs';
import { AutoFocusConfig } from '../keyboard-focus.model';

@Injectable({
  providedIn: 'root',
})
export class SelectFocusUtility {
  /**
   * Query selectors used to query focusable child elements of the host element.
   * The selectors are supplemented with `:not([disabled])` and `:not([hidden])`.
   */
  protected focusableSelectors: string[] = [
    'a[href]',
    'button',
    '[tabindex]',
    'input',
    'select',
    'textarea',
  ];

  // like to leave out the following as we don't use it, and make this list exensible.
  //   `[contentEditable=true]`, // very unlikely to suport as we're not a business tool
  //   `iframe`, // we really don't like iframes...
  //   `area[href]`, // very debatable!

  protected focusableSelectorSuffix =
    ':not([disabled]):not([hidden]):not([aria-hidden])';

  @Optional() protected windowRef = inject(WindowRef);

  query(host: HTMLElement | null | undefined, selector: string): HTMLElement[] {
    if (!selector || selector === '') {
      return [];
    }
    return Array.from(
      host?.querySelectorAll(selector) as NodeListOf<HTMLElement>
    );
  }

  findFirstFocusable(
    host: HTMLElement | null | undefined,
    config: AutoFocusConfig = { autofocus: true }
  ): HTMLElement | undefined {
    const selector =
      typeof config?.autofocus === 'string' ? config.autofocus : '[autofocus]';
    // fallback to first focusable
    return (
      this.query(host, selector).find((el) => !this.isHidden(el)) ||
      this.findFocusable(host).find((el) => Boolean(el))
    );
  }

  /**
   * returns all focusable child elements of the host element. The element selectors
   * are build from the `focusableSelectors`.
   *
   * @param host the `HTMLElement` used to query focusable elements
   * @param locked indicates whether inactive (`tabindex="-1"`) focusable elements should be returned
   * @param invisible indicates whether hidden focusable elements should be returned
   */
  findFocusable(
    host: HTMLElement | null | undefined,
    locked = false,
    invisible = false
  ): HTMLElement[] {
    let suffix = this.focusableSelectorSuffix;
    if (!locked) {
      suffix += `:not([tabindex='-1'])`;
    }
    const selector = this.focusableSelectors
      .map((s) => (s += suffix))
      .join(',');
    return this.query(host, selector).filter((el) =>
      !invisible ? !this.isHidden(el) : Boolean(el)
    );
  }

  /**
   * Indicates whether the element is hidden by CSS. There are various CSS rules and
   * HTML structures which can lead to an hidden or invisible element. An `offsetParent`
   * of null indicates that the element or any of it's decendants is hidden (`display:none`).
   *
   * Oother techniques use the visibility (`visibility: hidden`), opacity (`opacity`) or
   * phyisical location on the element itself or any of it's anchestor elements. Those
   * technique require to work with the _computed styles_, which will cause a performance
   * downgrade. We don't do this in the standard implementaton.
   */
  protected isHidden(el: HTMLElement): boolean {
    return el.offsetParent === null;
  }

  /**
   * Restores the focus to the Card component after it has been selected and the checkout has finished updating.
   * It is used for cases where the focus is lost due to DOM changes making it impossible to target elements that have been modified.
   * @param isUpdating$ An observable that emits a boolean to indicate whether the component is updating.
   */
  focusCardAfterSelecting(isUpdating$: Observable<boolean>): void {
    const cardNodes = Array.from(
      this.windowRef?.document.querySelectorAll('cx-card')
    );
    const triggeredCard =
      this.windowRef?.document.activeElement?.closest('cx-card');

    if (triggeredCard) {
      const selectedCardIndex = cardNodes.indexOf(triggeredCard);
      isUpdating$
        .pipe(
          filter((isUpdating) => !isUpdating),
          take(1)
        )
        .subscribe(() => {
          requestAnimationFrame(() => {
            const selectedCard = this.windowRef?.document.querySelectorAll(
              'cx-card'
            )[selectedCardIndex] as HTMLElement;
            this.findFirstFocusable(selectedCard)?.focus();
          });
        });
    }
  }
}
