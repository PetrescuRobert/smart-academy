import { BaseId } from './base-id.vo.js';

export abstract class BaseEntity<ID extends BaseId> {
  id: ID;

  constructor(idValue: ID) {
    this.id = idValue;
  }
}
