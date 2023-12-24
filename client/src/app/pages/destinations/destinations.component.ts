import { Component } from '@angular/core';
import { Destination } from 'src/app/model/destiantion';
import { ToursService } from 'src/app/services/tours.service';

@Component({
  selector: 'app-destinations',
  templateUrl: './destinations.component.html',
  styleUrls: ['./destinations.component.scss']
})
export class DestinationsComponent {

  destinations: Destination[] = []
  isOpened: boolean = false

  constructor(public tours: ToursService) {
    this.getDestinations()
  }

  async getDestinations() {
    await this.tours.getDestinations()
    .catch(err => {
      throw new err
    })
    .then(() => {
      this.destinations = this.tours.destinations
    })
  }

  async getDestination(id: number) {
    this.tours.getDestination(id)
    .catch(e => {
      throw new e
    })
    
    this.tours.getDestinationImages(id)
    .catch((e) =>{
      throw e
    })
    .then(() => {
      this.isOpened = true
    })
  }

  closeDestination() {
    this.isOpened = false
    this.tours.destination = new Destination()
  }
}
