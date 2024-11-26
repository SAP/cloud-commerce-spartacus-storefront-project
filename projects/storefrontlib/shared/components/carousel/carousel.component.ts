/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  isDevMode,
  OnChanges,
  OnInit,
  Optional,
  Output,
  TemplateRef,
} from '@angular/core';
import { LoggerService, useFeatureStyles } from '@spartacus/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ICON_TYPE } from '../../../cms-components/misc/icon/icon.model';
import { CarouselService } from './carousel.service';
import { SelectFocusUtility } from '../../../layout/a11y/keyboard-focus/services/select-focus.util';
import { DOCUMENT } from '@angular/common';

/**
 * Generic carousel component that can be used to render any carousel items,
 * such as products, images, banners, or any component. Carousel items are
 * rendered in so-called carousel slides, and the previous/next buttons as well as
 * the indicator-buttons can used to navigate the slides.
 *
 * The component uses an array of Observables (`items$`) as an input, to allow
 * for lazy loading of items.
 *
 * The number of items per slide is calculated with the `itemWidth`, which can given
 * in pixels or percentage.
 *
 * To allow for flexible rendering of items, the rendering is delegated to the
 * given `template`. This allows for maximum flexibility.
 */
@Component({
  selector: 'cx-carousel',
  templateUrl: './carousel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent implements OnInit, OnChanges {
  @Output() keybordEvent = new BehaviorSubject<KeyboardEvent | null>(null);
  /**
   * The title is rendered as the carousel heading.
   */
  @Input() title: string | undefined | null;

  /**
   * The items$ represent the carousel items. The items$ are
   * observables so that the items can be loaded on demand.
   */
  items: Observable<any>[];
  @Input('items')
  set setItems(inputItems: Observable<any>[]) {
    this.items = inputItems;
    //Reset slider when changing products
    this.activeSlide = 0;
  }

  /**
   * The template is rendered for each item, so that the actual
   * view can be given by the compoent that uses the `CarouselComponent`.
   */
  @Input() template: TemplateRef<any>;

  /**
   * Specifies the minimum size of the carousel item, either in px or %.
   * This value is used for the calculation of numbers per carousel, so that
   * the number of carousel items is dynamic. The calculation uses the `itemWidth`
   * and the host element `clientWidth`, so that the carousel is reusable in
   * different layouts (for example in a 50% grid).
   */
  @Input() itemWidth = '300px';

  /**
   * Indicates whether the visual indicators are used.
   */
  @Input() hideIndicators = false;

  @Input() indicatorIcon = ICON_TYPE.CIRCLE;
  @Input() previousIcon = ICON_TYPE.CARET_LEFT;
  @Input() nextIcon = ICON_TYPE.CARET_RIGHT;

  activeSlide: number;
  size$: Observable<number>;

  protected logger = inject(LoggerService);
  protected selectFocusUtil = inject(SelectFocusUtility);
  @Optional() protected document = inject(DOCUMENT, {
    optional: true,
  });

  constructor(
    protected el: ElementRef,
    protected service: CarouselService
  ) {
    useFeatureStyles('a11yFocusableCarouselControls');
  }

  ngOnInit() {
    if (!this.template && isDevMode()) {
      this.logger.error(
        'No template reference provided to render the carousel items for the `cx-carousel`'
      );
    }
  }
  ngOnChanges() {
    this.size$ = this.service
      .getItemsPerSlide(this.el.nativeElement, this.itemWidth)
      .pipe(tap(() => (this.activeSlide = 0)));
  }

  onItemKeydown(event: KeyboardEvent, size: number): void {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowLeft':
        event.preventDefault();
        this.focusNextPrevItem(
          event.target,
          event.key === 'ArrowRight' ? 1 : -1,
          size
        );
        break;
      case 'Tab':
        this.handleTab(event);
        break;
    }
  }

  /**
   * Handles "Tab" and "Shift + Tab" keyboard navigation for the carousel component.
   *
   * When the "Tab" key is pressed, this method moves the focus to the next focusable element
   * outside the carousel, following the normal DOM order. When "Shift + Tab" is pressed,
   * it moves the focus to the previous focusable element outside the carousel, following
   * the normal DOM order.
   *
   * The method uses all focusable elements in the DOM and identifies the boundaries of
   * the carousel using elements with the `cxFocusableCarouselItem` directive. This ensures
   * that this "Tab/Shift+Tab" override works only if `cxFocusableCarouselItem` is used
   *
   * @param {KeyboardEvent} event - The keyboard event triggered by the "Tab" or "Shift + Tab" key press.
   */
  protected handleTab(event: KeyboardEvent): void {
    const carouselElements: HTMLElement[] =
      this.el.nativeElement.querySelectorAll('[cxFocusableCarouselItem]');
    if (!carouselElements.length) {
      return;
    }
    const focusableElements = this.selectFocusUtil.findFocusable(
      this.document?.body
    );
    const index = focusableElements.indexOf(
      carouselElements[event.shiftKey ? 0 : carouselElements.length - 1]
    );
    const direction = event.shiftKey ? -1 : 1;
    if (!focusableElements[index + direction]) {
      return;
    }
    event.preventDefault();
    focusableElements[index + direction].focus();
  }

  /**
   * Focuses the next or previous item in the carousel based on keyboard navigation.
   *
   * This method determines the next focusable carousel item, identified by the
   * `cxFocusableCarouselItem` directive, based on the current focus and the direction
   * given. It adjusts the carousel's active slide if the next focusable item is
   * outside the currently visible items.
   *
   * @param currentItem - The currently focused carousel item.
   * @param direction - The navigation direction (1 for right, -1 for left).
   * @param size - The number of items per slide, used to determine slide change is needed
   */
  protected focusNextPrevItem(
    currentItem: EventTarget | null,
    direction: number,
    size: number
  ): void {
    const focusableElements = this.el.nativeElement.querySelectorAll(
      '[cxFocusableCarouselItem]'
    );
    const currentIndex = Array.from(focusableElements).indexOf(currentItem);
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= focusableElements.length) {
      return;
    }

    const targetElement = focusableElements[nextIndex] as HTMLElement;
    const shouldChangeSlide =
      nextIndex < this.activeSlide || nextIndex >= this.activeSlide + size;
    if (shouldChangeSlide) {
      this.activeSlide = nextIndex - (nextIndex % size);
      // After changing slides carousel items has CSS transition,
      // which prevents them from being focused
      targetElement.addEventListener(
        'transitionend',
        () => {
          targetElement.focus();
        },
        { once: true }
      );
    } else {
      targetElement.focus();
    }
  }

  getSlideNumber(size: number, currentIndex: number): number {
    const normalizedCurrentIndex = currentIndex + 1;
    return Math.ceil(normalizedCurrentIndex / size);
  }

  shareEvent(event: KeyboardEvent) {
    if (!event) {
      throw new Error('Missing Event');
    }
    this.keybordEvent.next(event);
  }
}
