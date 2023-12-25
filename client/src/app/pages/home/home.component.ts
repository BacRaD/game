import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Destination } from 'src/app/model/destiantion';
import { People } from 'src/app/model/people';
import { Tours } from 'src/app/model/tours';
import { ToursService } from 'src/app/services/tours.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  isOpened: boolean = false
  asd: number = 0
  peoples: People[] = []
  peoplesResult: People[] = []
  currentTour: Tours = new Tours()
  isLoading: boolean = false

  constructor(public tour: ToursService, private router: Router) {
  }

  handleDestinationChange(event: any) {
    this.currentTour.destination = this.tour.destinations.find(e => e.DestinationID == event.target.value) as Destination
  }

  handleImageChange(event: any) {
    this.currentTour.image = event.target.files[0]
  }

  handleDateChange(event: any) {
    this.currentTour.date = event.target.value.toString()
  }

  createTour() {
    this.isLoading = true
    if(this.currentTour.date == "") {
      alert("Mikor teljesítettétek?")
      return
    } else if(this.currentTour.peoples.length == 0) {
      alert("Kik voltak ott?")
      return
    } else if(!this.currentTour.image) {
      alert("Nincs kép hozzáadva!")
      return
    }
    
    const formData = new FormData()
    if(this.currentTour.image.size != 0) {
      formData.append('file', this.currentTour.image)
    }
    let string = ""
    for(let i = 0; i < this.currentTour.peoples.length; i++) {
      string += this.currentTour.peoples[i].PeopleID.toString()+" "
    }
    formData.append('peoples', string)
    let groupIDs = []
    for(let i = 0; i < this.currentTour.peoples.length; i++) {
      groupIDs.push(this.currentTour.peoples[i].GroupID)
    }
    let set = new Set(groupIDs).size
    formData.append('groups', set.toString())
    formData.append('destination', this.currentTour.destination.DestinationID.toString())
    formData.append('date', this.currentTour.date)
    this.tour.createTour(formData)
    .catch((e) => {
      throw e
    })
    .then(() => {
      this.isOpened = false
      this.isLoading = false
      this.currentTour = new Tours()
      this.router.navigate(['/groups'])
    })
  }

  async getDestinations() {
    this.tour.getDestinations()
    .catch(e => {
      throw new e
    })
    .then(() => {
    })
  }

  async getGroupsName() {
    this.tour.getGroupsName()
    .catch(e => {
      throw e
    })
    .then(() => {

    })
  }

  async getNames() {
    this.tour.getNames()
    .catch(e => {
      throw e
    })
    .then(() => {
      const id = Number(localStorage.getItem("groupID"))
      this.peoples = this.tour.peoples.filter(e => e.GroupID == id)
    })
  }

  groupNameChange(event: any) {
    this.peoples = this.tour.peoples.filter(e => e.GroupID == event.target.value)
  }

  openAddTour() {
    this.currentTour.destination.DestinationID = 1
    this.getDestinations()
    this.getGroupsName()
    this.getNames()
    .then(() => {
      this.isOpened = true
    })
  }

  closeAddTour() {
    this.isOpened = false
    this.currentTour = new Tours()
  }

  pushToPeopleResult(x: People) {
    this.currentTour.peoples.push(x)
  }

  removeFromPeopleResult(x: People) {
    this.currentTour.peoples = this.currentTour.peoples.filter(e => e != x)
  }
}
