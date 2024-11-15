/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DOCUMENT, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ScriptLoader } from '@spartacus/core';

import {
  OpfDynamicScriptResource,
  OpfDynamicScriptResourceType,
} from '../model';

@Injectable({
  providedIn: 'root',
})
export class OpfResourceLoaderService extends ScriptLoader {
  constructor(
    @Inject(DOCUMENT) protected document: any,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {
    super(document, platformId);
  }

  protected readonly OPF_RESOURCE_ATTRIBUTE_KEY = 'data-opf-resource';

  protected embedStyles(embedOptions: {
    src: string;
    callback?: EventListener;
    errorCallback: EventListener;
  }): void {
    const { src, callback, errorCallback } = embedOptions;

    const link: HTMLLinkElement = this.document.createElement('link');
    link.href = src;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.setAttribute(this.OPF_RESOURCE_ATTRIBUTE_KEY, 'true');

    if (callback) {
      link.addEventListener('load', callback);
    }

    if (errorCallback) {
      link.addEventListener('error', errorCallback);
    }

    this.document.head.appendChild(link);
  }

  protected hasStyles(src?: string): boolean {
    return !!this.document.querySelector(`link[href="${src}"]`);
  }

  protected hasScript(src?: string): boolean {
    return super.hasScript(src);
  }

  /**
   * Loads a script specified in the resource object.
   *
   * The returned Promise is resolved when the script is loaded or already present.
   * The returned Promise is rejected when a loading error occurs.
   */
  protected loadScript(resource: OpfDynamicScriptResource): Promise<void> {
    return new Promise((resolve, reject) => {
      const attributes: any = {
        type: 'text/javascript',
        [this.OPF_RESOURCE_ATTRIBUTE_KEY]: true,
      };

      if (resource.attributes) {
        resource.attributes.forEach((attribute) => {
          attributes[attribute.key] = attribute.value;
        });
      }

      if (resource.url && !this.hasScript(resource.url)) {
        super.embedScript({
          src: resource.url,
          attributes: attributes,
          callback: () => resolve(),
          errorCallback: () => reject(),
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Loads a stylesheet specified in the resource object.
   *
   * The returned Promise is resolved when the stylesheet is loaded or already present.
   * The returned Promise is rejected when a loading error occurs.
   */
  protected loadStyles(resource: OpfDynamicScriptResource): Promise<void> {
    return new Promise((resolve, reject) => {
      if (resource.url && !this.hasStyles(resource.url)) {
        this.embedStyles({
          src: resource.url,
          callback: () => resolve(),
          errorCallback: () => reject(),
        });
      } else {
        resolve();
      }
    });
  }

  executeScriptFromHtml(html: string | undefined) {
    // SSR mode not supported for security concerns
    if (!isPlatformServer(this.platformId) && html) {
      const element = new DOMParser().parseFromString(html, 'text/html');
      const script = element.getElementsByTagName('script');
      if (!script?.[0]?.innerText) {
        return;
      }
      Function(script[0].innerText)();
    }
  }

  clearAllProviderResources() {
    this.document
      .querySelectorAll(`[${this.OPF_RESOURCE_ATTRIBUTE_KEY}]`)
      .forEach((resource: undefined | HTMLLinkElement | HTMLScriptElement) => {
        if (resource) {
          resource.remove();
        }
      });
  }

  /**
   * Loads scripts and stylesheets specified in the lists of resource objects (scripts and styles).
   *
   * The returned Promise is resolved when all resources are loaded.
   * The returned Promise is also resolved (not rejected!) immediately when any loading error occurs.
   */
  loadProviderResources(
    scripts: OpfDynamicScriptResource[] = [],
    styles: OpfDynamicScriptResource[] = []
  ): Promise<void> {
    // SSR mode not supported for security concerns
    if (isPlatformServer(this.platformId)) {
      return Promise.resolve();
    }

    const resources: OpfDynamicScriptResource[] = [
      ...scripts.map((script) => ({
        ...script,
        type: OpfDynamicScriptResourceType.SCRIPT,
      })),
      ...styles.map((style) => ({
        ...style,
        type: OpfDynamicScriptResourceType.STYLES,
      })),
    ];

    if (!resources.length) {
      return Promise.resolve();
    }

    const resourcesPromises = resources.map(
      (resource: OpfDynamicScriptResource) => {
        if (!resource.url) {
          return Promise.resolve();
        }

        switch (resource.type) {
          case OpfDynamicScriptResourceType.SCRIPT:
            return this.loadScript(resource);
          case OpfDynamicScriptResourceType.STYLES:
            return this.loadStyles(resource);
          default:
            return Promise.resolve();
        }
      }
    );

    return Promise.all(resourcesPromises)
      .then(() => {})
      .catch(() => {});
  }
}
