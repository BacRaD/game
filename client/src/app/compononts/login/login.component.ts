import { Component } from '@angular/core';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  user: User = new User()

  constructor(public auth: AuthService) {
    
  }

  async login() {
    this.auth.loginUser(this.user)
    .catch(e =>{
      throw new e
    })
    .then(() => {
      this.auth.isLoggedIn = true
    })
  }
 
}
