import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { EventService } from '../services/events.service';

import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css'],
})
export class ModulesComponent {
  loading: boolean = false;
  event: any;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    if (
      !this.router.url.includes('assets') &&
      !this.router.url.includes('confirmation') &&
      !this.router.url.includes('admin')
    ) {
      localStorage.clear();
      this.router.navigate(['/']);
      this.getEventDetails();
    }
  }

  getEventDetails() {
    this.loading = true;
    const data = {
      path: 'event/detail',
    };
    this.apiService.postRequest(data).subscribe((data) => {
      this.event = data.data;
      if (this.event) {
        this.event.eventStartDate = moment(this.event.eventStartDate).format(
          'MMMM Do'
        );
        this.event.eventEndDate = moment(this.event.eventEndDate).format(
          'MMMM Do YYYY'
        );
      }
      this.eventService.setEvent(this.event);
      this.loading = false;
    });
  }
}
