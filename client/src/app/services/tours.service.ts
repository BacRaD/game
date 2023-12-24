import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Destination } from '../model/destiantion';
import { Group } from '../model/group';
import { People } from '../model/people';

@Injectable({
  providedIn: 'root'
})
export class ToursService {

  url: string = "http://217.13.111.90"
  destinations: Destination[] = []
  destination: Destination = new Destination()
  groups: Group[] = []
  groupsname: Group[] = []
  people: People = new People()
  peoples: People[] = []
  images: string[] = []
  points: any | null = null
  peoplepoints: any = null

  constructor(private http: HttpClient) {}

  getDestinations() {
    const token = localStorage.getItem("token")
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return new Promise<void>((resolve, reject) => {
      this.http.get<Destination[]>(this.url+"/destionations", { headers: header}).subscribe({
          next: (v) => { 
            this.destinations = v
          resolve()
        }, error: (e) => {
          reject(e)
        }
      })
    })
  }

  getDestination(id: number) {
    const token = localStorage.getItem("token")
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return new Promise<void>((resolve, reject) => {
      this.http.get<Destination[]>(this.url+`/destionation/${id}`, { headers: header}).subscribe({
          next: (v) => { 
            this.destination = v[0]
            resolve()
        }, error: (e) => {
          reject(e)
        }
      })
    })
  }

  getGroups() {
    const token = localStorage.getItem("token")
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return new Promise<void>((resolve, reject) => {
      this.http.get<Group[]>(this.url+"/groups", { headers: header}).subscribe({
          next: (v) => { 
            this.groups = v
          resolve()
        }, error: (e) => {
          reject(e)
        }
      })
    })
  }

  getGroupsName() {
    const token = localStorage.getItem("token")
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return new Promise<void>((resolve, reject) => {
      this.http.get<Group[]>(this.url+"/groupsname", { headers: header}).subscribe({
          next: (v) => { 
            this.groupsname = v
          resolve()
        }, error: (e) => {
          reject(e)
        }
      })
    })
  }

  getNames() {
    const token = localStorage.getItem("token")
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return new Promise<void>((resolve, reject) => {
      this.http.get<People[]>(this.url+"/names", { headers: header}).subscribe({
          next: (v) => { 
            this.peoples = v
          resolve()
        }, error: (e) => {
          reject(e)
        }
      })
    })
  }

  getPeople() {
    const name = localStorage.getItem("user")
    const token = localStorage.getItem("token")
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return new Promise<void>((resolve, reject) => {
      this.http.post<People>(this.url+"/people", {name: name}, { headers: header}).subscribe({
          next: (v) => { 
            this.people = v
          resolve()
        }, error: (e) => {
          reject(e)
        }
      })
    })
  }

  createTour(formData: FormData) {
    const token = localStorage.getItem("token")
    const header = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return new Promise<void>((resolve, reject) => {
      this.http.post<void>(this.url+"/tours", formData,{ headers: header}).subscribe({
          next: (v) => { 
          resolve()
        }, error: (e) => {
          reject(e)
        }
      })
    })
  }

  getDestinationImages(id: number) {
    return new Promise<void>((resolve, reject) => {
      this.http.get<any>(this.url+`/destinationimages/${id}`).subscribe({
        next: (v) => {
          this.images.length = 0
          for(let i = 0; i < v.length; i++) {
            this.images.push(v[i].Tourimage)
          }
          resolve()
        }, error: (err) => {
          reject(err)
        }
      })
    })
  }

  getGrouPoints() {
    const token = localStorage.getItem("token")
    const header = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return new Promise<void>((resolve, reject) => {
      this.http.get<any>(this.url+`/grouppoints`, { headers: header}).subscribe({
        next: (v) => {
          this.points = v
          resolve()
        }, error: (err) => {
          reject(err)
        }
      })
    })
  }

  getPeoplesPoints() {
    const token = localStorage.getItem("token")
    const header = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return new Promise<void>((resolve, reject) => {
      this.http.get<any>(this.url+`/peoplespoints`, { headers: header}).subscribe({
        next: (v) => {
          this.peoplepoints = v
          resolve()
        }, error: (err) => {
          reject(err)
        }
      })
    })
  }
}