import { Component, Input, NgModule } from '@angular/core';

@Component({
  selector: 'cx-icon,[cxIcon]',
  template: `{{ type || cxIcon }}`,
})
export class MockIconComponent {
  @Input() cxIcon;
  @Input() type;
}

const mockComponents = [MockIconComponent];

@NgModule({
  declarations: mockComponents,
  exports: mockComponents,
})
export class IconTestingModule {}
