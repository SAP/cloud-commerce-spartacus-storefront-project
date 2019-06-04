import { NgModule } from '@angular/core';
import { Config, ConfigModule } from '@spartacus/core';
import { OutletRefModule } from '../cms-structure/outlet/index';
import { defaultLayoutConfig } from './config/default-layout-config';
import { LayoutConfig } from './config/layout-config';
import { MainModule } from './main/main.module';

const layoutModules = [OutletRefModule];

@NgModule({
  imports: [
    MainModule,
    ...layoutModules,
    ConfigModule.withConfig(defaultLayoutConfig),
  ],
  providers: [{ provide: LayoutConfig, useExisting: Config }],
  exports: [MainModule, ...layoutModules],
})
export class LayoutModule {}
