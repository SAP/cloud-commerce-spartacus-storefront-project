/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActiveCartFacade, Cart } from '@spartacus/cart/base/root';
import { GlobalMessageService, GlobalMessageType } from '@spartacus/core';
import {
  Quote,
  QuoteAction,
  QuoteActionType,
  QuoteFacade,
  QuoteRoleType,
  QuoteState,
} from '@spartacus/quote/root';
import {
  BREAKPOINT,
  BreakpointService,
  IntersectionOptions,
  IntersectionService,
  LAUNCH_CALLER,
  LaunchDialogService,
} from '@spartacus/storefront';
import { Observable, Subscription } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import {
  ConfirmActionDialogConfig,
  QuoteUIConfig,
} from '../../config/quote-ui.config';
import { ConfirmationContext } from '../confirm-dialog/quote-actions-confirm-dialog.model';
import { QuoteStorefrontUtilsService } from '../../../core/services/quote-storefront-utils.service';

@Component({
  selector: 'cx-quote-actions-by-role',
  templateUrl: './quote-actions-by-role.component.html',
})
export class QuoteActionsByRoleComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  protected quoteFacade = inject(QuoteFacade);
  protected launchDialogService = inject(LaunchDialogService);
  protected viewContainerRef = inject(ViewContainerRef);
  protected globalMessageService = inject(GlobalMessageService);
  protected quoteUIConfig = inject(QuoteUIConfig);
  protected activeCartFacade = inject(ActiveCartFacade);
  protected breakpointService = inject(BreakpointService);
  protected quoteStorefrontUtilsService = inject(QuoteStorefrontUtilsService);
  protected intersectionService = inject(IntersectionService);

  protected readonly CX_SECTION_SELECTOR = 'cx-quote-actions-by-role section';

  stickyStyles: readonly [property: string, value: string][] = [
    ['width', '100%'],
    ['padding-inline-end', '0'],
    ['padding-block-start', '1rem'],
    ['padding-block-end', '0'],
    ['position', '-webkit-sticky'],
    ['position', 'sticky'],
  ];

  fixedStyles: readonly [property: string, value: string][] = [
    ['width', '95%'],
    ['padding-inline-end', '1.5rem'],
    ['padding-block-start', '1.5rem'],
    ['padding-block-end', '1.5rem'],
    ['position', 'fixed'],
  ];

  desktopStyling: readonly [property: string, value: string][] = [
    ['width', '100%'],
    ['padding-block-start', '1rem'],
    ['position', 'static'],
  ];

  quoteDetails$: Observable<Quote> = this.quoteFacade.getQuoteDetails();
  cartDetails$: Observable<Cart> = this.activeCartFacade.getActive();

  @ViewChild('element') element: ElementRef;
  QuoteActionType = QuoteActionType;
  protected subscription = new Subscription();

  protected isDesktop() {
    return this.breakpointService.isUp(BREAKPOINT.md);
  }

  protected isMobile() {
    return this.breakpointService.isDown(BREAKPOINT.sm);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    console.log('resize');
    this.makeButtonsSticky();
    this.changeBottomStyling();
    this.prepareButtonsForDesktop();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    this.changeBottomStyling();
  }

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(): void {
    console.log('orientationchange');
    this.changeBottomStyling();
  }

  getSpareViewportHeight(): number {
    const spaHeaderHeight =
      this.quoteStorefrontUtilsService.getHeight('header');
    const quoteHeaderHeight =
      this.quoteStorefrontUtilsService.getHeight('.BottomHeaderSlot');

    const windowHeight = this.quoteStorefrontUtilsService.getWindowHeight();

    return windowHeight - spaHeaderHeight - quoteHeaderHeight;
  }

  protected changeBottomStyling(): void {
    this.isMobile()
      .pipe(take(1))
      .subscribe((mobile) => {
        if (mobile) {
          console.log('(changeBottomStyling) is mobile: ' + mobile);
          const calculatedActionButtonsHeight =
            this.quoteStorefrontUtilsService.getHeight(
              this.CX_SECTION_SELECTOR
            );
          const actionButtonsHeight =
            calculatedActionButtonsHeight !== 0
              ? calculatedActionButtonsHeight
              : 226;
          const sparViewportHeight = this.getSpareViewportHeight();

          if (sparViewportHeight < actionButtonsHeight) {
            const bottom = sparViewportHeight - actionButtonsHeight;
            console.log('bottom: ' + bottom);
            this.quoteStorefrontUtilsService.changeStyling(
              this.CX_SECTION_SELECTOR,
              'bottom',
              bottom + 'px'
            );
          } else {
            this.quoteStorefrontUtilsService.changeStyling(
              this.CX_SECTION_SELECTOR,
              'bottom',
              '0'
            );
          }
        }
      });
  }

  ngAfterViewInit(): void {
    this.makeButtonsSticky();
    this.changeBottomStyling();
    this.prepareButtonsForDesktop();
  }

  ngOnInit(): void {
    //submit button present and threshold not reached: Display message
    this.quoteDetails$.pipe(take(1)).subscribe((quote) => {
      const mustDisableAction = quote.allowedActions.find((action) =>
        this.mustDisableAction(action.type, quote)
      );
      if (mustDisableAction) {
        this.globalMessageService.add(
          {
            key: 'quote.commons.minRequestInitiationNote',
            params: {
              minValue: quote.threshold,
            },
          },
          GlobalMessageType.MSG_TYPE_WARNING
        );
      }
    });
  }

  protected prepareButtonsForDesktop(): void {
    this.isDesktop()
      .pipe(take(1))
      .subscribe((desktop) => {
        if (desktop) {
          console.log('prepareButtonsForDesktop() is desktop: ' + desktop);
          this.stickyStyles.forEach((style) => {
            this.quoteStorefrontUtilsService.removeStyling(
              this.CX_SECTION_SELECTOR,
              style[0]
            );
          });

          this.fixedStyles.forEach((style) => {
            this.quoteStorefrontUtilsService.removeStyling(
              this.CX_SECTION_SELECTOR,
              style[0]
            );
          });

          this.desktopStyling.forEach((style) => {
            this.quoteStorefrontUtilsService.changeStyling(
              this.CX_SECTION_SELECTOR,
              style[0],
              style[1]
            );
          });
        }
      });
  }

  protected makeButtonsSticky(): void {
    this.isMobile()
      .pipe(take(1))
      .subscribe((mobile) => {
        if (mobile) {
          console.log('makeButtonsSticky() is mobile: ' + mobile);
          this.fixedStyles.forEach((style) => {
            this.quoteStorefrontUtilsService.changeStyling(
              this.CX_SECTION_SELECTOR,
              style[0],
              style[1]
            );
          });

          const options: IntersectionOptions = {
            rootMargin: '9999px 0px -120px 0px',
          };

          const slot = this.quoteStorefrontUtilsService.getElement(
            'cx-page-slot.CenterRightContent'
          );
          if (slot) {
            this.intersectionService
              .isIntersecting(slot, options)
              .subscribe((isIntersecting) => {
                if (isIntersecting) {
                  this.stickyStyles.forEach((style) => {
                    this.quoteStorefrontUtilsService.changeStyling(
                      this.CX_SECTION_SELECTOR,
                      style[0],
                      style[1]
                    );
                  });
                } else {
                  this.fixedStyles.forEach((style) => {
                    this.quoteStorefrontUtilsService.changeStyling(
                      this.CX_SECTION_SELECTOR,
                      style[0],
                      style[1]
                    );
                  });
                }
              });
          }
        }
      });
  }

  /**
   * Checks whether the given action must be disabled on the UI based on the details of the quote.
   * For example the SUBMIT action is disabled when the quote threshold is not exceeded.
   *
   * @param type - type of the quote action
   * @param quote - quote
   * @returns true, only of the action shall be disabled
   */
  mustDisableAction(type: string, quote: Quote): boolean {
    return type === QuoteActionType.SUBMIT && !this.isThresholdReached(quote);
  }

  protected isThresholdReached(quote: Quote): boolean {
    const requestThreshold = quote.threshold || 0;
    return (quote.totalPrice.value || 0) >= requestThreshold;
  }

  /**
   * Generic click handler for quote action buttons.
   *
   * @param action - the action to be triggered
   * @param quote - quote
   * @param cart - cart
   */
  onClick(action: QuoteActionType, quote: Quote, cart: Cart) {
    const cartIsEmpty = (cart.entries?.length ?? 0) === 0;
    if (!this.isConfirmationDialogRequired(action, quote.state, cartIsEmpty)) {
      this.performAction(action, quote);
      return;
    }
    const context = this.prepareConfirmationContext(action, quote);
    this.launchConfirmationDialog(context);
    this.handleConfirmationDialogClose(action, context);
  }

  protected performAction(action: QuoteActionType, quote: Quote) {
    if (action === QuoteActionType.REQUOTE) {
      this.requote(quote.code);
    } else {
      this.quoteFacade.performQuoteAction(quote, action);
    }
  }

  protected launchConfirmationDialog(context: ConfirmationContext) {
    this.launchDialogService
      .openDialog(
        LAUNCH_CALLER.ACTION_CONFIRMATION,
        this.element,
        this.viewContainerRef,
        { confirmationContext: context }
      )
      ?.pipe(take(1))
      .subscribe();
  }

  protected handleConfirmationDialogClose(
    action: QuoteActionType,
    context: ConfirmationContext
  ) {
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
    this.subscription.add(
      this.launchDialogService.dialogClose
        .pipe(
          filter((reason) => reason === 'yes'),
          tap(() => this.performAction(action, context.quote)),
          filter(() => !!context.successMessage),
          tap(() =>
            this.globalMessageService.add(
              { key: context.successMessage },
              this.getMessageType(action)
            )
          )
        )
        .subscribe()
    );
  }

  protected getMessageType(action: QuoteActionType): GlobalMessageType {
    return action === QuoteActionType.CANCEL ||
      action === QuoteActionType.REJECT
      ? GlobalMessageType.MSG_TYPE_INFO
      : GlobalMessageType.MSG_TYPE_CONFIRMATION;
  }

  protected requote(quoteId: string) {
    this.quoteFacade.requote(quoteId);
  }

  /**
   * Returns the style class to be used for the button, so whether its a primary, secondary or tertiary button.
   *
   * @param allowedActions - currently displayed actions
   * @param action - action associated with this button
   * @returns 'btn-primary' | 'btn-secondary' | 'btn-tertiary'
   */
  getButtonStyle(allowedActions: QuoteAction[], action: QuoteAction): string {
    if (action.isPrimary) {
      return 'btn-primary';
    }
    if (allowedActions.length <= 2) {
      return 'btn-secondary';
    }
    return action.type === QuoteActionType.CANCEL
      ? 'btn-tertiary'
      : 'btn-secondary';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected isConfirmationDialogRequired(
    action: QuoteActionType,
    state: QuoteState,
    cartIsEmpty: boolean
  ): boolean {
    const mappingConfig = this.quoteUIConfig.quote?.confirmActionDialogMapping;
    const dialogConfig =
      mappingConfig?.[state]?.[action] ??
      mappingConfig?.[this.stateToRoleTypeForDialogConfig(state)]?.[action] ??
      mappingConfig?.[QuoteRoleType.ALL]?.[action];
    return (
      !!dialogConfig &&
      (!cartIsEmpty || !dialogConfig.showOnlyWhenCartIsNotEmpty)
    );
  }

  protected prepareConfirmationContext(
    action: QuoteActionType,
    quote: Quote
  ): ConfirmationContext {
    const dialogConfig = this.getConfirmDialogConfig(action, quote.state);
    const confirmationContext: ConfirmationContext = {
      quote: quote,
      title: dialogConfig.i18nKeyPrefix + '.title',
      confirmNote: dialogConfig.i18nKeyPrefix + '.confirmNote',
      a11y: {
        close: dialogConfig.i18nKeyPrefix + '.a11y.close',
      },
    };
    if (dialogConfig.showWarningNote) {
      confirmationContext.warningNote =
        dialogConfig.i18nKeyPrefix + '.warningNote';
    }
    if (dialogConfig.showExpirationDate) {
      confirmationContext.validity = 'quote.actions.confirmDialog.validity';
    }
    if (dialogConfig.showSuccessMessage) {
      confirmationContext.successMessage =
        dialogConfig.i18nKeyPrefix + '.successMessage';
    }
    return confirmationContext;
  }

  protected getConfirmDialogConfig(
    action: QuoteActionType,
    state: QuoteState
  ): ConfirmActionDialogConfig {
    const mappingConfig = this.quoteUIConfig.quote?.confirmActionDialogMapping;

    const config =
      mappingConfig?.[state]?.[action] ??
      mappingConfig?.[this.stateToRoleTypeForDialogConfig(state)]?.[action] ??
      mappingConfig?.[QuoteRoleType.ALL]?.[action];
    if (!config) {
      throw new Error(
        `Dialog Config expected for quote in state ${state} and action ${action}, but none found in config ${mappingConfig}`
      );
    }

    return config;
  }

  protected stateToRoleTypeForDialogConfig(state: QuoteState): QuoteRoleType {
    let foundRole: QuoteRoleType = QuoteRoleType.ALL;
    Object.values(QuoteRoleType).forEach((role) => {
      if (state.startsWith(role + '_')) {
        foundRole = role;
      }
    });
    return foundRole;
  }
}
