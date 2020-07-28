import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CART_MODIFICATION_NORMALIZER } from '../../../../cart/connectors/entry/converters';
import { ConfiguratorCommonsAdapter } from '../../../../configurator/commons/connectors/configurator-commons.adapter';
import {
  CONFIGURATION_ADD_TO_CART_SERIALIZER,
  CONFIGURATION_NORMALIZER,
  CONFIGURATION_OVERVIEW_NORMALIZER,
  CONFIGURATION_PRICE_SUMMARY_NORMALIZER,
  CONFIGURATION_SERIALIZER,
  CONFIGURATION_UPDATE_CART_ENTRY_SERIALIZER,
} from '../../../../configurator/commons/connectors/converters';
import { CartModification } from '../../../../model/cart.model';
import { GenericConfigurator } from '../../../../model/generic-configurator.model';
import { ConverterService } from '../../../../util/converter.service';
import { OccEndpointsService } from '../../../services/occ-endpoints.service';
import { Configurator } from './../../../../model/configurator.model';
import { OccConfigurator } from './occ-configurator.models';

@Injectable()
export class OccConfiguratorVariantAdapter
  implements ConfiguratorCommonsAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpointsService: OccEndpointsService,
    protected converterService: ConverterService
  ) {}

  createConfiguration(
    owner: GenericConfigurator.Owner
  ): Observable<Configurator.Configuration> {
    const productCode = owner.id;
    return this.http
      .get<OccConfigurator.Configuration>(
        this.occEndpointsService.getUrl('createConfiguration', { productCode })
      )
      .pipe(
        this.converterService.pipeable(CONFIGURATION_NORMALIZER),
        map((resultConfiguration) => {
          return {
            ...resultConfiguration,
            owner: owner,
          };
        })
      );
  }

  readConfiguration(
    configId: string,
    groupId: string,
    configurationOwner: GenericConfigurator.Owner
  ): Observable<Configurator.Configuration> {
    return this.http
      .get<OccConfigurator.Configuration>(
        this.occEndpointsService.getUrl(
          'readConfiguration',
          { configId },
          { groupId: groupId }
        )
      )
      .pipe(
        this.converterService.pipeable(CONFIGURATION_NORMALIZER),
        map((resultConfiguration) => {
          return {
            ...resultConfiguration,
            owner: configurationOwner,
          };
        })
      );
  }

  updateConfiguration(
    configuration: Configurator.Configuration
  ): Observable<Configurator.Configuration> {
    const configId = configuration.configId;
    const url = this.occEndpointsService.getUrl('updateConfiguration', {
      configId,
    });
    const occConfiguration = this.converterService.convert(
      configuration,
      CONFIGURATION_SERIALIZER
    );

    return this.http.patch(url, occConfiguration).pipe(
      this.converterService.pipeable(CONFIGURATION_NORMALIZER),
      map((resultConfiguration) => {
        return {
          ...resultConfiguration,
          owner: configuration.owner,
        };
      })
    );
  }

  addToCart(
    parameters: Configurator.AddToCartParameters
  ): Observable<CartModification> {
    const url = this.occEndpointsService.getUrl('addConfigurationToCart', {
      userId: parameters.userId,
      cartId: parameters.cartId,
    });

    const occAddToCartParameters = this.converterService.convert(
      parameters,
      CONFIGURATION_ADD_TO_CART_SERIALIZER
    );

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<CartModification>(url, occAddToCartParameters, { headers })
      .pipe(this.converterService.pipeable(CART_MODIFICATION_NORMALIZER));
  }

  readConfigurationForCartEntry(
    parameters: GenericConfigurator.ReadConfigurationFromCartEntryParameters
  ): Observable<Configurator.Configuration> {
    const url = this.occEndpointsService.getUrl(
      'readConfigurationForCartEntry',
      {
        userId: parameters.userId,
        cartId: parameters.cartId,
        cartEntryNumber: parameters.cartEntryNumber,
      }
    );

    return this.http.get<Configurator.Configuration>(url).pipe(
      this.converterService.pipeable(CONFIGURATION_NORMALIZER),
      map((resultConfiguration) => {
        return {
          ...resultConfiguration,
          owner: parameters.owner,
        };
      })
    );
  }

  updateConfigurationForCartEntry(
    parameters: Configurator.UpdateConfigurationForCartEntryParameters
  ): Observable<CartModification> {
    const url = this.occEndpointsService.getUrl(
      'updateConfigurationForCartEntry',
      {
        userId: parameters.userId,
        cartId: parameters.cartId,
        cartEntryNumber: parameters.cartEntryNumber,
      }
    );

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const occUpdateCartEntryParameters = this.converterService.convert(
      parameters,
      CONFIGURATION_UPDATE_CART_ENTRY_SERIALIZER
    );

    return this.http
      .put<CartModification>(url, occUpdateCartEntryParameters, { headers })
      .pipe(this.converterService.pipeable(CART_MODIFICATION_NORMALIZER));
  }

  readConfigurationForOrderEntry(
    parameters: GenericConfigurator.ReadConfigurationFromOrderEntryParameters
  ): Observable<Configurator.Configuration> {
    const url = this.occEndpointsService.getUrl(
      'readConfigurationOverviewForOrderEntry',
      {
        userId: parameters.userId,
        orderId: parameters.orderId,
        orderEntryNumber: parameters.orderEntryNumber,
      }
    );

    return this.http.get<Configurator.Overview>(url).pipe(
      this.converterService.pipeable(CONFIGURATION_OVERVIEW_NORMALIZER),
      map((overview) => {
        const configuration: Configurator.Configuration = {
          configId: overview.configId,
          overview: overview,
        };
        return configuration;
      }),
      map((resultConfiguration) => {
        return {
          ...resultConfiguration,
          owner: parameters.owner,
        };
      })
    );
  }

  readPriceSummary(
    configuration: Configurator.Configuration
  ): Observable<Configurator.Configuration> {
    const url = this.occEndpointsService.getUrl('readPriceSummary', {
      configId: configuration.configId,
    });

    return this.http.get(url).pipe(
      this.converterService.pipeable(CONFIGURATION_PRICE_SUMMARY_NORMALIZER),
      map((pricingResult) => {
        const result: Configurator.Configuration = {
          configId: configuration.configId,
          priceSummary: pricingResult,
        };
        return result;
      }),
      map((resultConfiguration) => {
        return {
          ...resultConfiguration,
          owner: configuration.owner,
        };
      })
    );
  }
  getConfigurationOverview(
    configId: string
  ): Observable<Configurator.Overview> {
    const url = this.occEndpointsService.getUrl('getConfigurationOverview', {
      configId,
    });

    return this.http
      .get(url)
      .pipe(this.converterService.pipeable(CONFIGURATION_OVERVIEW_NORMALIZER));
  }
}
