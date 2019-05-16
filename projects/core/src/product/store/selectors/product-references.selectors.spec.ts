import { TestBed } from '@angular/core/testing';
import * as ngrxStore from '@ngrx/store';
import { select, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { ProductReference } from '../../../model/product.model';
import { PRODUCT_FEATURE, StateWithProduct } from '../product-state';
import * as fromStore from './../../store';

const productCode = 'productCode';
const product = {
  code: productCode,
  name: 'testProduct',
};

const list: ProductReference[] = [
  { referenceType: 'SIMILAR', target: product },
  { referenceType: 'ACCESSORIES', target: product },
];

describe('Product References selectors', () => {
  let store: Store<StateWithProduct>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(PRODUCT_FEATURE, fromStore.getReducers()),
      ],
    });

    store = TestBed.get(Store);
    spyOnProperty(ngrxStore, 'select').and.returnValue(() => () => of(list));
  });

  it('getSelectedProductReferencesFactory should return references', () => {
    let result: ProductReference[];
    store
      .pipe(select(fromStore.getSelectedProductReferencesFactory(productCode)))
      .subscribe(data => (result = data))
      .unsubscribe();

    expect(result).toEqual(list);
  });
});
