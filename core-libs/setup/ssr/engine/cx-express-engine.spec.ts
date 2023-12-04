/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// eslint-disable-next-line import/no-unassigned-import
import '@angular/compiler';

import { Component, Inject, InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServerModule } from '@angular/platform-server';
import { REQUEST, RESPONSE } from '../public_api';
import { cxExpressEngine } from './cx-express-engine';
//@ts-ignore

/**
 * @license
 * The MIT License
 * Copyright (c) 2010-2023 Google LLC. http://angular.io/license
 *
 * Inspired by tests for ngExpressEngine.
 *
 * See:
 * - https://github.com/angular/universal/blob/e798d256de5e4377b704e63d993dc56ea35df97d/modules/express-engine/spec/index.spec.ts
 * - https://github.com/angular/universal/blob/e798d256de5e4377b704e63d993dc56ea35df97d/modules/express-engine/spec/mock.server.module.ts
 *
 */
@Component({ selector: 'cx-mock', template: 'some template' })
export class MockComponent {}

@NgModule({
  imports: [BrowserModule, ServerModule],
  declarations: [MockComponent],
  bootstrap: [MockComponent],
})
export class MockServerModule {}

@Component({ selector: 'cx-request', template: `url:{{ _req.url }}` })
export class RequestComponent {
  constructor(@Inject(REQUEST) public readonly _req: any) {}
}

@NgModule({
  imports: [BrowserModule, ServerModule],
  declarations: [RequestComponent],
  bootstrap: [RequestComponent],
})
export class RequestServerModule {}

@Component({
  selector: 'cx-response',
  template: `statusCode:{{ _res.statusCode }}`,
})
export class ResponseComponent {
  constructor(@Inject(RESPONSE) public readonly _res: any) {}
}

@NgModule({
  imports: [BrowserModule, ServerModule],
  declarations: [ResponseComponent],
  bootstrap: [ResponseComponent],
})
export class ResponseServerModule {}

export const SOME_TOKEN = new InjectionToken<string>('SOME_TOKEN');

@Component({
  selector: 'cx-token',
  template: `message:{{ _someToken.message }}`,
})
export class TokenComponent {
  constructor(@Inject(SOME_TOKEN) public readonly _someToken: any) {}
}

@NgModule({
  imports: [BrowserModule, ServerModule],
  declarations: [TokenComponent],
  bootstrap: [TokenComponent],
})
export class TokenServerModule {}

describe('test runner', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation();
  });

  it('should render a basic template', (done) => {
    cxExpressEngine({ bootstrap: MockServerModule })(
      null as any as string,
      {
        req: { get: () => 'localhost' } as any,
        document: '<cx-mock></cx-mock>',
      },
      (err, html) => {
        if (err) {
          throw err;
        }
        expect(html).toContain('some template');
        done();
      }
    );
  });

  it('Should throw when no module is passed', () => {
    cxExpressEngine({ bootstrap: null as any })(
      null as any as string,
      {
        req: {} as any,
        bootstrap: null as any,
        document: '<cx-mock></cx-mock>',
      },
      (_err, _html) => {
        expect(_err).toBeTruthy();
      }
    );
  });

  it('should be able to inject REQUEST token', (done) => {
    cxExpressEngine({ bootstrap: RequestServerModule })(
      null as any as string,
      {
        req: {
          get: () => 'localhost',
          url: 'http://localhost:4200',
        } as any,
        document: '<cx-request></cx-request>',
      },
      (err, html) => {
        if (err) {
          throw err;
        }
        expect(html).toContain('url:http://localhost:4200');
        done();
      }
    );
  });

  it('should be able to inject RESPONSE token', (done) => {
    const someStatusCode = 400;
    cxExpressEngine({ bootstrap: ResponseServerModule })(
      null as any as string,
      {
        req: {
          get: () => 'localhost',
          res: {
            statusCode: someStatusCode,
          },
        } as any,
        document: '<cx-response></cx-response>',
      },
      (err, html) => {
        if (err) {
          throw err;
        }
        expect(html).toContain(`statusCode:${someStatusCode}`);
        done();
      }
    );
  });

  it('should be able to inject some token', (done) => {
    const someValue = { message: 'value' + new Date() };
    cxExpressEngine({
      bootstrap: TokenServerModule,
      providers: [{ provide: SOME_TOKEN, useValue: someValue }],
    })(
      null as any as string,
      {
        req: {
          get: () => 'localhost',
          url: 'http://localhost:4200',
        } as any,
        document: '<cx-token></cx-token>',
      },
      (err, html) => {
        if (err) {
          throw err;
        }
        expect(html).toContain(someValue.message);
        done();
      }
    );
  });
});
