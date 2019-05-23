import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Optional,
} from '@angular/core';
import { CmsSearchBoxComponent } from '@spartacus/core';
import { CmsComponentData } from '../../../cms-structure/page/model/cms-component-data';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ICON_TYPE } from '../../../cms-components/misc/icon/index';
import { SearchBoxComponentService } from './search-box-component.service';
import { SearchBoxConfig, SearchResults } from './search-box.model';

@Component({
  selector: 'cx-searchbox',
  templateUrl: './search-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent implements OnInit {
  /**
   * Sets the search box input field
   */
  @Input('queryText')
  set queryText(value: string) {
    if (value) {
      this.search(value);
    }
  }

  iconTypes = ICON_TYPE;

  private config: SearchBoxConfig;

  /**
   * In some occasions we need to ignore the close event,
   * for example when we click inside the search result section.
   */
  private ignoreCloseEvent = false;

  /**
   * The component data is optional, so that this component
   * can be reused without CMS integration.
   */
  constructor(
    protected searchBoxComponentService: SearchBoxComponentService,
    @Optional()
    protected componentData: CmsComponentData<CmsSearchBoxComponent>
  ) {}

  results$: Observable<
    SearchResults
  > = this.searchBoxComponentService.getResults();

  ngOnInit() {
    if (this.componentData) {
      this.componentData.data$
        .pipe(first())
        .subscribe(c => (this.config = <SearchBoxConfig>c));
    }
  }

  /**
   * Closes the searchbox and opens the search result page.
   */
  search(query: string): void {
    this.searchBoxComponentService.search(query, this.config);
    // force the searchbox to open
    this.open();
  }

  /**
   * Opens the typeahead searchbox
   */
  open(): void {
    this.searchBoxComponentService.toggleBodyClass('searchbox-is-active', true);
  }

  /**
   * Closes the typehead searchbox.
   */
  close(event: UIEvent): void {
    if (!this.ignoreCloseEvent) {
      this.searchBoxComponentService.toggleBodyClass(
        'searchbox-is-active',
        false
      );
      if (event && event.target) {
        (<HTMLElement>event.target).blur();
      }
    }
    this.ignoreCloseEvent = false;
  }

  /**
   * Especially in mobile we do not want the search icon
   * to focus the input again when it's already open.
   * */
  avoidReopen(event: UIEvent): void {
    if (this.searchBoxComponentService.hasBodyClass('searchbox-is-active')) {
      this.close(event);
      event.preventDefault();
    }
  }

  /**
   * Opens the PLP with the given query.
   *
   * TODO: if there's a singe product match, we could open the PDP.
   */
  launchSearchResult(event: UIEvent, query: string): void {
    this.close(event);
    this.searchBoxComponentService.launchSearchPage(query);
  }

  /**
   * Disables closing the search result list.
   */
  disableClose(): void {
    this.ignoreCloseEvent = true;
  }

  /**
   * Clears the search box input field
   */
  public clear(el: HTMLInputElement): void {
    this.disableClose();
    el.value = '';
    this.searchBoxComponentService.clearResults();
  }
}
