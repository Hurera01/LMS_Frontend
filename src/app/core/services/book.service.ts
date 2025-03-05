import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  
  constructor(private http: HttpClient) { }
  
  getBooks(page: number, size: number): Observable<any>{
    return this.http.get(`https://localhost:7134/api/Book/GetPaginatedBooks?pageNumber=${page}&pageSize=${size}`)
  }
  
  deleteBook(book_id: number): Observable<any> {
    return this.http.delete(`https://localhost:7134/api/Book?id=${book_id}`);
  }

  editUser(userId: any, user: any) {
    return this.http.put(`https://localhost:7134/api/User?userId=${userId}`, user)
  }
}
