import { Injectable } from '@angular/core';
import { RouteConfig } from './routes-config';
import { RoutingConfig } from './config/routing-config';

@Injectable({ providedIn: 'root' })
export class RoutingConfigService {
  constructor(private config: RoutingConfig) {}

  getRouteConfig(routeName: string): RouteConfig {
    const routeConfig =
      this.config && this.config.routing && this.config.routing.routes;

    const result = routeConfig && routeConfig[routeName];
    if (!routeConfig || result === undefined) {
      this.warn(`No path was configured for the named route '${routeName}'!`);
    }
    return result;
  }

  private warn(...args) {
    if (!this.config.production) {
      console.warn(...args);
    }
  }
}
