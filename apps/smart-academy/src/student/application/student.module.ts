import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentInfrastructureModule } from '../infrastructure/student-infrastructure.module';

@Module({
  imports: [StudentInfrastructureModule],
  providers: [StudentService],
})
export class StudentModule {}
