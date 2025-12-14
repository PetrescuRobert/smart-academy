import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((controllerResponse) => {
        if (
          controllerResponse &&
          typeof controllerResponse === 'object' &&
          'data' in controllerResponse
        ) {
          const { data, meta } = controllerResponse;
          return {
            success: true,
            code: statusCode,
            data: data ?? null,
            ...(meta ? { meta } : {}),
          };
        }

        return {
          success: true,
          data: controllerResponse ?? null,
          code: statusCode,
        };
      })
    );
  }
}
