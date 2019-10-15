import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AnonymousConsent,
  ANONYMOUS_CONSENT_STATUS,
  ConsentTemplate,
} from '@spartacus/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICON_TYPE } from '../../../../../cms-components/misc/icon/icon.model';

@Component({
  selector: 'cx-anonymous-consent-form',
  templateUrl: './anonymous-consent-form.component.html',
})
export class AnonymousConsentFormComponent implements OnInit, OnDestroy {
  iconTypes = ICON_TYPE;
  consentGiven$ = new BehaviorSubject<boolean>(false);
  consentGivenTranslation$: Observable<string>;
  accordionExpanded = false;
  accordionHeight = '0px';

  @ViewChild('accordionContent', { static: false })
  accordionContent: ElementRef<HTMLDivElement>;

  @Input()
  template: ConsentTemplate;

  @Input()
  consent: AnonymousConsent;

  @Input()
  requiredConsents: string[] = [];

  @Output()
  consentChanged = new EventEmitter<{
    given: boolean;
    template: ConsentTemplate;
  }>();

  constructor() {}

  ngOnInit(): void {
    if (this.consent) {
      this.consentGiven$.next(
        this.consent.consentState ===
          ANONYMOUS_CONSENT_STATUS.ANONYMOUS_CONSENT_GIVEN
      );
    }
    this.consentGivenTranslation$ = this.consentGiven$.pipe(
      map(given =>
        given ? 'anonymousConsents.dialog.on' : 'anonymousConsents.dialog.off'
      )
    );
  }

  onConsentChange(): void {
    this.consentGiven$.next(!this.consentGiven$.value);

    this.consentChanged.emit({
      given: this.consentGiven$.value,
      template: this.template,
    });
  }

  toggleAccordion(keyEvent?: KeyboardEvent): void {
    let expand = true;
    if (keyEvent && keyEvent.key !== ' ' && keyEvent.key !== 'Enter') {
      expand = false;
    }

    if (expand) {
      this.accordionExpanded = !this.accordionExpanded;
      this.accordionHeight = this.accordionExpanded
        ? `${this.accordionContent.nativeElement.clientHeight}px`
        : '0px';
    }
  }

  isRequired(templateId: string): boolean {
    return this.requiredConsents.includes(templateId);
  }

  ngOnDestroy(): void {
    this.consentGiven$.unsubscribe();
  }
}
