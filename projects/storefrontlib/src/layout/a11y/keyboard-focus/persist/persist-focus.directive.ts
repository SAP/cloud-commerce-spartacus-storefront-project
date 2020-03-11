import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { BlockFocusDirective } from '../block/block-focus.directive';
import { FOCUS_ATTR, PersistFocusConfig } from '../keyboard-focus.model';
import { PersistFocusService } from './persist-focus.service';

/**
 * Directive that provides persistence of the focused state. This is useful
 * when a group of focusable elements got refocused or even recreated. That
 * happens often when the DOM is constructed with an `*ngIf` or `*ngFor`.
 *
 * The focus state is based on a configured _key_, which can be passed in the
 * config input, either by using a string primitive or `PersistFocusConfig.key`:
 *
 * ```html
 * <button cxPersistFocus="myKey"></button>
 * <button cxFocus="myKey"></button>
 * <button [cxFocus]="{{key:'myKey'}"></button>
 * ```
 *
 * The focus state can be part of a focus _group_, so that the state is shared
 * and remember for the given group. In order to detect the persistence for a
 * given element, we store the persistence key as a data attribute (`data-cx-focus`):
 *
 * ```html
 * <button data-cx-focus="myKey"></button>
 * ```
 *
 * Other keyboard focus directives can read the key to understand whether the element
 * should retrieve focus.
 *
 */
@Directive({
  selector: '[cxPersistFocus]',
})
export class PersistFocusDirective extends BlockFocusDirective
  implements OnInit, AfterViewInit {
  protected defaultConfig: PersistFocusConfig = {};

  /**
   * The persistence key can be passed directly or through the `FocusConfig.key`.
   * While this could be considered a global key, the likeliness of conflicts
   * is very small since the key is cleared when the focus is changed.
   */
  @Input('cxPersistFocus') protected config: PersistFocusConfig = {};

  /**
   * The persistance key is maintained in an element attribute for other
   * implementations. This is needed to ensure that we can resolve the focus
   * state in case of a repaint.
   */
  @HostBinding(`attr.${FOCUS_ATTR}`) protected attr: string;

  /**
   * The persistence key is maintained in a singleton cross the app to ensure we
   * can reset the focus if the DOM gets rebuild.
   */

  @HostListener('focus', ['$event'])
  protected handleFocus(event?: KeyboardEvent) {
    if (this.key) {
      this.persistFocusService.set(this.key, this.group);
    }

    event?.preventDefault();
    event?.stopPropagation();
  }

  constructor(
    protected elementRef: ElementRef,
    protected persistFocusService: PersistFocusService
  ) {
    super(elementRef, persistFocusService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.attr = this.key ? this.key : undefined;
  }

  protected setDefaultConfiguration() {
    if (typeof this.config === 'string' && this.config !== '') {
      this.config = { key: this.config };
    }
    super.setDefaultConfiguration();
  }

  /**
   * Focus the element explicitly if it was focused before.
   */
  ngAfterViewInit() {
    if (this.isPersisted) {
      this.host.focus({ preventScroll: true });
    }
  }

  protected get isPersisted(): boolean {
    return !!this.key && this.persistFocusService.get(this.group) === this.key;
  }

  /**
   * Returns the key for the host element, which is used to persist the
   * focus state. This is useful in cases where the DOM is rebuild.
   */
  protected get key(): string {
    return (this.config as PersistFocusConfig)?.key;
  }

  /**
   * returns the persistence group (if any) for the focusable elements.
   */
  protected get group(): string {
    return this.persistFocusService.getPersistenceGroup(
      this.host,
      this.config as PersistFocusConfig
    );
  }
}
