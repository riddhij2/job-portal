import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Login } from '../../models/Login/login';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public isAuthenticated = false;

  constructor(private http: GlobalService) { }

  getLoginUser(loginInfo: Login): Observable<any> {
    let url: string = environment.apiUrl + 'Dashboard/Login';
    this.isAuthenticated = true;
    sessionStorage.setItem('isAuthenticated', 'true');
    return this.http.post(url, loginInfo);
  }

  logout(): Observable<any> {
    let url: string = environment.apiUrl + 'Account/Logout';
    this.isAuthenticated = false;
    sessionStorage.removeItem('isAuthenticated');
    return this.http.post(url, {});
  }

  public get loggedIn(): boolean {
    return (sessionStorage.getItem('session') !== null);
  }

  isAuthenticatedUser() {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  }
}
