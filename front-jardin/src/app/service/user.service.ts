import { HttpClient } from '@angular/common/http';
import { User } from './../class/user';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = '';
  constructor(private http: HttpClient) { }

  getUser(): Observable<any>{
    return this.http.get(this.url);
  }

  getUserId(user: User): Observable<any>{
    return this.http.get(`${this.url}/${user.id}`);
  }

  addUser(user: User): Observable<any>{
    return this.http.post(this.url, user);
  }

  updateUser(user: User): Observable<any>{
    return this.http.put(`${this.url}/${user.id}`, user);
  }

  deleteUser(user: User): Observable<any>{
    return this.http.delete(`${this.url}/${user.id}`);
  }
}
