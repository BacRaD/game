import { Component } from '@angular/core';
import { People } from 'src/app/model/people';
import { ToursService } from 'src/app/services/tours.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  people: People = new People()

  constructor(public tours: ToursService) {
    this.getMe()
  }

  async getMe() {
    await this.tours.getPeople()
    .catch(e =>{throw e})
    .then(() => {
      this.people = this.tours.people
    })
    await this.tours.getPeoplesPoints()
    .catch((e) => {
      throw e
    })
    .then(() => {
    })
  }

  me(id: number) {
    if(this.people.PeopleID == id) return true
    else return false
  }
}
