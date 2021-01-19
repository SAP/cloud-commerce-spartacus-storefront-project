import { TestBed } from '@angular/core/testing';
import { createFrom, EventService } from '@spartacus/core';
import { take } from 'rxjs/operators';
import { NavigationEvent } from '../navigation/navigation.event';
import { CartPageEventBuilder } from './cart-page-event.builder';
import { CartPageEvent } from './cart-page.events';

describe('CartPageEventBuilder', () => {
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    TestBed.inject(CartPageEventBuilder); // register events
    eventService = TestBed.inject(EventService);
  });

  it('CartPageEvent', () => {
    let result: CartPageEvent;
    eventService
      .get(CartPageEvent)
      .pipe(take(1))
      .subscribe((value) => (result = value));

    const navigationEvent = createFrom(NavigationEvent, {
      context: undefined,
      semanticRoute: 'cart',
      url: 'cart url',
      params: undefined,
    });
    eventService.dispatch(navigationEvent);
    expect(result).toBeTruthy();
  });
});
