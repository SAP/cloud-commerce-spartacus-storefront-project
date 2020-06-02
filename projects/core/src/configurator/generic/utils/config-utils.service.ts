import { Injectable } from '@angular/core';
import { GenericConfigurator } from '../../../model/generic-configurator.model';

/**
 * Utilities for generic configuration
 */
@Injectable({ providedIn: 'root' })
export class GenericConfigUtilsService {
  /**
   * Compiles a unique key for a configuration owner and sets it into the 'key'
   * attribute
   * @param owner Specifies the owner of a product configuration
   */
  public setOwnerKey(owner: GenericConfigurator.Owner) {
    if (owner.type === GenericConfigurator.OwnerType.PRODUCT) {
      if (!owner.id) {
        throw new Error('We expect a product code!');
      }
    } else if (owner.type === GenericConfigurator.OwnerType.CART_ENTRY) {
      if (!owner.id) {
        throw new Error('We expect a document entry Id!');
      }
    } else if (owner.type === GenericConfigurator.OwnerType.ORDER_ENTRY) {
      if (!owner.id) {
        throw new Error('We expect a document entry Id!');
      }
    } else {
      throw new Error('We expect an owner type!');
    }
    owner.key = owner.type + '/' + owner.id;
  }

  /**
   * Composes owner ID from document ID and entry number
   * @param documentId ID of document the entry is part of, like the order or quote code
   * @param entryNumber Entry number
   * @returns owner ID
   */
  public getComposedOwnerId(documentId: string, entryNumber: number): string {
    return documentId + '+' + entryNumber;
  }

  /**
   * Decomposes an owner ID into documentId and entryNumber
   * @param ownerId ID of owner
   * @returns object containing documentId and entryNumber
   */
  public decomposeOwnerId(ownerId: string): any {
    const parts: string[] = ownerId.split('+');
    if (parts.length !== 2) {
      throw new Error('We only expect 2 parts in ownerId, separated by +');
    }
    const result = { documentId: parts[0], entryNumber: parts[1] };
    return result;
  }
}
