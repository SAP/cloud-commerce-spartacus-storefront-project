import { NgModule } from '@angular/core';
import { provideDefaultConfig } from '@spartacus/core';
import { AsmComponentsModule } from './components/asm-components.module';
// TODO
// import { AsmCoreModule } from '@spartacus/storefinder/core';
// import { AsmOccModule } from '@spartacus/storefinder/occ';
// import { AsmComponentsModule } from '@spartacus/storefinder/components';
import { AsmCoreModule } from './core/asm-core.module';
import { defaultAsmConfig } from './core/config/default-asm-config';
import { AsmOccModule } from './occ/asm-occ.module';

@NgModule({
  imports: [AsmCoreModule, AsmOccModule, AsmComponentsModule],
  providers: [provideDefaultConfig(defaultAsmConfig)],
})
export class AsmModule {}
