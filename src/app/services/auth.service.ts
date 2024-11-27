import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterPostData, User } from '../interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = "http://localhost:3000";
  constructor(private http: HttpClient) {}

  registerUser(postData: RegisterPostData){
    return this.http.post (`${this.baseUrl}/users`, postData);
  }

  getUserDetails(email:string, password: string): Observable<User[]>{
    return this.http.get<User[]>(
      `${this.baseUrl}/users?email=${email}&password=${password}`
    );
  }
}
