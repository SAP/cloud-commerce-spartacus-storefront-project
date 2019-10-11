import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Product,
  ProductReviewService,
  Review,
  FeatureConfigService,
} from '@spartacus/core';
import { Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { CurrentProductService } from '../../current-product.service';

@Component({
  selector: 'cx-product-reviews',
  templateUrl: './product-reviews.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductReviewsComponent {
  @ViewChild('titleInput', { static: false }) titleInput: ElementRef;
  @ViewChild('writeReviewButton', { static: false })
  writeReviewButton: ElementRef;

  isWritingReview = false;

  // TODO: configurable
  initialMaxListItems = 5;
  maxListItems: number;
  reviewForm: FormGroup;

  product$: Observable<Product> = this.currentProductService.getProduct();

  reviews$: Observable<Review[]> = this.product$.pipe(
    filter(p => !!p),
    switchMap(product => this.reviewService.getByProductCode(product.code)),
    tap(() => {
      this.resetReviewForm();
      this.maxListItems = this.initialMaxListItems;
    })
  );

  constructor(
    reviewService: ProductReviewService,
    currentProductService: CurrentProductService,
    fb: FormBuilder,
    // tslint:disable-next-line: unified-signatures
    cd: ChangeDetectorRef
  );

  /**
   * @deprecated since version 1.x
   * Replace constructor, for more details, check below ticket
   *
   * TODO(issue:#4945) Product page tabs accessibility changes
   */
  constructor(
    reviewService: ProductReviewService,
    currentProductService: CurrentProductService,
    fb: FormBuilder
  );
  constructor(
    protected reviewService: ProductReviewService,
    protected currentProductService: CurrentProductService,
    private fb: FormBuilder,
    protected cd?: ChangeDetectorRef,
    // TODO(issue:#4962) Deprecated since 1.3.0
    protected featureConfig?: FeatureConfigService
  ) {}

  initiateWriteReview(): void {
    this.isWritingReview = true;

    // TODO(issue:#4945) Product page tabs accessibility changes
    if (this.cd) {
      this.cd.detectChanges();
    }

    if (this.titleInput && this.titleInput.nativeElement) {
      this.titleInput.nativeElement.focus();
    }
  }

  cancelWriteReview(): void {
    this.isWritingReview = false;
    this.resetReviewForm();

    // TODO(issue:#4945) Product page tabs accessibility changes
    if (this.cd) {
      this.cd.detectChanges();
    }

    if (this.writeReviewButton && this.writeReviewButton.nativeElement) {
      this.writeReviewButton.nativeElement.focus();
    }
  }

  setRating(rating): void {
    this.reviewForm.controls.rating.setValue(rating);
  }

  submitReview(product: Product): void {
    const reviewFormControls = this.reviewForm.controls;
    const review: Review = {
      headline: reviewFormControls.title.value,
      comment: reviewFormControls.comment.value,
      rating: reviewFormControls.rating.value,
      alias: reviewFormControls.reviewerName.value,
    };

    this.reviewService.add(product.code, review);

    this.isWritingReview = false;
    this.resetReviewForm();

    // TODO(issue:#4945) Product page tabs accessibility changes
    if (this.cd) {
      this.cd.detectChanges();
    }

    if (this.writeReviewButton && this.writeReviewButton.nativeElement) {
      this.writeReviewButton.nativeElement.focus();
    }
  }

  private resetReviewForm(): void {
    this.reviewForm = this.fb.group({
      title: ['', Validators.required],
      comment: ['', Validators.required],
      rating: [0, [Validators.min(1), Validators.max(5)]],
      reviewerName: '',
    });
  }

  /**
   * @deprecated since 1.3.0
   * This function will be removed as submit button should not be disabled
   *
   * TODO(issue:#4962) Deprecated since 1.3.0
   */
  shouldDisableSubmitButton(): boolean {
    if (this.featureConfig && this.featureConfig.isLevel('1.3')) {
      return false;
    }
    return !this.reviewForm.valid;
  }
}
