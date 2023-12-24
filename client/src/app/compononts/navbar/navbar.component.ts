import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isOpened: boolean = false

  constructor(public auth: AuthService) {
  }

  handleClick() {
    if(this.auth.isLoggedIn) {
      this.isOpened = !this.isOpened
    }
  }

  logout() {
    this.auth.logOut()
    this.isOpened = false
  }
}
