import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';

describe('StudentController', () => {
  let controller: StudentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
    }).compile();

    controller = module.get<StudentController>(StudentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // SHOULD CHECK VERY CAREFULLY THE UPSERT OF A STUDENT GIVEN A NEW UUID BY THE USER, POTENTIAL VULNERABILITY
});
