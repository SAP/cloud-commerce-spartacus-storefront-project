import { TestBed } from '@angular/core/testing';
import { BudgetFormService } from './budget-form.service';

describe('BudgetFormService', () => {
  let service: BudgetFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetFormService);
  });

  it('should inject service', () => {
    expect(service).toBeTruthy();
  });

  it('should build the form', () => {
    const form = service.getForm({});
    expect(form.get('code')).not.toBeNull();
    expect(form.get('name')).not.toBeNull();
    expect(form.get('currency').get('isocode')).not.toBeNull();
    expect(form.get('orgUnit').get('uid')).not.toBeNull();
  });

  it('should apply the model', () => {
    const form = service.getForm({ code: 'test' });
    expect(form.get('code')).not.toBeNull();
    expect(form.get('code').value).toEqual('test');
  });
});
