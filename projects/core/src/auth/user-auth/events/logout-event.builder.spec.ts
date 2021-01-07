import { TestBed } from '@angular/core/testing';
import { Action, ActionsSubject } from '@ngrx/store';
import { EventService } from 'projects/core/src/event';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthActions } from '../store/actions';
import { LogoutEventBuilder } from './logout-event.builder';
import { LogoutEvent } from './user-auth.events';

describe('LogoutEventBuilder', () => {
  let eventService: EventService;
  let actions$: Subject<Action>;

  beforeEach(() => {
    actions$ = new Subject();
    TestBed.configureTestingModule({
      providers: [{ provide: ActionsSubject, useValue: actions$ }],
    });

    TestBed.inject(LogoutEventBuilder); // register events
    eventService = TestBed.inject(EventService);
  });

  it('OrderPlacedEvent', () => {
    let result: LogoutEvent;
    eventService
      .get(LogoutEvent)
      .pipe(take(1))
      .subscribe((value) => (result = value));

    actions$.next({ type: AuthActions.LOGOUT });
    expect(result).toEqual(new LogoutEvent());
  });
});
