import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';

import { Store } from '@ngrx/store';
import { AbstractCmsComponent } from '../../cms/components/abstract-cms-component';
import * as fromStore from '../../cms/store';
import { CmsModuleConfig } from '../../cms/cms-module-config';

@Component({
  selector: 'y-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannerComponent extends AbstractCmsComponent {
  constructor(
    protected cd: ChangeDetectorRef,
    protected store: Store<fromStore.CmsState>,
    protected config: CmsModuleConfig
  ) {
    super(cd, store, config);
  }

  hasImage() {
    return (
      undefined !== this.component &&
      null !== this.component &&
      null !== this.component.media
    );
  }

  public getImageUrl(): string {
    return this.hasImage() ? this.component.media.url : '';
  }

  // TODO: implement target
  public getTarget(): string {
    return '_self';
  }

  getAltText() {
    return this.component.media.altText;
  }

  public getUrlLink(): string {
    let url = '';

    if (this.component.urlLink !== undefined) {
      url = this.getBaseUrl();
      if (this.component.urlLink.startsWith('/')) {
        url += this.component.urlLink;
      } else {
        url += '/' + this.component.urlLink;
      }
    }
    return url;
  }
}
