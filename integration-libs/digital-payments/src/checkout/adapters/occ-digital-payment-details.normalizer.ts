import { Injectable } from '@angular/core';
import { PaymentDetails } from '@spartacus/cart/main/root';
import { Converter, Occ } from '@spartacus/core';

@Injectable({
  providedIn: 'root',
})
export class OccDpDetailsNormalizer
  implements Converter<Occ.PaymentDetails, PaymentDetails>
{
  convert(source: Occ.PaymentDetails, target: PaymentDetails): PaymentDetails {
    if (target === undefined) {
      target = { ...(source as any) };
    }
    return target;
  }
}
