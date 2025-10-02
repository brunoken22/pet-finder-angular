import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import baseUrl from '../../utils/baseUrl';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signin(email: string, password: string) {
    return this.http.post(`${baseUrl}/auth/token`, { email, password });
  }
}
