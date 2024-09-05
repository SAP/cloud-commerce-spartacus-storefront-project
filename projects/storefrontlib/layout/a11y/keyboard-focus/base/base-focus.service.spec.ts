import { Component } from '@angular/core';
import { waitForAsync, TestBed } from '@angular/core/testing';
import { BaseFocusService } from './base-focus.service';

@Component({
    template: '<div id="a"></div><div id="b" tabindex="5"></div>',
    standalone: true
})
class MockComponent {}
describe('BaseFocusService', () => {
  let service: BaseFocusService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [MockComponent],
    providers: [BaseFocusService],
}).compileComponents();

    service = TestBed.inject(BaseFocusService);
  }));

  it('should inject service', () => {
    expect(service).toBeTruthy();
  });
});
