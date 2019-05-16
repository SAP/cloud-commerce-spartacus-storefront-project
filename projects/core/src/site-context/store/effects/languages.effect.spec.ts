import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { hot, cold } from 'jasmine-marbles';
import { provideMockActions } from '@ngrx/effects/testing';
import { of, Observable } from 'rxjs';

import * as fromEffects from './languages.effect';
import * as fromActions from '../actions/languages.action';
import { OccModule } from '../../../occ/occ.module';
import { ConfigModule } from '../../../config/config.module';
import { Language } from '../../../model/misc.model';
import { SiteConnector } from '../../connectors/site.connector';
import { SiteAdapter } from '../../connectors/site.adapter';

describe('Languages Effects', () => {
  let actions$: Observable<fromActions.LanguagesAction>;
  let connector: SiteConnector;
  let effects: fromEffects.LanguagesEffects;

  const languages: Language[] = [
    { active: true, isocode: 'ja', name: 'Japanese' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfigModule.forRoot(), HttpClientTestingModule, OccModule],
      providers: [
        fromEffects.LanguagesEffects,
        { provide: SiteAdapter, useValue: {} },
        provideMockActions(() => actions$),
      ],
    });

    connector = TestBed.get(SiteConnector);
    effects = TestBed.get(fromEffects.LanguagesEffects);

    spyOn(connector, 'getLanguages').and.returnValue(of(languages));
  });

  describe('loadLanguages$', () => {
    it('should populate all languages from LoadLanguagesSuccess', () => {
      const action = new fromActions.LoadLanguages();
      const completion = new fromActions.LoadLanguagesSuccess(languages);

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadLanguages$).toBeObservable(expected);
    });
  });

  describe('activateLanguage$', () => {
    it('should change the active language', () => {
      const action = new fromActions.SetActiveLanguage('zh');
      const completion = new fromActions.LanguageChange();

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.activateLanguage$).toBeObservable(expected);
    });
  });
});
