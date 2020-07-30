import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Configurator, GenericConfigurator } from '@spartacus/core';
import { ICON_TYPE } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigUtilsService } from '../../service/config-utils.service';

@Component({
  selector: 'cx-config-attribute-footer',
  templateUrl: './config-attribute-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigAttributeFooterComponent implements OnInit {
  @Input() attribute: Configurator.Attribute;
  @Input() owner: GenericConfigurator.Owner;
  @Input() groupId: string;

  constructor(protected configUtils: ConfigUtilsService) {}

  iconType = ICON_TYPE;
  showRequiredMessageForUserInput$: Observable<boolean>;

  ngOnInit(): void {
    /**
     * Show message that indicates that attribute is required in case attribute is a
     * free input field
     */
    this.showRequiredMessageForUserInput$ = this.configUtils
      .isCartEntryOrGroupVisited(this.owner, this.groupId)
      .pipe(map((result) => (result ? this.needsUserInputMessage() : false)));
  }

  /**
   * Checks if attribute is a user input typed attribute with empty value.
   * Method will return false for domain based attributes
   * @param input
   */
  isUserInputEmpty(input: string): boolean {
    return input !== undefined && (!input.trim() || 0 === input.length);
  }

  protected needsUserInputMessage(): boolean {
    return (
      this.attribute.required &&
      this.attribute.incomplete &&
      this.isUserInputEmpty(this.attribute.userInput)
    );
  }
}
