import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn: boolean = false
  url: string = 'http://217.13.111.90'

  constructor(private http: HttpClient) {
     if(localStorage.getItem("token")) {
      this.isLoggedIn  = true
     }
   }

  loginUser(user: User) {
    return new Promise<void>((resolve, reject) => {
      this.http.post<any>(this.url+"/login", user).subscribe({
        next: (v) => {
          localStorage.setItem("token", v.token)
          localStorage.setItem("user", user.name)
          localStorage.setItem("groupID", v.GroupID)
          resolve()
        }, error: (e) => {
          reject(e)
        }
      })
    })
  }

  logOut() {
    localStorage.clear()
    this.isLoggedIn = false
  }
}
