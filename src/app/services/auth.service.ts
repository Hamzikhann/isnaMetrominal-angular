import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string = environment.ApiBaseURL + 'auth/';

  constructor(private http: HttpClient, private router: Router) {}

  login(payload: any): Observable<any> {
    return this.http.post<any[]>(this.baseUrl + 'login', payload);
  }

  setToken(token: any) {
    localStorage.setItem('oxibit-lms-token', token);
  }

  setUserId(id: any) {
    localStorage.setItem('oxibit-lms-userId', id);
  }

  setUser(user: any) {
    localStorage.setItem('oxibit-lms-user', JSON.stringify(user));
  }

  getToken() {
    return localStorage.getItem('oxibit-lms-token');
  }

  getUser() {
    return localStorage.getItem('oxibit-lms-user') || '{}';
  }

  getUserId() {
    return localStorage.getItem('oxibit-lms-userId') || '{}';
  }

  loggedIn(): boolean {
    return localStorage.getItem('oxibit-lms-token') !== null;
  }

  logOut() {
    localStorage.removeItem('oxibit-lms-userId');
    localStorage.removeItem('oxibit-lms-user');
    localStorage.removeItem('oxibit-lms-token');
    this.router.navigate(['/signin']);
  }
}
