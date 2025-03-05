import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

interface JwtPayload {
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7134/api/Auth/login';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: object): Observable<any>{
    return this.http.post(`${this.apiUrl}`, credentials);
    // this.http.post<any>(this.apiUrl, credentials).pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     if(error.status === 401){
    //       return throwError (() => new Error('Unauthorized'));
    //     }
    //     return throwError(() => new Error('Something went wrong!'));
    //   }),
      // tap((response) => {
      //   debugger
      //   // localStorage.setItem('token', response.token);
      //   // localStorage.setItem('refreshToken', response.refreshToken);
      // })
    // );
  }

  refreshToken(refreshToken: string): Observable<{ token: string, refreshToken: string }> {
    debugger;
    return this.http.post<{ token: string, refreshToken: string }>(
      `https://localhost:7134/api/Auth/refresh-token`, 
      { refreshToken }
    );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login'])
  }
  
  isAuthenticate(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const isExpired = this.isTokenExpired(token);
    if (isExpired) {
      this.logout();
      return false;
    }
    return true;
  }

  isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      const expirationDate = decodedToken.exp * 1000;
      return Date.now() > expirationDate;
    } catch (e) {
      console.error('Invalid token:', e);
      return true;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  register(credentials: object): Observable<any>{
    return this.http.post(`https://localhost:7134/api/Auth`, credentials);
  }
}
