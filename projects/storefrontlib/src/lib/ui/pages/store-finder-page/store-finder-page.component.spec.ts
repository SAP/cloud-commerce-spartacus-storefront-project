import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreFinderPageComponent } from './store-finder-page.component';
import { Component } from '@angular/core';

@Component({
  selector: 'cx-store-finder-page-layout',
  template: ''
})
export class MockStoreFinderPageLayoutComponent {}

describe('StoreFinderPageComponent', () => {
  let component: StoreFinderPageComponent;
  let fixture: ComponentFixture<StoreFinderPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StoreFinderPageComponent,
        MockStoreFinderPageLayoutComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreFinderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
