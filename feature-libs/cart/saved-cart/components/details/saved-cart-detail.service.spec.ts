import { TestBed } from '@angular/core/testing';

import { SavedCartDetailService } from './saved-cart-detail.service';

xdescribe('SavedCartDetailService', () => {
  let service: SavedCartDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavedCartDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
