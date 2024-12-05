import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Accept: 'application/json',
        'access-token': `${this.authService.getToken()}`,
      },
    });
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toastr.error(error.error.message, 'Error!');
        return throwError(error);
      })
    );
  }
}
