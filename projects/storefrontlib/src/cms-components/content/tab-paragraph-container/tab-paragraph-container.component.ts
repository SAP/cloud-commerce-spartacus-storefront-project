import {
  ChangeDetectionStrategy,
  Component,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CmsService, CMSTabParagraphContainer } from '@spartacus/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import {
  map,
  switchMap,
  distinctUntilChanged,
  distinctUntilKeyChanged,
} from 'rxjs/operators';
import { CmsComponentData } from '../../../cms-structure/page/model/index';
import { ComponentWrapperDirective } from '../../../cms-structure/page/component/component-wrapper.directive';

@Component({
  selector: 'cx-tab-paragraph-container',
  templateUrl: './tab-paragraph-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabParagraphContainerComponent
  implements AfterViewInit, OnDestroy {
  activeTabNum = 0;

  @ViewChildren(ComponentWrapperDirective) children!: QueryList<
    ComponentWrapperDirective
  >;

  tabTitleParams: Observable<any>[] = [];

  subscription: Subscription;

  constructor(
    public componentData: CmsComponentData<CMSTabParagraphContainer>,
    private cmsService: CmsService
  ) {}

  components$: Observable<any[]> = this.componentData.data$.pipe(
    distinctUntilKeyChanged('components'),
    switchMap(data =>
      combineLatest(
        data.components.split(' ').map(component =>
          this.cmsService.getComponentData<any>(component).pipe(
            distinctUntilChanged(),
            map(tab => {
              if (!tab.flexType) {
                tab = {
                  ...tab,
                  flexType: tab.typeCode,
                };
              }

              return {
                ...tab,
                title: `${data.uid}.tabs.${tab.uid}`,
              };
            })
          )
        )
      )
    )
  );

  select(tabNum: number): void {
    this.activeTabNum = tabNum;
  }

  ngAfterViewInit(): void {
    // If children exist, directly get the title parameters from them;
    // otherwise, listen to the children's changes
    if (this.children.length > 0) {
      this.getTitleParams(this.children);
    } else {
      if (!this.subscription) {
        this.subscription = this.children.changes.subscribe(
          (tabComps: QueryList<ComponentWrapperDirective>) =>
            this.getTitleParams(tabComps)
        );
      }
    }
  }

  private getTitleParams(children: QueryList<ComponentWrapperDirective>) {
    children.forEach(comp => {
      if (comp.cmpRef.instance.tabTitleParam$) {
        this.tabTitleParams.push(comp.cmpRef.instance.tabTitleParam$);
      } else {
        this.tabTitleParams.push(null);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
