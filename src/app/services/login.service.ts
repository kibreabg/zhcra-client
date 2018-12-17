import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './../models/user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginUrl = 'http://zhcra.com:8788/api/auth';

  constructor(private http: HttpClient) { }

  login(user: User): Observable<any> {
    return this.http.post<User>(this.loginUrl + '/login', user, httpOptions);
  }

  logout() {
    return this.http.post<User>(this.loginUrl + '/logout', httpOptions);
  }

  loggedIn(): any {
    const token = this.getToken();
    if (token) {
      try {
        const payload = token.split('.')[1];
        const parsedPayload = JSON.parse(atob(payload));
        if (parsedPayload) {
          return parsedPayload.iss === 'http://zhcra.com:8788/api/auth/login' ? true : false;
        }
      } catch (ex) {
        return false;
      }
    } else {
      return false;
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
