import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ISNA-Metrimonial App';
  footerShow: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.footerShow = true;
    }, 2500);
  }
}
