import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConverterService } from '@spartacus/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Configurator } from '../core/model/configurator.model';
import { CPQ_CONFIGURATOR_VIRTUAL_ENDPOINT } from '../root/interceptor/cpq-configurator-rest.interceptor';
import {
  CPQ_CONFIGURATOR_NORMALIZER,
  CPQ_CONFIGURATOR_OVERVIEW_NORMALIZER,
  CPQ_CONFIGURATOR_QUANTITY_SERIALIZER,
  CPQ_CONFIGURATOR_SERIALIZER,
} from './cpq-configurator.converters';
import { Cpq } from './cpq.models';

@Injectable({ providedIn: 'root' })
export class CpqConfiguratorRestService {
  constructor(
    protected http: HttpClient,
    protected converterService: ConverterService
  ) {}

  /**
   * Will create a new runtime configuration for the given product id
   * and read this default configuration from the CPQ system.
   */
  createConfiguration(
    productSystemId: string
  ): Observable<Configurator.Configuration> {
    return this.callConfigurationInit(productSystemId).pipe(
      switchMap((configCreatedResponse) => {
        return this.callConfigurationDisplay(
          configCreatedResponse.configurationId
        ).pipe(
          this.converterService.pipeable(CPQ_CONFIGURATOR_NORMALIZER),
          map((resultConfiguration) => {
            return {
              ...resultConfiguration,
              configId: configCreatedResponse.configurationId,
            };
          })
        );
      })
    );
  }

  readConfiguration(
    configId: string,
    tabId?: string
  ): Observable<Configurator.Configuration> {
    return this.callConfigurationDisplay(configId, tabId).pipe(
      this.converterService.pipeable(CPQ_CONFIGURATOR_NORMALIZER),
      map((resultConfiguration) => {
        return {
          ...resultConfiguration,
          configId: configId,
        };
      })
    );
  }

  readConfigurationOverview(
    configId: string
  ): Observable<Configurator.Overview> {
    return this.getConfigurationWithAllTabsAndAttribues(configId).pipe(
      this.converterService.pipeable(CPQ_CONFIGURATOR_OVERVIEW_NORMALIZER),
      map((resultConfiguration) => {
        return {
          ...resultConfiguration,
          configId: configId,
        };
      })
    );
  }

  /**
   * This method is actually a workarround until CPQ provides and API to fetch
   * all selected attributes / attribue values grouped by all tabs.
   * It will fire a request for each tab to collect all required data.
   */
  protected getConfigurationWithAllTabsAndAttribues(
    configId: string
  ): Observable<Cpq.Configuration> {
    return this.callConfigurationDisplay(configId).pipe(
      switchMap((currentTab) => {
        // prepare requests for remaining tabs
        const tabRequests: Observable<Cpq.Configuration>[] = [];
        currentTab.tabs.forEach((tab) => {
          if (tab.isSelected) {
            // details of the currently selected tab are already fetched
            tabRequests.push(of(currentTab));
          } else {
            tabRequests.push(
              this.callConfigurationDisplay(configId, tab.id.toString())
            );
          }
        });

        // fire requests for remaining tabs and wait until all are finished
        return forkJoin(tabRequests);
      }),
      map(this.mergeTabResults)
    );
  }

  protected mergeTabResults(
    tabReqResultList: Cpq.Configuration[]
  ): Cpq.Configuration {
    const ovConfig = {
      ...tabReqResultList[0],
    };
    ovConfig.attributes = undefined;
    ovConfig.tabs = [];

    tabReqResultList.forEach((tabReqResult) => {
      const currentTab = tabReqResult.tabs.find((tab) => tab.isSelected);
      const ovTab = {
        ...currentTab,
      };
      ovTab.attributes = tabReqResult.attributes;
      ovConfig.tabs.push(ovTab);
    });
    return ovConfig;
  }

  /**
   * Will update an attribute of the runtime configuration for the given configuration id and attribute code
   * and read this default configuration from the CPQ system.
   */
  updateAttribute(
    configuration: Configurator.Configuration
  ): Observable<Configurator.Configuration> {
    const updateAttribute: Cpq.UpdateAttribute = this.converterService.convert(
      configuration,
      CPQ_CONFIGURATOR_SERIALIZER
    );
    return this.callUpdateAttribute(updateAttribute).pipe(
      switchMap(() => {
        return this.callConfigurationDisplay(configuration.configId).pipe(
          this.converterService.pipeable(CPQ_CONFIGURATOR_NORMALIZER),
          map((resultConfiguration) => {
            return {
              ...resultConfiguration,
              configId: configuration.configId,
            };
          })
        );
      })
    );
  }

  /**
   * Will update an attribute of the runtime configuration for the given configuration id and attribute code
   * and read this default configuration from the CPQ system.
   */
  updateValueQuantity(
    configuration: Configurator.Configuration
  ): Observable<Configurator.Configuration> {
    const updateValue: Cpq.UpdateValue = this.converterService.convert(
      configuration,
      CPQ_CONFIGURATOR_QUANTITY_SERIALIZER
    );
    return this.callUpdateValue(updateValue).pipe(
      switchMap(() => {
        return this.callConfigurationDisplay(configuration.configId).pipe(
          this.converterService.pipeable(CPQ_CONFIGURATOR_NORMALIZER),
          map((resultConfiguration) => {
            return {
              ...resultConfiguration,
              configId: configuration.configId,
            };
          })
        );
      })
    );
  }

  callUpdateValue(updateValue: Cpq.UpdateValue): Observable<any> {
    return this.http.patch<Cpq.ConfigurationCreatedResponseData>(
      `${CPQ_CONFIGURATOR_VIRTUAL_ENDPOINT}/api/configuration/v1/configurations/${updateValue.configurationId}/attributes/${updateValue.standardAttributeCode}/attributeValues/${updateValue.attributeValueId}`,
      {
        Quantity: updateValue.quantity,
      }
    );
  }

  protected callConfigurationInit(
    productSystemId: string
  ): Observable<Cpq.ConfigurationCreatedResponseData> {
    return this.http.post<Cpq.ConfigurationCreatedResponseData>(
      `${CPQ_CONFIGURATOR_VIRTUAL_ENDPOINT}/api/configuration/v1/configurations`,
      {
        ProductSystemId: productSystemId,
      }
    );
  }

  protected callConfigurationDisplay(
    configId: string,
    tabId?: string
  ): Observable<Cpq.Configuration> {
    let url = `${CPQ_CONFIGURATOR_VIRTUAL_ENDPOINT}/api/configuration/v1/configurations/${configId}/display`;
    if (tabId) {
      url += `?tabId=${tabId}`;
    }
    return this.http.get<Cpq.Configuration>(url);
  }

  protected callUpdateAttribute(
    updateAttribute: Cpq.UpdateAttribute
  ): Observable<any> {
    return this.http.patch<any>(
      `${CPQ_CONFIGURATOR_VIRTUAL_ENDPOINT}/api/configuration/v1/configurations/${updateAttribute.configurationId}/attributes/${updateAttribute.standardAttributeCode}`,
      updateAttribute.changeAttributeValue
    );
  }
}
