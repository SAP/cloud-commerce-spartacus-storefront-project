import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeliveryMode, RoutingConfigService } from '@spartacus/core';
import {
  CheckoutConfig,
  DeliveryModePreferences,
} from '../config/checkout-config';
import { CheckoutStep, CheckoutStepType } from '../model/checkout-step.model';

@Injectable({
  providedIn: 'root',
})
export class CheckoutConfigService {
  steps: CheckoutStep[] = this.checkoutConfig.checkout.steps;
  express: boolean = this.checkoutConfig.checkout.express;
  defaultDeliveryMode: Array<DeliveryModePreferences | string> =
    this.checkoutConfig.checkout.defaultDeliveryMode || [];

  constructor(
    private checkoutConfig: CheckoutConfig,
    private routingConfigService: RoutingConfigService
  ) {}

  getCheckoutStep(currentStepType: CheckoutStepType): CheckoutStep {
    return this.steps[this.getCheckoutStepIndex('type', currentStepType)];
  }

  getNextCheckoutStepUrl(activatedRoute: ActivatedRoute): string {
    const stepIndex = this.getCurrentStepIndex(activatedRoute);

    return stepIndex >= 0 && this.steps[stepIndex + 1]
      ? this.getStepUrlFromStepRoute(this.steps[stepIndex + 1].routeName)
      : null;
  }

  getPreviousCheckoutStepUrl(activatedRoute: ActivatedRoute): string {
    const stepIndex = this.getCurrentStepIndex(activatedRoute);

    return stepIndex >= 0 && this.steps[stepIndex - 1]
      ? this.getStepUrlFromStepRoute(this.steps[stepIndex - 1].routeName)
      : null;
  }

  getCurrentStepIndex(activatedRoute: ActivatedRoute) {
    const currentStepUrl: string = this.getStepUrlFromActivatedRoute(
      activatedRoute
    );

    let stepIndex: number;
    let index = 0;
    for (const step of this.steps) {
      if (
        currentStepUrl === `/${this.getStepUrlFromStepRoute(step.routeName)}`
      ) {
        stepIndex = index;
      } else {
        index++;
      }
    }

    return stepIndex >= 0 ? stepIndex : null;
  }

  protected compareDeliveryCost(deliveryMode1, deliveryMode2) {
    if (deliveryMode1.deliveryCost > deliveryMode2.deliveryCost) {
      return 1;
    } else if (deliveryMode1.deliveryCost < deliveryMode2.deliveryCost) {
      return -1;
    }
  }

  protected findMatchingDeliveryMode(deliveryModes: DeliveryMode[], index = 0) {
    switch (this.defaultDeliveryMode[index]) {
      case DeliveryModePreferences.FREE:
        if (deliveryModes[0].deliveryCost === 0) {
          return deliveryModes[0].code;
        }
        break;
      case DeliveryModePreferences.LEAST_EXPENSIVE:
        const leastExpensiveFound = deliveryModes.find(
          deliveryMode => deliveryMode.deliveryCost !== 0
        );
        if (leastExpensiveFound) {
          return leastExpensiveFound.code;
        }
        break;
      case DeliveryModePreferences.MOST_EXPENSIVE:
        return deliveryModes[deliveryModes.length - 1].code;
      default:
        const codeFound = deliveryModes.find(
          deliveryMode => deliveryMode.code === this.defaultDeliveryMode[index]
        );
        if (codeFound) {
          return codeFound.code;
        }
    }
    const lastMode = this.defaultDeliveryMode.length - 1 === index;
    return lastMode
      ? deliveryModes[0].code
      : this.findMatchingDeliveryMode(deliveryModes, index + 1);
  }

  getPreferredDeliveryMode(deliveryModes: DeliveryMode[]) {
    deliveryModes.sort(this.compareDeliveryCost);
    return this.findMatchingDeliveryMode(deliveryModes);
  }

  private getStepUrlFromActivatedRoute(activatedRoute: ActivatedRoute) {
    return activatedRoute &&
      activatedRoute.snapshot &&
      activatedRoute.snapshot.url
      ? `/${activatedRoute.snapshot.url.join('/')}`
      : null;
  }

  private getStepUrlFromStepRoute(stepRoute: string) {
    return this.routingConfigService.getRouteConfig(stepRoute).paths[0];
  }

  private getCheckoutStepIndex(key: string, value: any): number {
    return key && value
      ? this.steps.findIndex((step: CheckoutStep) => step[key].includes(value))
      : null;
  }
}
