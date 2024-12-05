import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  eventId: any;
  eventDetails: any;
  contactDetails: any = [];
  boothsDetails: any;
  advertisementDetails: any = [];

  constructor() {
    this.eventId = new BehaviorSubject<any>(null);
    this.eventDetails = new BehaviorSubject<any>(null);
    this.contactDetails = new BehaviorSubject<any>(null);
    this.boothsDetails = new BehaviorSubject<any>(null);
    this.advertisementDetails = new BehaviorSubject<any>(null);
  }

  setEvent(event: any) {
    this.eventId.next(event.id);
    this.eventDetails.next(event);
  }
  getEventId() {
    return this.eventId.asObservable();
  }
  getEventDetails() {
    return this.eventDetails.asObservable();
  }

  setContactDetails(data: any) {
    this.contactDetails.next(data);
    localStorage.setItem('selectedContactDetails', JSON.stringify(data));
  }
  getContactDetails(): Observable<any> {
    return this.contactDetails.asObservable();
  }

  setBoothDetails(data: any) {
    this.boothsDetails.next(data);
    localStorage.setItem('selectedBooths', JSON.stringify(data));
  }
  getBoothDetails() {
    return this.boothsDetails.asObservable();
  }

  setAdvertisementDetails(data: any) {
    this.advertisementDetails.next(data);
    localStorage.setItem('selectedAdvertisement', JSON.stringify(data));
  }

  getAdvertisementDetails() {
    return this.advertisementDetails.asObservable();
  }
}
