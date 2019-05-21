import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { OccSiteAdapter } from '../occ/occ-site.adapter';
import { SiteAdapter } from '../connectors/site.adapter';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [
    {
      provide: SiteAdapter,
      useClass: OccSiteAdapter,
    },
  ],
})
export class SiteContextOccModule {}
