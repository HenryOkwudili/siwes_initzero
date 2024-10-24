import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import * as Sentry from '@sentry/node';

const sentry_dsn = process.env.SENTRY_URL;

Sentry.init({
  dsn: sentry_dsn,
});

export class ValidationException extends BadRequestException {
  constructor(public validationErrors: Record<string, unknown>) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, 'Validation Error');
  }
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    console.log('exception', exception);

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error Testing';

    const devErrorResponse: any = {
      statusCode,
      success: false,
      path: request.url,
      message: exception.message,
      errors: exception.validationErrors,
    };

    const prodErrorResponse: any = {
      statusCode,
      success: false,
      message,
      error: exception.validationErrors,
    };

    Logger.error(
      `request method: ${request.method} request url${request.url}`,
      JSON.stringify(devErrorResponse),
    );

    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(exception);
    }

    response
      .status(statusCode)
      .json(
        process.env.NODE_ENV === 'development'
          ? devErrorResponse
          : prodErrorResponse,
      );
  }
}
