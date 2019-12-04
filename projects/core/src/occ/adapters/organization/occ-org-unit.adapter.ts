import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { OccEndpointsService } from '../../services/occ-endpoints.service';
import { ConverterService } from '../../../util/converter.service';
import { B2BUNIT_NORMALIZER } from '../../../organization/connectors/org-unit/converters';
import { Occ } from '../../occ-models/occ.models';
import { OrgUnitAdapter } from '../../../organization/connectors/org-unit/org-unit.adapter';
import B2BUnitNode = Occ.B2BUnitNode;
import B2BUnitNodeList = Occ.B2BUnitNodeList;

@Injectable()
export class OccOrgUnitAdapter implements OrgUnitAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {}

  load(userId: string, orgUnitId: string): Observable<B2BUnitNode> {
    return this.http
      .get(this.getOrgUnitEndpoint(userId, orgUnitId))
      .pipe(this.converter.pipeable(B2BUNIT_NORMALIZER));
  }

  loadList(
    userId: string,
    params?: any
  ): Observable<B2BUnitNodeList> {
    return this.http.get<Occ.B2BUnitNodeList>(
      this.getOrgUnitsEndpoint(userId, params)
    );
  }

  create(userId: string, orgUnit: B2BUnitNode): Observable<B2BUnitNode> {
    return this.http
      .post<Occ.B2BUnitNode>(this.getOrgUnitsEndpoint(userId), orgUnit)
      .pipe(this.converter.pipeable(B2BUNIT_NORMALIZER));
  }

  update(userId: string, orgUnit: B2BUnitNode): Observable<B2BUnitNode> {
    return this.http
      .patch<Occ.B2BUnitNode>(
        this.getOrgUnitEndpoint(userId, orgUnit.id),
        orgUnit
      )
      .pipe(this.converter.pipeable(B2BUNIT_NORMALIZER));
  }

  protected getOrgUnitEndpoint(userId: string, orgUnitId: string): string {
    return this.occEndpoints.getUrl('organization', { userId, orgUnitId });
  }

  protected getOrgUnitsEndpoint(userId: string, params?: any): string {
    return this.occEndpoints.getUrl('organizations', { userId }, params);
  }
}
