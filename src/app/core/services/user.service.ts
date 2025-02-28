import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private http: HttpClient) { }
  
  getUsers(page: number, size:number) {
    return this.http.get(`https://localhost:7134/api/User?page=${page}&size=${size}`);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`https://localhost:7134/api/User?id=${userId}`);
  }
}
