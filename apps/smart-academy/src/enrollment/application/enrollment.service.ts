import { Inject, Injectable } from '@nestjs/common';
import { EnrollmentRepository } from './ports/enrollment.repository';

@Injectable()
export class EnrollmentService {
  constructor(@Inject() private readonly repository: EnrollmentRepository) {}
}
