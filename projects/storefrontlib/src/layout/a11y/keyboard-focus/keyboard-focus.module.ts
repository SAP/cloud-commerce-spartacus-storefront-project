import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AutoFocusDirective } from './autofocus/index';
import { BlockFocusDirective } from './block/index';
import { EscapeFocusDirective } from './escape/index';
import { FocusDirective } from './focus.directive';
import { LockFocusDirective } from './lock/index';
import { PersistFocusDirective } from './persist/index';
import { TabFocusDirective } from './tab/index';
import { TrapFocusDirective } from './trap/index';
import { VisibleFocusDirective } from './visible/index';

const directives = [
  PersistFocusDirective,
  VisibleFocusDirective,
  BlockFocusDirective,
  AutoFocusDirective,
  EscapeFocusDirective,
  LockFocusDirective,
  TrapFocusDirective,
  TabFocusDirective,
  FocusDirective,
];

@NgModule({
  imports: [CommonModule],
  declarations: [...directives],
  exports: [...directives],
})
export class KeyboardFocusModule {}
