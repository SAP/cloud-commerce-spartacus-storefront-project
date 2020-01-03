import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SkipLink } from '../config/skip-link.config';
import { SkipLinkService } from '../service/skip-link.service';

@Component({
  selector: 'cx-skip-link',
  templateUrl: './skip-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkipLinkComponent {
  skipLinks$: Observable<SkipLink[]> = this.skipLinkService.getSkipLinks();

  constructor(private skipLinkService: SkipLinkService) {}

  scrollToTarget(skipLink: SkipLink, event: MouseEvent): void {
    this.skipLinkService.scrollToTarget(
      skipLink.target,
      skipLink.position,
      event
    );
  }

  /**
   * Hides the skip link by removing the focus.
   */
  blur(event: MouseEvent): void {
    (<HTMLElement>event.target).blur();
  }

  tabNext(event: MouseEvent): void {
    if (this.isElement((<HTMLElement>event.target).nextSibling)) {
      (<HTMLElement>(<HTMLElement>event.target).nextSibling).focus();
    }
  }
  tabPrev(event: MouseEvent): void {
    if (this.isElement((<HTMLElement>event.target).previousSibling)) {
      (<HTMLElement>(<HTMLElement>event.target).previousSibling).focus();
    }
  }

  private isElement(element: Node): boolean {
    return !!element && element instanceof HTMLElement;
  }
}
