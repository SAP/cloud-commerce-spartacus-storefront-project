import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnonymousConsent, ConsentTemplate } from '../../model/consent.model';
import { AnonymousConsentTemplatesAdapter } from './anonymous-consent-templates.adapter';

@Injectable({
  providedIn: 'root',
})
export class AnonymousConsentTemplatesConnector {
  constructor(protected adapter: AnonymousConsentTemplatesAdapter) {}

  loadAnonymousConsentTemplates(): Observable<ConsentTemplate[]> {
    return this.adapter.loadAnonymousConsentTemplates();
  }

  loadAnonymousConsents(): Observable<AnonymousConsent[]> | null {
    // TODO:#anon - create a deprecation ticket
    return this.adapter.loadAnonymousConsents
      ? this.adapter.loadAnonymousConsents()
      : null;
  }
}
