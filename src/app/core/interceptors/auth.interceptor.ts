import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError, from, BehaviorSubject, filter, take, tap, finalize } from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  const loginUrl = '/api/Auth/login';
  const refreshUrl = '/api/Auth/refresh-token';

  if (!req.url.includes(loginUrl) && !req.url.includes(refreshUrl) && token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req).pipe(
    catchError(error => {
      console.log('Interceptor Error:', error);
      if (refreshToken) {
        console.log('401 Unauthorized error, attempting to refresh token.');

        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);
          console.log('Refreshing token...');

          return from(authService.refreshToken(refreshToken)).pipe(
            tap(response => {
              console.log('Token refreshed successfully');
              localStorage.setItem('token', response.token);
              localStorage.setItem('refreshToken', response.refreshToken);
              refreshTokenSubject.next(response.token);
            }),
            switchMap(() => {
              return next(req.clone({
                setHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}` }
              }));
            }),
            catchError(refreshError => {
              console.error("Refresh token failed:", refreshError);
              if (refreshError.status === 401) {
                authService.logout();
                window.location.href = '/login';
              }
              refreshTokenSubject.next(null);
              return throwError(() => refreshError);
            }),
            finalize(() => {
              isRefreshing = false;
              console.log('Refresh process completed.');
            })
          );
        } else {
          console.log('Waiting for ongoing token refresh...');
          return refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(token => {
              console.log('Retrying request with new token.');
              return next(req.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
              }));
            })
          );
        }
      }

      console.error('Request failed with error:', error);
      return throwError(() => error);
    })
  );
};
