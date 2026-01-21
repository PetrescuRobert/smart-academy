import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';

@Module({
  imports: [],
  providers: [EnrollmentService],
  controllers: [],
  exports: [],
})
export class EnrollmentModule {}
