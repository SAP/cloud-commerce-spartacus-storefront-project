import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  Renderer2,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ICON_TYPE } from '../../misc/icon/index';
import { NavigationNode } from './navigation-node.model';

@Component({
  selector: 'cx-navigation-ui',
  templateUrl: './navigation-ui.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationUIComponent {
  /**
   * The navigation node to render.
   */
  @Input() node: NavigationNode;

  /**
   * The number of child nodes that must be wrapped.
   */
  @Input() wrapAfter: number;

  /**
   * the icon type that will be used for navigation nodes
   * with children.
   */
  iconType = ICON_TYPE;

  /**
   * Indicates whether the navigation should support flyout.
   * If flyout is set to true, the
   * nested child navitation nodes will only appear on hover or focus.
   */
  @Input() @HostBinding('class.flyout') flyout = true;

  @Input() @HostBinding('class.is-open') isOpen = false;

  private openNodes: HTMLElement[] = [];

  constructor(private router: Router, private renderer: Renderer2) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.clear());
  }

  toggleOpen(event: UIEvent): void {
    const node = <HTMLElement>event.currentTarget;
    if (this.openNodes.includes(node)) {
      this.openNodes = this.openNodes.filter(n => n !== node);
      this.renderer.removeClass(node, 'is-open');
    } else {
      this.openNodes.push(node);
    }

    this.updateClasses();

    event.stopImmediatePropagation();
    event.stopPropagation();
  }

  back(): void {
    this.renderer.removeClass(
      this.openNodes[this.openNodes.length - 1],
      'is-open'
    );
    this.openNodes.pop();
    this.updateClasses();
  }

  clear(): void {
    this.openNodes = [];
    this.updateClasses();
  }

  alignWrapperToRight(event: UIEvent) {
    const node = <HTMLElement>event.currentTarget;
    const parent = <HTMLElement>this.renderer.parentNode(node);
    if (
      node.offsetLeft + node.offsetWidth >
      parent.offsetLeft + parent.offsetWidth
    ) {
      const wrapper = <HTMLElement>node.getElementsByClassName('wrapper')[0];
      this.renderer.setStyle(
        wrapper,
        'margin-left',
        `${node.offsetWidth - wrapper.offsetWidth}px`
      );
    }
  }

  private updateClasses(): void {
    this.openNodes.forEach((node, i) => {
      if (i + 1 < this.openNodes.length) {
        this.renderer.addClass(node, 'is-opened');
        this.renderer.removeClass(node, 'is-open');
      } else {
        this.renderer.removeClass(node, 'is-opened');
        this.renderer.addClass(node, 'is-open');
      }
    });

    this.isOpen = this.openNodes.length > 0;
  }

  getDepth(node: NavigationNode, depth = 0): number {
    if (node.children && node.children.length > 0) {
      return Math.max(...node.children.map(n => this.getDepth(n, depth + 1)));
    } else {
      return depth;
    }
  }
}
