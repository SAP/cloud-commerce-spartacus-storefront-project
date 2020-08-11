import { Type } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { UserGroup } from '../../../../model/user-group.model';
import { OccUserGroupNormalizer } from './occ-user-group-normalizer';
import { OccConfig, Occ } from '@spartacus/core';

const MockOccModuleConfig: OccConfig = {
  backend: {
    occ: {
      baseUrl: '',
      prefix: '',
    },
  },
};

describe('UserGroupNormalizer', () => {
  let service: OccUserGroupNormalizer;

  const userGroup: Occ.OrgUnitUserGroup = {
    name: 'UserGroup1',
    uid: 'testUid',
  };

  const convertedUserGroup: UserGroup = {
    name: 'UserGroup1',
    uid: 'testUid',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OccUserGroupNormalizer,
        { provide: OccConfig, useValue: MockOccModuleConfig },
      ],
    });

    service = TestBed.inject(
      OccUserGroupNormalizer as Type<OccUserGroupNormalizer>
    );
  });

  it('should inject OccUserGroupNormalizer', inject(
    [OccUserGroupNormalizer],
    (userGroupNormalizer: OccUserGroupNormalizer) => {
      expect(userGroupNormalizer).toBeTruthy();
    }
  ));

  it('should convert userGroup', () => {
    const result = service.convert(userGroup);
    expect(result).toEqual(convertedUserGroup);
  });

  it('should convert userGroup with applied target', () => {
    const result = service.convert(userGroup, {});
    expect(result).toEqual({});
  });
});
