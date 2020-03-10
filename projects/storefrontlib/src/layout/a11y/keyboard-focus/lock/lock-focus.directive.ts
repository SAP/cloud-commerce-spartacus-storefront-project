import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { FOCUS_GROUP_ATTR, LockFocusConfig } from '../keyboard-focus.model';
import { TrapFocusDirective } from '../trap/trap-focus.directive';
import { LockFocusService } from './lock-focus.service';

/**
 * Directive that adds persistence for focussed element in case
 * the elements are being rebuild. This happens often when change
 * detection kicks in because of new data set from the backend.
 */
@Directive({
  selector: '[cxLockFocus]',
})
export class LockFocusDirective extends TrapFocusDirective
  implements OnInit, AfterViewInit {
  protected defaultConfig: LockFocusConfig = { lock: true };

  /** configuration options to steer the usage. defaults to true.  */
  @Input('cxLockFocus') protected config: LockFocusConfig = {};

  // @Output() unlock = new EventEmitter<boolean>();

  private hasbeenUnlocked = false;

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  protected handleUnlock = (event: KeyboardEvent) => {
    if (this.isLocked && !this.hasFocusableChilds) {
      // this.unlock.emit(!this.hasbeenUnlocked);
      this.hasbeenUnlocked = true;
      this.addTabindexToChilds(0);
      this.handleFocus(event);
      event.preventDefault();
      event.stopPropagation();
    }
  };

  @HostListener('click', ['$event'])
  protected handleClick(event: KeyboardEvent) {
    if (event.target !== this.host) {
      this.handleUnlock(event);
    }
  }

  constructor(
    protected elementRef: ElementRef,
    protected service: LockFocusService
  ) {
    super(elementRef, service);
  }

  ngOnInit() {
    super.ngOnInit();

    if (this.isLocked) {
      // when the host is configured to be locked, we explicitly make
      // it focusable, if not already
      if (
        this.requiresExplicitTabIndex ||
        !this.currentIndex ||
        this.currentIndex === '-1'
      ) {
        this.tabindex = 0;
      }
      // set autofocus for locked elements, unless set to false
      this.config.autofocus = !(this.config?.autofocus === false);

      // set focusOnEscape for locked elements, unless set to false
      this.config.focusOnEscape = !(this.config?.focusOnEscape === false);
    }
  }

  /**
   * locks the focusable elements by setting the tabIndex to `-1`.
   */
  ngAfterViewInit(): void {
    if (!!this.group) {
      // consider using `this.focusable`
      this.service.findFocusable(this.host).forEach(el => {
        el.setAttribute(FOCUS_GROUP_ATTR, this.group);
      });
    }

    if (this.isLocked) {
      // this is a problem; when the after init kicks in
      // the child components aren't rendered yet
      this.addTabindexToChilds(this.hasPersistedFocus ? 0 : -1);
    }

    if (this.isLocked && this.hasPersistedFocus) {
      this.hasbeenUnlocked = true;
      this.handleFocus(null);
    } else {
      super.ngAfterViewInit();
    }
  }

  /**
   * Locks focus handling in case of a locked experience.
   */
  protected handleFocus(event: KeyboardEvent): void {
    if (this.isLocked && !this.hasbeenUnlocked) {
      this.addTabindexToChilds(-1);
    } else {
      super.handleFocus(event);
      this.hasbeenUnlocked = false;
    }
  }

  /**
   * Indicates that the host element is locked for keyboarding.
   */
  protected get isLocked(): boolean {
    return this.config?.lock;
  }

  /**
   * Add the tabindex attribute to the references.
   * TODO: consider renaming!
   *
   * @param index the tabindex that is added to the references, defaults to 0.
   */
  protected addTabindexToChilds(index = 0): void {
    if (!(this.hasFocusableChilds && index === 0) || index === 0) {
      this.focusable.forEach(el =>
        el.setAttribute('tabindex', index.toString())
      );
    }
  }

  /**
   * Utility method, returns all focusable childs for the host element.
   * We keep this private to not polute the API.
   */
  private get hasFocusableChilds(): boolean {
    return this.service.hasFocusableChilds(this.host);
  }

  /**
   * Returns the focusable childs of the host element. If the host element
   * is configured to be locked, the query is restricted to child elements
   * with a tabindex !== `-1`.
   *
   * We keep this private to not polute the API.
   */
  private get focusable(): HTMLElement[] {
    return this.service.findFocusable(this.host, this.isLocked);
  }
}
