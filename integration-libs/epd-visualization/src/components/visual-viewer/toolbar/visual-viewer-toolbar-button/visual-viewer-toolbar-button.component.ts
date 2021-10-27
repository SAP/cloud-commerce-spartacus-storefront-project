import { Component, Input } from '@angular/core';

@Component({
  selector: 'cx-visual-viewer-toolbar-button',
  templateUrl: './visual-viewer-toolbar-button.component.html',
})
export class VisualViewerToolbarButtonComponent {
  @Input() text = '';
  @Input() iconLibraryClass: string;
  @Input() iconClass: string;
  @Input() disabled = false;
  @Input() checked = false;
}
