import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import {
  AssociatedObject,
  Category,
  TicketDetails,
  TicketStarter,
} from '@spartacus/customer-ticketing/root';

export const CUSTOMER_TICKETING_NORMALIZER = new InjectionToken<
  Converter<any, TicketDetails>
>('CustomerTicketingNormalizer');

export const CUSTOMER_TICKETING_FILE_NORMALIZER = new InjectionToken<
  Converter<any, File>
>('CustomerTicketingFileNormalizer');

export const CUSTOMER_TICKETING_CREATE_NORMALIZER = new InjectionToken<
  Converter<any, TicketStarter>
>('CustomerTicketingCreateNormalizer');

export const CUSTOMER_TICKETING_CATEGORY_NORMALIZER = new InjectionToken<
  Converter<any, Category>
>('CustomerTicketingCategoryNormalizer');

export const CUSTOMER_TICKETING_ASSOCIATED_OBJECTS_NORMALIZER =
  new InjectionToken<Converter<any, AssociatedObject>>(
    'CustomerTicketingAssociatedObjectsNormalizer'
  );
