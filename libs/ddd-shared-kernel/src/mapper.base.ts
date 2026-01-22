import { Entity } from './entity.base';

export abstract class Mapper<
  DomainEntity extends Entity<unknown>,
  DbModel,
  Dto
> {
  abstract toPersistance(entity: DomainEntity): DbModel;
  abstract toDomain(model: DbModel): DomainEntity;
  abstract toDto(entity: DomainEntity): Dto;
}
