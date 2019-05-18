import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Optional,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { CmsSearchBoxComponent } from '@spartacus/core';
import { CmsComponentData } from 'projects/storefrontlib/src/cms-structure';
import { Observable } from 'rxjs';
import { ICON_TYPE } from '../../../cms-components/misc/icon/index';
import { SearchBoxComponentService } from './search-box-component.service';
import { SearchResults } from './search-box.model';
@Component({
  selector: 'cx-searchbox',
  templateUrl: './search-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent {
  searchBoxControl: FormControl = new FormControl();

  /**
   * Sets the search box input field
   */
  @Input('queryText')
  set queryText(value: string) {
    if (value) {
      this.searchBoxControl.setValue(value);
    }
  }

  iconTypes = ICON_TYPE;

  /**
   * In some occasions we need to ignore the closing event,
   * for example when we click inside the search result section.
   */
  private ignoreCloseEvent = false;

  /**
   * The component data is optional, so that this component
   * can be reused without a CMS
   */
  constructor(
    protected searchBoxComponentService: SearchBoxComponentService,
    @Optional()
    protected componentData: CmsComponentData<CmsSearchBoxComponent>
  ) {}

  /**
   * Returns the search results for the typeahead searchbox.
   * The cms component data (searchbox config) will be passed if availalble.
   */
  searchResults$: Observable<
    SearchResults
  > = this.searchBoxComponentService.getSearchResults(
    this.searchBoxControl.valueChanges,
    this.componentData ? this.componentData.data$ : null
  );

  /**
   * Closes the typehead searchbox.
   */
  close(event: UIEvent): void {
    if (!this.ignoreCloseEvent) {
      this.searchBoxComponentService.toggleClass('open', false);
      if (event && event.target) {
        (<HTMLElement>event.target).blur();
      }
    }
    this.ignoreCloseEvent = false;
  }

  /**
   * Opens the typeahead searchbox
   *
   */
  open(el: HTMLInputElement): void {
    this.searchBoxComponentService.toggleClass('open', true);
    // put cursor to the end of the text
    const textLength = el.value.length;
    el.selectionStart = textLength;
    el.selectionEnd = textLength;
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
  public clear(): void {
    this.disableClose();
    this.searchBoxControl.reset();
  }

  /**
   * Closes the searchbox and opens the search result page.
   */
  public search(event: KeyboardEvent): void {
    this.close(event);
    this.searchBoxComponentService.launchSearchPage(
      this.searchBoxControl.value
    );
  }
}
