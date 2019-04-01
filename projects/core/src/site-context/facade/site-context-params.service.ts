import { Injectable, Injector } from '@angular/core';
import {
  ContextParamPersistence,
  SiteContextConfig,
} from '../config/site-context-config';
import { SiteContext } from '../facade/site-context.interface';
import { ContextServiceMap } from '../providers/context-service-map';

@Injectable()
export class SiteContextParamsService {
  constructor(
    private config: SiteContextConfig,
    private injector: Injector,
    private serviceMap: ContextServiceMap
  ) {}

  getContextParameters(persistence?: ContextParamPersistence): string[] {
    const contextConfig = this.config.siteContext.parameters;
    if (contextConfig) {
      const params = Object.keys(contextConfig);
      if (persistence) {
        return params.filter(
          key => contextConfig[key].persistence === persistence
        );
      } else {
        return params;
      }
    }
    return [];
  }

  getParamValues(param: string): string[] {
    return this.config.siteContext.parameters &&
      this.config.siteContext.parameters[param]
      ? this.config.siteContext.parameters[param].values
      : undefined;
  }

  getParamDefaultValue(param: string): string {
    return this.config.siteContext.parameters &&
      this.config.siteContext.parameters[param]
      ? this.config.siteContext.parameters[param].defaultValue
      : undefined;
  }

  getSiteContextService(param: string): SiteContext<any> {
    if (this.serviceMap[param]) {
      return this.injector.get<SiteContext<any>>(this.serviceMap[param], null);
    }
  }

  getValue(param: string): string {
    let value: string;

    const service = this.getSiteContextService(param);
    if (service) {
      service
        .getActive()
        .subscribe(val => (value = val))
        .unsubscribe();
    }

    return value !== undefined ? value : this.getParamDefaultValue(param);
  }

  setValue(param: string, value: string) {
    const service = this.getSiteContextService(param);
    if (service) {
      service.setActive(value);
    }
  }
}
