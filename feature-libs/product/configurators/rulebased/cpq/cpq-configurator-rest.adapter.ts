import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CartModification,
  ConverterService,
  GenericConfigurator,
  OccEndpointsService,
} from '@spartacus/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RulebasedConfiguratorAdapter } from '../core/connectors/rulebased-configurator.adapter';
import { Configurator } from '../core/model/configurator.model';
import { CpqAccessLoaderService } from '../occ/cpq/cpq-access-loader.service';

@Injectable()
export class CpqConfiguratorRestAdapter
  implements RulebasedConfiguratorAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpointsService: OccEndpointsService,
    protected converterService: ConverterService,
    protected cpqAccessLoaderService: CpqAccessLoaderService
  ) {}

  getConfiguratorType(): string {
    return 'CLOUDCPQCONFIGURATOR';
  }

  createConfiguration(
    owner: GenericConfigurator.Owner
  ): Observable<Configurator.Configuration> {
    return this.cpqAccessLoaderService.getCpqAccessData().pipe(
      map((accessData) => {
        const config: Configurator.Configuration = {
          configId: accessData.accessToken,
          owner: owner,
        };
        return config;
      })
    );
  }

  readConfiguration(): Observable<Configurator.Configuration> {
    return undefined;
  }

  updateConfiguration(): Observable<Configurator.Configuration> {
    return undefined;
  }

  addToCart(): Observable<CartModification> {
    return undefined;
  }

  readConfigurationForCartEntry(): Observable<Configurator.Configuration> {
    return undefined;
  }

  updateConfigurationForCartEntry(): Observable<CartModification> {
    return undefined;
  }

  readConfigurationForOrderEntry(): Observable<Configurator.Configuration> {
    return undefined;
  }

  readPriceSummary(): Observable<Configurator.Configuration> {
    return undefined;
  }

  getConfigurationOverview(): Observable<Configurator.Overview> {
    return undefined;
  }
}
