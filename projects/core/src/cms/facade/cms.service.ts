import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import {
  catchError,
  filter,
  pluck,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { CmsComponent } from '../../model/cms.model';
import { RoutingService } from '../../routing/facade/routing.service';
import { PageContext } from '../../routing/models/page-context.model';
import { LoaderState } from '../../state';
import { ContentSlotData } from '../model/content-slot-data.model';
import { NodeItem } from '../model/node-item.model';
import { Page } from '../model/page.model';
import * as fromStore from '../store';
import { StateWithCms } from '../store/cms-state';

@Injectable({
  providedIn: 'root',
})
export class CmsService {
  private _launchInSmartEdit = false;

  private components: {
    [uid: string]: Observable<CmsComponent>;
  } = {};

  constructor(
    protected store: Store<StateWithCms>,
    protected routingService: RoutingService
  ) {}

  /**
   * Set _launchInSmartEdit value
   */
  set launchInSmartEdit(value: boolean) {
    this._launchInSmartEdit = value;
  }

  /**
   * Whether the app launched in smart edit
   */
  isLaunchInSmartEdit(): boolean {
    return this._launchInSmartEdit;
  }

  /**
   * Get current CMS page data
   */
  getCurrentPage(): Observable<Page> {
    return this.routingService
      .getPageContext()
      .pipe(
        switchMap(pageContext =>
          this.store.select(fromStore.getPageData(pageContext))
        )
      );
  }

  /**
   * Get CMS component data by uid
   * @param uid : CMS componet uid
   */
  getComponentData<T extends CmsComponent>(uid: string): Observable<T> {
    if (!this.components[uid]) {
      this.components[uid] = combineLatest([
        this.routingService.isNavigating(),
        this.store.pipe(select(fromStore.componentStateSelectorFactory(uid))),
      ]).pipe(
        tap(([isNavigating, componentState]) => {
          // componentState is undefined when the whole components entities are empty.
          // In this case, we don't load component one by one, but extract component data from cms page
          if (componentState !== undefined) {
            const attemptedLoad =
              componentState.loading ||
              componentState.success ||
              componentState.error;
            if (!attemptedLoad && !isNavigating) {
              this.store.dispatch(new fromStore.LoadComponent(uid));
            }
          }
        }),
        pluck(1),
        filter(componentState => componentState && componentState.success),
        pluck('value'),
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }

    return this.components[uid] as Observable<T>;
  }

  /**
   * Given the position, get the content slot data
   * @param position : content slot position
   */
  getContentSlot(position: string): Observable<ContentSlotData> {
    return this.routingService.getPageContext().pipe(
      switchMap(pageContext =>
        this.store.pipe(
          select(fromStore.currentSlotSelectorFactory(pageContext, position)),
          filter(Boolean)
        )
      )
    );
  }

  /**
   * Given navigation node uid, get items (with id and type) inside the navigation entries
   * @param navigationNodeUid : uid of the navigation node
   */
  getNavigationEntryItems(navigationNodeUid: string): Observable<NodeItem> {
    return this.store.pipe(
      select(fromStore.itemsSelectorFactory(navigationNodeUid))
    );
  }

  /**
   * Load navigation items data
   * @param rootUid : the uid of the root navigation node
   * @param itemList : list of items (with id and type)
   */
  loadNavigationItems(
    rootUid: string,
    itemList: { id: string; superType: string }[]
  ): void {
    this.store.dispatch(
      new fromStore.LoadNavigationItems({
        nodeId: rootUid,
        items: itemList,
      })
    );
  }

  /**
   * Refresh the content of the latest cms page
   */
  refreshLatestPage(): void {
    this.routingService
      .getPageContext()
      .pipe(take(1))
      .subscribe(pageContext =>
        this.store.dispatch(new fromStore.LoadPageData(pageContext))
      );
  }

  /**
   * Refresh the cms page content by page Id
   * @param pageId
   */
  refreshPageById(pageId: string): void {
    const pageContext: PageContext = { id: pageId };
    this.store.dispatch(new fromStore.LoadPageData(pageContext));
  }

  /**
   * Refresh cms component's content
   * @param uid : component uid
   */
  refreshComponent(uid: string): void {
    this.store.dispatch(new fromStore.LoadComponent(uid));
  }

  /**
   * Given pageContext, return the CMS page data
   * @param pageContext
   */
  getPageState(pageContext: PageContext): Observable<Page> {
    return this.store.pipe(select(fromStore.getPageData(pageContext)));
  }

  /**
   * Given pageContext, return the CMS page data
   * @param pageContext
   */
  getPageComponentTypes(pageContext: PageContext): Observable<string[]> {
    return this.store.pipe(
      select(fromStore.getPageComponentTypes(pageContext))
    );
  }

  /**
   * Given pageContext, return whether the CMS page data exists or not
   * @param pageContext
   */
  hasPage(pageContext: PageContext, forceReload = false): Observable<boolean> {
    return this.store.pipe(
      select(fromStore.getIndexEntity(pageContext)),
      tap((entity: LoaderState<string>) => {
        const attemptedLoad = entity.loading || entity.success || entity.error;
        const shouldReload = forceReload && !entity.loading;
        if (!attemptedLoad || shouldReload) {
          this.store.dispatch(new fromStore.LoadPageData(pageContext));
        }
      }),
      filter(entity => entity.success || entity.error),
      pluck('success'),
      catchError(() => of(false))
    );
  }

  getPageIndex(pageContext: PageContext): Observable<string> {
    return this.store.pipe(select(fromStore.getIndexValue(pageContext)));
  }

  setPageFailIndex(pageContext: PageContext, value: string): void {
    this.store.dispatch(new fromStore.SetPageFailIndex(pageContext, value));
  }
}
