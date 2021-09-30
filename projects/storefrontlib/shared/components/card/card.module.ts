import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeaturesConfigModule, I18nModule } from '@spartacus/core';
import { IconModule } from '../../../cms-components/misc/icon/icon.module';
import { TruncateTextPopoverModule } from '../truncate-text-popover/truncate-text-popover.module';
import { CardComponent } from './card.component';
import { KeyboardFocusModule } from '../../../../storefrontlib/layout/a11y/keyboard-focus/keyboard-focus.module';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    IconModule,
    TruncateTextPopoverModule,
    KeyboardFocusModule,
    FeaturesConfigModule
  ],
  declarations: [CardComponent],
  exports: [CardComponent],
})
export class CardModule {}
