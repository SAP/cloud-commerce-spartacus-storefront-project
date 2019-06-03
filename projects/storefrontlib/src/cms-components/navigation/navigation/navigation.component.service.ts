import { Injectable, Optional } from '@angular/core';
import { CmsNavigationComponent, CmsService } from '@spartacus/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { CmsComponentData } from '../../../cms-structure/page/model/cms-component-data';
import { NavigationNode } from './navigation-node.model';

@Injectable()
export class NavigationComponentService {
  constructor(
    protected cmsService: CmsService,
    @Optional()
    protected componentData: CmsComponentData<CmsNavigationComponent>
  ) {}

  public getComponentData(): Observable<CmsNavigationComponent> {
    return this.componentData.data$;
  }

  public createNavigation(): Observable<NavigationNode> {
    return combineLatest(
      this.getComponentData(),
      this.getNavigationNode()
    ).pipe(
      map(([data, nav]) => {
        return {
          title: data.name,
          children: [nav],
        };
      })
    );
  }

  public getNavigationNode(): Observable<NavigationNode> {
    return this.getComponentData().pipe(
      filter(Boolean),
      switchMap(data => {
        const navigation = data.navigationNode ? data.navigationNode : data;
        return this.cmsService.getNavigationEntryItems(navigation.uid).pipe(
          tap(items => {
            if (items === undefined) {
              this.getNavigationEntryItems(navigation, true);
            }
          }),
          filter(Boolean),
          map(items => this.createNode(navigation, items))
        );
      })
    );
  }

  /**
   * Get all navigation entry items' type and id. Dispatch action to load all these items
   * @param nodeData
   * @param root
   * @param itemsList
   */
  private getNavigationEntryItems(
    nodeData: any,
    root: boolean,
    itemsList = []
  ) {
    if (nodeData.entries && nodeData.entries.length > 0) {
      nodeData.entries.forEach(entry => {
        itemsList.push({
          superType: entry.itemSuperType,
          id: entry.itemId,
        });
      });
    }

    if (nodeData.children && nodeData.children.length > 0) {
      this.processChildren(nodeData, itemsList);
    }

    if (root) {
      const rootUid = nodeData.uid;
      this.cmsService.loadNavigationItems(rootUid, itemsList);
    }
  }

  private processChildren(node, itemsList): void {
    for (const child of node.children) {
      this.getNavigationEntryItems(child, false, itemsList);
    }
  }

  /**
   * Create a new node tree for display
   * @param nodeData
   * @param items
   */
  private createNode(nodeData: any, items: any): NavigationNode {
    const node = {};

    node['title'] = nodeData.title;

    if (nodeData.entries && nodeData.entries.length > 0) {
      this.addLinkToNode(node, nodeData.entries[0], items);
    }

    if (nodeData.children && nodeData.children.length > 0) {
      const children = this.createChildren(nodeData, items);
      node['children'] = children;
    }

    return node;
  }

  private addLinkToNode(node, entry, items) {
    const item = items[`${entry.itemId}_${entry.itemSuperType}`];

    // now we only consider CMSLinkComponent
    if (entry.itemType === 'CMSLinkComponent' && item !== undefined) {
      if (!node['title']) {
        node['title'] = item.linkName;
      }
      node['url'] = item.url;
      // if "NEWWINDOW", target is true
      node['target'] = item.target;
    }
  }

  private createChildren(node, items) {
    const children = [];
    for (const child of node.children) {
      const childNode = this.createNode(child, items);
      children.push(childNode);
    }
    return children;
  }
}
