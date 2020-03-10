import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs/internal/observable/of';
import createSpy = jasmine.createSpy;

import { OrgUnitAdapter } from './org-unit.adapter';
import { OrgUnitConnector } from './org-unit.connector';
import { B2BApprovalProcess } from '@spartacus/core';

const userId = 'userId';
const orgUnitId = 'orgUnitId';
const approvalProcessCode = 'approvalProcessCode';

const orgUnitNode = {
  id: orgUnitId,
};

const orgUnit = {
  uid: orgUnitId,
};

const approvalProcess: B2BApprovalProcess = {
  code: approvalProcessCode,
  name: 'approvalProcessName',
};

class MockOrgUnitAdapter implements OrgUnitAdapter {
  load = createSpy('OrgUnitAdapter.load').and.returnValue(of(orgUnit));
  loadList = createSpy('OrgUnitAdapter.loadList').and.returnValue(
    of([orgUnitNode])
  );
  create = createSpy('OrgUnitAdapter.create').and.returnValue(of(orgUnit));
  update = createSpy('OrgUnitAdapter.update').and.returnValue(of(orgUnit));
  loadTree = createSpy('OrgUnitAdapter.loadTree').and.returnValue(of(orgUnit));
  loadApprovalProcesses = createSpy(
    'OrgUnitAdapter.loadApprovalProcesses'
  ).and.returnValue(of([approvalProcess]));
}

describe('OrgUnitConnector', () => {
  let service: OrgUnitConnector;
  let adapter: OrgUnitAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrgUnitConnector,
        { provide: OrgUnitAdapter, useClass: MockOrgUnitAdapter },
      ],
    });

    service = TestBed.get(OrgUnitConnector as Type<OrgUnitConnector>);
    adapter = TestBed.get(OrgUnitAdapter as Type<OrgUnitAdapter>);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load orgUnit', () => {
    service.get(userId, orgUnitId);
    expect(adapter.load).toHaveBeenCalledWith(userId, orgUnitId);
  });

  it('should load orgUnits', () => {
    const params = { sort: 'code' };
    service.getList(userId, params);
    expect(adapter.loadList).toHaveBeenCalledWith(userId, params);
  });

  it('should create orgUnit', () => {
    service.create(userId, orgUnit);
    expect(adapter.create).toHaveBeenCalledWith(userId, orgUnit);
  });

  it('should update orgUnit', () => {
    service.update(userId, orgUnitId, orgUnit);
    expect(adapter.update).toHaveBeenCalledWith(userId, orgUnitId, orgUnit);
  });
});
