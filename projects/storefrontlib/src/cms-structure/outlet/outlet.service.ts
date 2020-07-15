import { Injectable, TemplateRef } from '@angular/core';
import { FeatureConfigService } from '@spartacus/core';
import { AVOID_STACKED_OUTLETS, OutletPosition } from './outlet.model';

@Injectable({
  providedIn: 'root',
})
export class OutletService<T = TemplateRef<any>> {
  /**
   * @deprecated since 2.1, see #8116
   */
  constructor();
  // tslint:disable-next-line: unified-signatures
  constructor(features: FeatureConfigService);
  constructor(protected features?: FeatureConfigService) {}

  private templatesRefs = new Map<string, T[]>();
  private templatesRefsBefore = new Map<string, T[]>();
  private templatesRefsAfter = new Map<string, T[]>();

  /**
   * Adds a template or ComponentFactory, so that UI outlets can be replaced dynamically.
   * The UI position where this template or ComponentFactory is inserted is given by a
   * string reference (called `outlet`) and optional `OutletPosition`. The `OutletPosition`
   * is either before or after, or replaces the entire UI.
   *
   * @param outlet the UI location represented by a string
   * @param template the `TemplateRef` that will be used to insert UI
   * @param position the `OutletPosition` in the UI
   */
  add(outlet: string, template: T, position?: OutletPosition): void;
  /**
   * @param factory The `ComponentFactory` that will be dynamically added to the outlet UI
   */
  add(
    outlet: string,
    // tslint:disable-next-line: unified-signatures
    factory: T,
    position?: OutletPosition
  ): void;
  /**
   * @param templateOrFactory A `ComponentFactory` that inserts a component dynamically.
   */
  add(
    outlet: string,
    templateOrFactory: T,
    position: OutletPosition = OutletPosition.REPLACE
  ): void {
    if (position === OutletPosition.BEFORE) {
      this.store(this.templatesRefsBefore, outlet, templateOrFactory);
    }
    if (position === OutletPosition.REPLACE) {
      this.store(this.templatesRefs, outlet, templateOrFactory);
    }
    if (position === OutletPosition.AFTER) {
      this.store(this.templatesRefsAfter, outlet, templateOrFactory);
    }
  }

  /**
   *
   * Returns a single object or multiple objects for the given outlet reference,
   * depending on the `stacked` argument.
   *
   * @param outlet The outlet reference
   * @param position the outlet position, `OutletPosition.before`, `OutletPosition.AFTER` or `OutletPosition.REPLACE`
   * @param stacked Indicates whether an array of outlet components is returned
   */
  get(
    outlet: string,
    position: OutletPosition = OutletPosition.REPLACE,
    stacked = AVOID_STACKED_OUTLETS
  ): T[] | T {
    let templateRef: T[];
    switch (position) {
      case OutletPosition.BEFORE:
        templateRef = this.templatesRefsBefore.get(outlet);
        break;
      case OutletPosition.AFTER:
        templateRef = this.templatesRefsAfter.get(outlet);
        break;
      default:
        templateRef = this.templatesRefs.get(outlet);
    }
    if (templateRef && !stacked) {
      return templateRef[0];
    }
    return templateRef;
  }

  remove(
    outlet: string,
    position: OutletPosition = OutletPosition.REPLACE,
    value?: T
  ): void {
    switch (position) {
      case OutletPosition.BEFORE:
        this.removeValueOrAll(this.templatesRefsBefore, outlet, value);
        break;
      case OutletPosition.AFTER:
        this.removeValueOrAll(this.templatesRefsAfter, outlet, value);
        break;
      default:
        this.removeValueOrAll(this.templatesRefs, outlet, value);
    }
  }

  private store(store: Map<string, T[]>, outlet: string, value: T) {
    const existing = store.get(outlet) || [];
    const newValue: T[] = existing.concat([value]);
    store.set(outlet, newValue);
  }

  protected removeValueOrAll(
    store: Map<string, T[]>,
    outlet: string,
    value?: T
  ): void {
    if (!value && store.has(outlet)) {
      store.delete(outlet);
    } else if (value && store.has(outlet)) {
      let existing = store.get(outlet);

      if (this.features?.isLevel('2.1')) {
        existing = existing.filter((val) => val !== value);
      } else {
        // deprecated since 2.1, see #8116:
        existing = existing.filter((val) => val === value);
      }

      store.set(outlet, existing);
    }
  }
}
