import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  CmsComponentMapping,
  CmsConfig,
  DeferLoadingStrategy,
} from '@spartacus/core';
import { Route } from '@angular/router';
import { isPlatformServer } from '@angular/common';
import { Observable, of } from 'rxjs';

/**
 * Please don't put that service in public API.
 * */
@Injectable({
  providedIn: 'root',
})
export class CmsComponentsService {
  private missingComponents: string[] = [];

  constructor(
    private config: CmsConfig,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Should be called to make sure all component mappings are properly resolved
   */
  resolve(componentTypes: string[]): Observable<string[]> {
    return of(componentTypes);
  }

  /**
   * Return collection of component mapping configuration for specified list of
   * component types
   */
  getMapping(componentType: string): CmsComponentMapping {
    const componentConfig = this.config.cmsComponents?.[componentType];

    if (!componentConfig) {
      if (!this.missingComponents.includes(componentType)) {
        this.missingComponents.push(componentType);
        console.warn(
          `No component implementation found for the CMS component type '${componentType}'.\n`,
          `Make sure you implement a component and register it in the mapper.`
        );
      }
    }

    return componentConfig;
  }

  /**
   * Checks, if component should be rendered as some components
   * could be disabled for server side renderings
   */
  shouldRender(componentType: string): boolean {
    const isSSR = isPlatformServer(this.platformId);
    return !(isSSR && this.getMapping(componentType)?.disableSSR);
  }

  /**
   * Return DeferLoadingStrategy for component type.
   */
  getDeferLoadingStrategy(componentType: string): DeferLoadingStrategy {
    return this.config.cmsComponents?.[componentType]?.deferLoading;
  }

  /**
   * Get cms driven child routes for components
   */
  getChildRoutes(componentTypes: string[]): Route[] {
    const routes = [];
    for (const componentType of componentTypes) {
      if (this.shouldRender(componentType)) {
        routes.push(...(this.getMapping(componentType)?.childRoutes ?? []));
      }
    }
    return routes;
  }

  /**
   * Get cms driven guards for components
   */
  getGuards(componentTypes: string[]): any[] {
    const guards = new Set<any>();
    for (const componentType of componentTypes) {
      this.getMapping(componentType)?.guards?.forEach((guard) =>
        guards.add(guard)
      );
    }
    return Array.from(guards);
  }

  /**
   * Get i18n keys associated with components
   */
  getI18nKeys(componentTypes: string[]): string[] {
    const i18nKeys = new Set<string>();
    for (const componentType of componentTypes) {
      if (this.shouldRender(componentType)) {
        this.getMapping(componentType)?.i18nKeys?.forEach((key) =>
          i18nKeys.add(key)
        );
      }
    }
    return Array.from(i18nKeys);
  }
}
