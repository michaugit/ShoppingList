import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {StorageService} from "../services/auth/storage.service";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private storageService: StorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({withCredentials: true});

    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && !req.url.includes('auth/signin') && error.status === 401) {
          return this.handleError(req, next);
        } else if (error instanceof HttpErrorResponse && !req.url.includes('auth/signin') && error.status === 0){ /* sometimes credentials weren't added*/
          return this.handleError(req, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handleError(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request);
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];
