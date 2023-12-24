import { Component } from '@angular/core';
import { Group } from 'src/app/model/group';
import { People } from 'src/app/model/people';
import { ToursService } from 'src/app/services/tours.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent {

  points: number = 0
  groupSequence: any = null
  groupPoints: any | null = null
  group: Group = new Group()
  names: People[] = []
  isOpened: boolean = false

  constructor(public tours: ToursService) {
    this.getGroups()
  }

  async getGroups() {
    await this.tours.getGroups()
    await this.tours.getGrouPoints()
    this.createGroupSequence()
  }

  async getGroup(id: number) {
    
    // Group Name
    const arr = this.tours.groups.filter(e => e.GroupID == id)
    this.group = arr[0]

    //get Group from Groups by ID
    this.groupPoints = this.tours.points.filter((e:any) => e.ID == id)

    // SUM group points
    for(let i = 0; i <this.groupPoints.length; i++) {
      this.points += Number(this.groupPoints[i].points)
    }

    this.getNamesOfGroup(id)

    this.isOpened = true
  }

  async getNamesOfGroup(id: number) {
    await this.tours.getNames()
    this.names = this.tours.peoples.filter(e => e.GroupID == id)
  }

  createGroupSequence() {
    let arr = []
    for(let i = 0; i < this.tours.groups.length; i++) {
      let sum = 0
      for(let j = 0; j <this.tours.points.length; j++) {
        if(Number(this.tours.points[j].ID) == i+1) {
          sum += this.tours.points[j].points
        }
      }
      let group = this.tours.groups.find(e =>e.GroupID == i+1)
      arr.push({
        GroupID: group?.GroupID,
        Groupname: group?.Groupname,
        Groupimage: group?.Groupimage,
        points: sum
      })
    }
    arr = arr.sort(this.compareByPoints)
    this.groupSequence = arr
  }

  compareByPoints(a: any, b: any) {
    return b.points - a.points
  }

  closeGroup() {
    this.isOpened = false
    this.groupPoints = null
    this.points = 0
  }
}
