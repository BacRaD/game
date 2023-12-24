import { Component } from '@angular/core';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.scss']
})
export class ManualComponent {
  name: string = ""
  constructor() {
    this.name = this.getName()
  }

  getName() {
    return localStorage.getItem("user") as string
  }

}
