import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentInfrastructureModule } from '../infrastructure/student-infrastructure.module';
import { StudentController } from '../presenters/http/student.controller';

@Module({
  imports: [StudentInfrastructureModule],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
