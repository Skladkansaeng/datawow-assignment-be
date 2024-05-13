import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { STATUS_CODES } from 'http';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
  private logger = new Logger('ExceptionFilter');
  catch(
    exception: { constraint: string; detail: string },
    host: ArgumentsHost,
  ) {
    this.logger.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception.constraint && exception.constraint.startsWith('UQ')
        ? HttpStatus.CONFLICT
        : HttpStatus.BAD_REQUEST;

    response
      .set('Content-Type', 'application/json')
      .status(status)
      .json({
        statusCode: status,
        error: STATUS_CODES[status],
        message: exception?.detail || '',
      });
  }
}

@Catch(EntityNotFoundError)
export class EntityNotFoundFilter implements ExceptionFilter {
  catch(_, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = HttpStatus.NOT_FOUND;

    response.set('Content-Type', 'application/json').status(status).json({
      statusCode: status,
      error: STATUS_CODES[status],
      message: '',
    });
  }
}
