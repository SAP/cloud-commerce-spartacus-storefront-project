import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product, ProductReviewService, Review } from '@spartacus/core';
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
    protected reviewService: ProductReviewService,
    protected currentProductService: CurrentProductService,
    private fb: FormBuilder,
    protected cd?: ChangeDetectorRef
  ) {}

  initiateWriteReview(): void {
    this.isWritingReview = true;
    this.cd.detectChanges();
    this.titleInput.nativeElement.focus();
  }

  cancelWriteReview(): void {
    this.isWritingReview = false;
    this.resetReviewForm();
    this.cd.detectChanges();
    this.writeReviewButton.nativeElement.focus();
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
    this.cd.detectChanges();
    this.writeReviewButton.nativeElement.focus();
  }

  private resetReviewForm(): void {
    this.reviewForm = this.fb.group({
      title: ['', Validators.required],
      comment: ['', Validators.required],
      rating: [0, [Validators.min(1), Validators.max(5)]],
      reviewerName: '',
    });
  }
}
