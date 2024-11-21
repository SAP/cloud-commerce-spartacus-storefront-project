/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, Input, OnInit } from '@angular/core';
import { PointOfService, WeekdayOpeningDay } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'cx-schedule',
  templateUrl: './schedule.component.html',
  standalone: true,
  imports: [NgIf, NgFor, TranslatePipe],
})
export class ScheduleComponent implements OnInit {
  @Input()
  location: PointOfService;

  weekDays: WeekdayOpeningDay[];

  constructor() {
    // Intentional empty constructor
  }

  ngOnInit(): void {
    if (this.location) {
      this.weekDays = this.location.openingHours
        ?.weekDayOpeningList as WeekdayOpeningDay[];
    }
  }
}
