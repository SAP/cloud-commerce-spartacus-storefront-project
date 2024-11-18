/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DOCUMENT, isPlatformServer } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { ScriptLoader } from '@spartacus/core';

import {
  OpfDynamicScriptResource,
  OpfDynamicScriptResourceType,
} from '../model';

@Injectable({
  providedIn: 'root',
})
export class OpfResourceLoaderService {
  protected scriptLoader = inject(ScriptLoader);
  protected document = inject(DOCUMENT);
  protected platformId = inject(PLATFORM_ID);

  protected readonly OPF_RESOURCE_ATTRIBUTE_KEY = 'data-opf-resource';

  protected loadedResources: OpfDynamicScriptResource[] = [];

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

  protected handleLoadingResourceError(
    resolve: (value: void | PromiseLike<void>) => void
  ) {
    resolve();
  }

  protected isResourceLoadingCompleted(resources: OpfDynamicScriptResource[]) {
    return resources.length === this.loadedResources.length;
  }

  protected markResourceAsLoaded(
    resource: OpfDynamicScriptResource,
    resources: OpfDynamicScriptResource[],
    resolve: (value: void | PromiseLike<void>) => void
  ) {
    this.loadedResources.push(resource);
    if (this.isResourceLoadingCompleted(resources)) {
      resolve();
    }
  }

  protected loadScript(
    resource: OpfDynamicScriptResource,
    resources: OpfDynamicScriptResource[],
    resolve: (value: void | PromiseLike<void>) => void
  ) {
    const attributes: any = {
      type: 'text/javascript',
      [this.OPF_RESOURCE_ATTRIBUTE_KEY]: true,
    };

    if (resource.attributes) {
      resource.attributes.forEach((attribute) => {
        attributes[attribute.key] = attribute.value;
      });
    }

    if (resource.url && !this.scriptLoader.hasScript(resource.url)) {
      this.scriptLoader.embedScript({
        src: resource.url,
        attributes: attributes,
        callback: () => {
          this.markResourceAsLoaded(resource, resources, resolve);
        },
        errorCallback: () => {
          this.handleLoadingResourceError(resolve);
        },
      });
    } else {
      this.markResourceAsLoaded(resource, resources, resolve);
    }
  }

  protected loadStyles(
    resource: OpfDynamicScriptResource,
    resources: OpfDynamicScriptResource[],
    resolve: (value: void | PromiseLike<void>) => void
  ) {
    if (resource.url && !this.hasStyles(resource.url)) {
      this.embedStyles({
        src: resource.url,
        callback: () => this.markResourceAsLoaded(resource, resources, resolve),
        errorCallback: () => {
          this.handleLoadingResourceError(resolve);
        },
      });
    } else {
      this.markResourceAsLoaded(resource, resources, resolve);
    }
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

  clearAllResources() {
    this.document
      .querySelectorAll(`[${this.OPF_RESOURCE_ATTRIBUTE_KEY}]`)
      .forEach((resource: undefined | HTMLLinkElement | HTMLScriptElement) => {
        if (resource) {
          resource.remove();
        }
      });
  }

  loadResources(
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
    return new Promise((resolve) => {
      this.loadedResources = [];

      resources.forEach((resource: OpfDynamicScriptResource) => {
        if (!resource.url) {
          this.markResourceAsLoaded(resource, resources, resolve);
        } else {
          switch (resource.type) {
            case OpfDynamicScriptResourceType.SCRIPT:
              this.loadScript(resource, resources, resolve);
              break;
            case OpfDynamicScriptResourceType.STYLES:
              this.loadStyles(resource, resources, resolve);
              break;
            default:
              break;
          }
        }
      });
    });
  }
}
