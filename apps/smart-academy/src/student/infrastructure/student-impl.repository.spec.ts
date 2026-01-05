import { Test, TestingModule } from '@nestjs/testing';
import { StudentRepositoryImpl } from './student-impl.repository';

describe('StudentRepositoryImpl', () => {
  let repository: StudentRepositoryImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentRepositoryImpl],
    }).compile();

    repository = module.get<StudentRepositoryImpl>(StudentRepositoryImpl);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('findById -- should return a student given a valid id', () => {
    // arrange
    // act
    //assert
  });
});
