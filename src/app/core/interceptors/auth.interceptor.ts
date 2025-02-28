import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError, from, Observable, tap } from 'rxjs';

let isRefreshing = false;
let refreshTokenSubject: Observable<any> | null = null;

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401 && refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject = from(authService.refreshToken(refreshToken)).pipe(
            tap(response => {
              localStorage.setItem('token', response.token);
              localStorage.setItem('refreshToken', response.refreshToken);
              console.log('New tokens received:', response.token, response.refreshToken);
            }),
            catchError(refreshError => {
              authService.logout();
              return throwError(() => refreshError);
            }),
            tap(() => {
              isRefreshing = false;
              refreshTokenSubject = null;
            })
          );
        }

        // Wait for the refresh token process and retry the failed request
        return refreshTokenSubject!.pipe(
          switchMap(response => {
            req = req.clone({
              setHeaders: { Authorization: `Bearer ${response.token}` }
            });
            return next(req);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
