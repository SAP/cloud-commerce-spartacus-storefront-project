/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileTagInjectorService } from '../services/profile-tag.injector.service';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'cx-profiletag',
    template: `
    <ng-container *ngIf="profileTagEnabled$ | async"></ng-container>
  `,
    imports: [NgIf, AsyncPipe],
})
export class ProfileTagComponent {
  profileTagEnabled$: Observable<boolean> = this.profileTagInjector.track();
  constructor(private profileTagInjector: ProfileTagInjectorService) {}
}
