import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavigationNode } from '../navigation/navigation-node.model';
import { NavigationComponentService } from '../navigation/navigation.component.service';

@Component({
  selector: 'cx-footer-navigation',
  templateUrl: './footer-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterNavigationComponent {
  node$: Observable<NavigationNode> = this.service.getNavigationNode();

  styleClass$: Observable<string> = this.service
    .getComponentData()
    .pipe(map(d => d.styleClass));

  constructor(public service: NavigationComponentService) {}
}
