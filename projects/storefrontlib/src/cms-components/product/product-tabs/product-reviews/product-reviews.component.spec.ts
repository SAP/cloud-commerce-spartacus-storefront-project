import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  I18nTestingModule,
  ProductReviewService,
  Product,
  FeatureConfigService,
} from '@spartacus/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { ItemCounterModule } from '../../../../shared';
import { ProductReviewsComponent } from './product-reviews.component';
import { CurrentProductService } from '../../current-product.service';

const productCode = '123';
const product = { code: productCode, text: 'bla' };
const reviews = [
  { comment: 'bla1', headline: '1', alias: 'test1' },
  { comment: 'bla2', headline: '2', alias: 'test2' },
];

class MockProductReviewService {
  getByProductCode(): Observable<any> {
    return of(reviews);
  }
  add() {}
}

@Component({
  selector: 'cx-star-rating',
  template: '',
})
class MockStarRatingComponent {
  @Input() rating;
  @Input() disabled;
}

const mockProduct: Product = { name: 'mockProduct' };

class MockCurrentProductService {
  getProduct(): Observable<Product> {
    return of(mockProduct);
  }
}

// TODO(issue:#4962) Deprecated since 1.3.0
const isLevelBool: BehaviorSubject<boolean> = new BehaviorSubject(false);
class MockFeatureConfigService {
  isLevel(_level: string): boolean {
    return isLevelBool.value;
  }
}

fdescribe('ProductReviewsComponent in product', () => {
  let productReviewsComponent: ProductReviewsComponent;
  let fixture: ComponentFixture<ProductReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ItemCounterModule, I18nTestingModule],
      providers: [
        {
          provide: ProductReviewService,
          useClass: MockProductReviewService,
        },
        {
          provide: CurrentProductService,
          useClass: MockCurrentProductService,
        },
        // TODO(issue:#4962) Deprecated since 1.3.0
        { provide: FeatureConfigService, useClass: MockFeatureConfigService },
      ],
      declarations: [MockStarRatingComponent, ProductReviewsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductReviewsComponent);
    productReviewsComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(productReviewsComponent).toBeTruthy();
  });

  it('from get reviews by product code', () => {
    expect(productReviewsComponent.reviews$).toBeTruthy();
    productReviewsComponent.reviews$.subscribe(result => {
      expect(result).toEqual(reviews);
    });
  });

  it('should contain a form object for the review submission form, after init()', () => {
    const props = ['comment', 'title', 'rating', 'reviewerName'];

    props.forEach(prop => {
      expect(productReviewsComponent.reviewForm.controls[prop]).toBeDefined();
    });
  });

  describe('Logic on displaying review submission form', () => {
    it('should be initiated to hide the form', () => {
      expect(productReviewsComponent.isWritingReview).toBe(false);
    });

    it('should display form on initiateWriteReview()', () => {
      productReviewsComponent.initiateWriteReview();
      expect(productReviewsComponent.isWritingReview).toBe(true);
    });

    it('should hide form on cancelWriteReview()', () => {
      productReviewsComponent.cancelWriteReview();
      expect(productReviewsComponent.isWritingReview).toBe(false);
    });

    it('should hide form on submitReview()', () => {
      productReviewsComponent.submitReview(product);
      expect(productReviewsComponent.isWritingReview).toBe(false);
    });
  });

  // TODO(issue:#4962) Deprecated since 1.3.0
  describe('shouldDisableSubmitButton()', () => {
    it('should disable if form invalid', () => {
      expect(productReviewsComponent.shouldDisableSubmitButton()).toEqual(true);
    });

    it('should enable if form is valid', () => {
      productReviewsComponent.reviewForm.controls['title'].setValue(
        'test title'
      );
      productReviewsComponent.reviewForm.controls['comment'].setValue(
        'test comment'
      );
      productReviewsComponent.reviewForm.controls['rating'].setValue(5);
      expect(productReviewsComponent.shouldDisableSubmitButton()).toEqual(
        false
      );
    });

    it('should enable if v1.3', () => {
      isLevelBool.next(true);
      expect(productReviewsComponent.shouldDisableSubmitButton()).toEqual(
        false
      );
    });
  });
});
