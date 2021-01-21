import { Injectable } from '@angular/core';
import { CxEvent, EventService, WindowRef } from '@spartacus/core';
import { AdobeLaunchService, TmsConfig } from '@spartacus/tms';

type CustomAdobeLaunchDataLayer = {};

interface CustomAdobeLaunchWindow extends Window {
  myDataLayer?: CustomAdobeLaunchDataLayer;
}

@Injectable({ providedIn: 'root' })
export class CustomAdobeLaunchService extends AdobeLaunchService {
  constructor(
    protected eventsService: EventService,
    protected windowRef: WindowRef,
    protected tmsConfig: TmsConfig
  ) {
    super(eventsService, windowRef, tmsConfig);
  }

  protected prepareDataLayer(): void {
    if (this.window) {
      this.window.myDataLayer = {};
    }
  }

  protected pushToDataLayer<T extends CxEvent>(event: T): void {
    if (this.window) {
      console.log(
        `🎭  CUSTOM Adobe Launch received data: ${JSON.stringify(event)}`
      );
      this.window.myDataLayer = { myEvent: event };
    }
  }

  get window(): CustomAdobeLaunchWindow | undefined {
    return this.windowRef.nativeWindow;
  }
}
