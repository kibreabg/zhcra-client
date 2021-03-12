import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../core/models/user';
import { tap } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private loginUrl = 'http://localhost:5000/api/Users';

  constructor(private http: HttpClient) { }

  login(user: User): Observable<any> {
    return this.http.post<User>(this.loginUrl + '/Login', user, httpOptions);
  }

  logout() {
    return this.http.post<User>(this.loginUrl + '/Logout', httpOptions);
  }

  getUser(): Observable<User> {
    const token = '"' + this.getToken() + '"';
    return this.http.post<any>(this.loginUrl + '/GetUserByAccessToken', token, httpOptions);
  }

  loggedIn(): any {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        if (decodedToken) {
          return decodedToken.iss === 'http://localhost:5000/api/Users/Login'
            ? true
            : false;
        }
      } catch (ex) {
        console.log(ex);
        return false;
      }
    } else {
      return false;
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }

  refreshToken() {
    return this.http.post<any>(this.loginUrl + '/refresh', httpOptions).pipe(
      tap((tokens: any) => {
        localStorage.setItem('token', tokens);
      })
    );
  }
}
