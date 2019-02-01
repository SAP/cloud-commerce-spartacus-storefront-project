import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { CmsNavigationComponent } from '@spartacus/core';
import { NavigationService } from './navigation.service';
import { NavigationNode } from './navigation-node.model';

@Component({
  selector: 'cx-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent {
  @Input() dropdownMode = 'list';
  @Input() node: NavigationNode;

  node$: Observable<NavigationNode>;

  constructor(private navigationService: NavigationService) {
    this.node$ = this.navigationService.getNodes();
  }

  getComponentData(): Observable<CmsNavigationComponent> {
    return this.navigationService.getComponentData();
  }
}
