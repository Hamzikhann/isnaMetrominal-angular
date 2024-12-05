import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  sections: any = {
    welcome: false,
    registration: false,
    payment: false,
    confirmation: false,
  };

  constructor(public router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {}

  showAlert() {
    this.toastr.error(
      'You are required to accept the exhibition contract before proceeding further.',
      'Attention!'
    );
  }
}
