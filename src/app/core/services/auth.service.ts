import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  constructor(private http: HttpClient) { }

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
    return this.http.post<{ token: string, refreshToken: string }>(
      `https://localhost:7134/api/Auth/refresh-token`, 
      { refreshToken }
    );
  }

  logout(): void {
    localStorage.clear();
  }
  
  isAuthenticate(): boolean{
    const token = localStorage.getItem('token');
    if(!token) return false;

    try{
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.exp > Date.now() / 1000;
    }catch(error){
      return false;
    }
  }

  register(credentials: object): Observable<any>{
    return this.http.post(`https://localhost:7134/api/Auth`, credentials);
  }
}
