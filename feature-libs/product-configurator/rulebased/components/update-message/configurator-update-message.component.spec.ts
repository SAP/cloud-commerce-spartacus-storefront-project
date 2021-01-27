import { Component, Type } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterState } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { I18nTestingModule, RoutingService } from '@spartacus/core';
import {
  CommonConfigurator,
  CommonConfiguratorUtilsService,
} from '@spartacus/product-configurator/common';
import { Observable, of } from 'rxjs';
import { ConfiguratorCommonsService } from '../../core/facade/configurator-commons.service';
import * as ConfigurationTestData from '../../shared/testing/configurator-test-data';
import { MessageConfig } from '../config/message-config';
import { ConfiguratorUpdateMessageComponent } from './configurator-update-message.component';

let routerStateObservable = null;
class MockRoutingService {
  getRouterState(): Observable<RouterState> {
    return routerStateObservable;
  }
}

const owner: CommonConfigurator.Owner =
  ConfigurationTestData.productConfiguration.owner;

let isConfigurationLoading = false;
let hasPendingChanges = false;
let waitingTime = 1000;

class MockConfiguratorCommonsService {
  hasPendingChanges(): Observable<boolean> {
    return of(hasPendingChanges);
  }
  isConfigurationLoading(): Observable<boolean> {
    return of(isConfigurationLoading);
  }
}

class MockMessageConfig {
  productConfigurator = {
    updateConfigurationMessage: {
      waitingTime: waitingTime,
    },
  };
}
@Component({
  selector: 'cx-spinner',
  template: '',
})
class MockCxSpinnerComponent {}
describe('ConfigurationUpdateMessageComponent', () => {
  let component: ConfiguratorUpdateMessageComponent;
  let configuratorUtils: CommonConfiguratorUtilsService;
  let fixture: ComponentFixture<ConfiguratorUpdateMessageComponent>;
  let htmlElem: HTMLElement;

  beforeEach(
    waitForAsync(() => {
      routerStateObservable = of(ConfigurationTestData.mockRouterState);
      TestBed.configureTestingModule({
        imports: [I18nTestingModule, ReactiveFormsModule, NgSelectModule],
        declarations: [
          ConfiguratorUpdateMessageComponent,
          MockCxSpinnerComponent,
        ],
        providers: [
          {
            provide: RoutingService,
            useClass: MockRoutingService,
          },

          {
            provide: MessageConfig,
            useClass: MockMessageConfig,
          },
          {
            provide: ConfiguratorCommonsService,
            useClass: MockConfiguratorCommonsService,
          },
        ],
      });
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguratorUpdateMessageComponent);
    htmlElem = fixture.nativeElement;
    component = fixture.componentInstance;
    configuratorUtils = TestBed.inject(
      CommonConfiguratorUtilsService as Type<CommonConfiguratorUtilsService>
    );
    configuratorUtils.setOwnerKey(owner);
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });

  it('should not show update banner if pending changes and loading is false', () => {
    fixture.detectChanges();

    //Should contain d-none class
    expect(htmlElem.querySelectorAll('div.cx-update-msg.visible').length).toBe(
      0
    );
  });

  it('should show update banner if pending changes is true', (done) => {
    hasPendingChanges = true;
    isConfigurationLoading = false;
    fixture.detectChanges();

    //Should be hidden first
    expect(htmlElem.querySelectorAll('div.cx-update-msg.visible').length).toBe(
      0
    );

    //Should appear after a bit
    setTimeout(() => {
      fixture.detectChanges();
      expect(
        htmlElem.querySelectorAll('div.cx-update-msg.visible').length
      ).toBe(1);

      expect(htmlElem.querySelectorAll('div').length).toBe(1);
      done();
    }, 2000);
  });

  it('should show update banner if loading is true', (done) => {
    hasPendingChanges = false;
    isConfigurationLoading = true;
    fixture.detectChanges();

    //Should be hidden first
    expect(htmlElem.querySelectorAll('div.cx-update-msg.visible').length).toBe(
      0
    );

    //Should appear after a bit
    setTimeout(() => {
      fixture.detectChanges();
      expect(
        htmlElem.querySelectorAll('div.cx-update-msg.visible').length
      ).toBe(1);

      expect(htmlElem.querySelectorAll('div').length).toBe(1);
      done();
    }, 2000);
  });

  it('should show update banner if loading and pending changes are true', (done) => {
    hasPendingChanges = true;
    isConfigurationLoading = true;
    fixture.detectChanges();

    //Should be hidden first
    expect(htmlElem.querySelectorAll('div.cx-update-msg.visible').length).toBe(
      0
    );

    //Should appear after a bit
    setTimeout(() => {
      fixture.detectChanges();
      expect(
        htmlElem.querySelectorAll('div.cx-update-msg.visible').length
      ).toBe(1);

      expect(htmlElem.querySelectorAll('div').length).toBe(1);
      done();
    }, 2000);
  });

  it('should consider the configured timeout', (done) => {
    hasPendingChanges = true;
    isConfigurationLoading = true;
    waitingTime = 100;
    fixture.detectChanges();

    //Should be hidden first
    expect(htmlElem.querySelectorAll('div.cx-update-msg.visible').length).toBe(
      0
    );

    //Should appear after a bit
    setTimeout(() => {
      fixture.detectChanges();
      expect(
        htmlElem.querySelectorAll('div.cx-update-msg.visible').length
      ).toBe(1);

      expect(htmlElem.querySelectorAll('div').length).toBe(1);
      done();
    }, 2000);
  });
});
