import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StripeCardNumberComponent, StripeService } from 'ngx-stripe';
import { ToastrService } from 'ngx-toastr';
import { Observable, switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/events.service';
import { HttpClient } from '@angular/common/http';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
  StripePaymentElementOptions,
  PaymentIntent,
} from '@stripe/stripe-js';

import { environment } from 'src/environments/environment';
import * as moment from 'moment';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {
  eventId: any;
  eventDetails: any;
  registrationDetailErr: boolean = false;
  registrationDetail: any = {
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    martialStatus: '',
    gender: '',
    otherProfession: '',
    residentialStatus: '',
    ethnicBackground: '',
    city: '',
    country: '',
    otherCountry: '',
    state: '',
    zipCode: '',
    phone: '',
    cellPhone: '',
    dateOfBirth: '',
    parentFirstName: '',
    parentLastName: '',
    relationship: '',
    registrationCategoryId: '',
    educationLevelId: '',
    professionId: '',
    seatingGroupId: '',
  };
  registrationCategoryId: any;
  registrationCategoryDetail: any;
  registrationCategoryPrice: any;
  acknowledgment: any;

  @ViewChild(StripeCardNumberComponent)
  card!: StripeCardNumberComponent;

  cardHolderName: string = '';
  paymentProcessing: boolean = false;

  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: false,
    },
  };

  cardOptions: StripeCardElementOptions = {
    classes: {
      base: 'form-control',
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
    appearance: {
      theme: 'flat',
    },
  };

  seatsAvailable: boolean = true;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastr: ToastrService,
    private eventService: EventService,
    private stripeService: StripeService,
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.eventService.getEventId().subscribe((data: any) => {
      this.eventId = data;
    });

    this.eventService.getEventDetails().subscribe((data: any) => {
      this.eventDetails = data;
    });

    this.eventService.getContactDetails().subscribe((data: any) => {
      if (data) {
        this.registrationCategoryId = data.registrationCategoryId;
        this.registrationDetail = data;

        const gender = this.registrationDetail.gender;
        if (gender == 'Male') this.checkGenderSeatsAvailability('Male');
        if (gender == 'Female') this.checkGenderSeatsAvailability('Female');
      }
    });
    this.getCategory();
    this.checkContactDetails();
  }

  checkGenderSeatsAvailability(gender: string) {
    const data = {
      path: 'seatingGroup/detail',
      payload: {
        gender: gender,
      },
    };
    this.apiService.postRequest(data).subscribe((response) => {
      const seatingGroup = response.data;
      if (seatingGroup.length == 0) {
        this.seatsAvailable = false;
        console.log(gender, 'Seats Not Available');
      } else {
        this.seatsAvailable = true;
        console.log(gender, 'Seats Available');
      }
    });
  }

  acknowledgeStatement(event: any) {
    console.log(event.target.checked, this.acknowledgment);
  }

  getCategory() {
    let data = {
      path: 'category/detail',
      payload: { categoryId: this.registrationCategoryId },
    };

    this.apiService.postRequest(data).subscribe((data: any) => {
      this.registrationCategoryDetail = data.data;
      this.registrationCategoryPrice = data.data.price;
    });
  }

  calculateAge(birthDate: any) {
    const today = moment();
    const birth = moment(birthDate, 'YYYY-MM-DD');

    // Calculate age using moment
    const age = today.diff(birth, 'years');

    // Check if the birthday has occurred this year
    const hasBirthdayPassed = today.isAfter(birth.clone().add(age, 'years'));

    return hasBirthdayPassed ? age : age - 1;
  }

  checkContactDetails() {
    const age = this.calculateAge(this.registrationDetail.dateOfBirth);

    let registrationDetailsErr = false;
    var fieldName = '';
    var errMsg =
      'Please complete all the necessary fields on the registration form.';

    if (age > 45) {
      fieldName = 'Date of Birth';
      registrationDetailsErr = true;
      errMsg = 'People aged 46 and older cannot register.';
    } else if (this.registrationDetail.firstName == '') {
      fieldName = 'First Name';
      registrationDetailsErr = true;
    } else if (this.registrationDetail.lastName == '') {
      fieldName = 'Last Name';
      registrationDetailsErr = true;
    } else if (this.registrationDetail.martialStatus == '') {
      fieldName = 'Martial Status';
      registrationDetailsErr = true;
    } else if (this.registrationDetail.gender == '') {
      fieldName = 'Gender';
      registrationDetailsErr = true;
    } else if (
      this.registrationDetail.seatingGroupId == '' ||
      this.registrationDetail.seatingGroupId == '0'
    ) {
      fieldName = 'Seating Group';
      registrationDetailsErr = true;
    } else if (this.registrationDetail.professionId == '') {
      fieldName = 'Profession';
      registrationDetailsErr = true;
    } else if (this.registrationDetail.educationLevelId == '') {
      fieldName = 'Education Level';
      registrationDetailsErr = true;
    } else if (this.registrationDetail.residentialStatus == '') {
      fieldName = 'Residential Status';
      registrationDetailsErr = true;
    } else if (this.registrationDetail.ethnicBackground == '') {
      fieldName = 'Ethnic Background';
      registrationDetailsErr = true;
    } else if (this.registrationDetail.address == '') {
      fieldName = 'Address';
      registrationDetailsErr = true;
    } else if (this.registrationDetail.city == '') {
      fieldName = 'City';
      registrationDetailsErr = true;
    } else if (this.registrationDetail.country == '') {
      fieldName = 'Country';
      registrationDetailsErr = true;
    } else if (this.registrationDetail.state == '') {
      fieldName = 'State';
      registrationDetailsErr = true;
    } else if (this.registrationDetail.zipCode == '') {
      fieldName = 'Zipcode';
      registrationDetailsErr = true;
    } else if (
      this.registrationDetail.email == '' ||
      !this.registrationDetail.email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      fieldName = 'Email';
      registrationDetailsErr = true;
      errMsg = "The email you entered isn't in the right format.";
    } else if (this.registrationDetail.phone == '') {
      fieldName = 'Phone';
      registrationDetailsErr = true;
    } else if (this.registrationDetail.dateOfBirth == '') {
      fieldName = 'Date of Birth';
      registrationDetailsErr = true;
    } else if (this.registrationDetail.registrationCategoryId == '') {
      fieldName = 'Registration Category';
      registrationDetailsErr = true;
    }

    if (registrationDetailsErr) {
      this.registrationDetailErr = true;
      this.toastr.error(errMsg);
    } else {
      this.registrationDetailErr = false;
    }
  }

  confirmBooking(paymentIntentId: any) {
    if (!this.registrationDetail) {
      this.toastr.error('Kindly enter contact details');
    } else {
      const data = {
        path: 'booking/create',
        payload: {
          eventId: this.eventId,
          status: 'Success',
          totalPayment: this.registrationCategoryDetail.price,
          registrationMethod: 'Online',
          paymentMethod: 'Card',
          referenceNo: paymentIntentId,

          firstName: this.registrationDetail.firstName,
          lastName: this.registrationDetail.lastName,
          martialStatus: this.registrationDetail.martialStatus,
          gender: this.registrationDetail.gender,
          seatingGroupId:
            this.registrationDetail.seatingGroupId == 0
              ? 1
              : this.registrationDetail.seatingGroupId,
          professionId: this.registrationDetail.professionId,
          otherProfession: this.registrationDetail.otherProfession,
          educationLevelId: this.registrationDetail.educationLevelId,
          educationLevelOther: '',
          residentialStatus: this.registrationDetail.residentialStatus,
          ethnicBackground: this.registrationDetail.ethnicBackground,
          address: this.registrationDetail.address,
          city: this.registrationDetail.city,
          country: this.registrationDetail.country,
          otherCountry: this.registrationDetail.countryOther,
          state: this.registrationDetail.state,
          otherState: this.registrationDetail.otherState,
          zipCode: this.registrationDetail.zipCode,
          email: this.registrationDetail.email,
          phone: this.registrationDetail.phone,
          cellPhone: this.registrationDetail.cellPhone,
          dateOfBirth: this.registrationDetail.dateOfBirth,

          categoryId: this.registrationDetail.registrationCategoryId,

          parentFirstName: '',
          parentLastName: '',
          relationship: '',
        },
      };
      if (this.registrationDetail.educationLevelId == '6') {
        data.payload.educationLevelOther =
          this.registrationDetail.educationLevelOther;
      }
      if (this.registrationDetail.residentialStatus == 'Other') {
        data.payload.residentialStatus =
          this.registrationDetail.residentialStatusOther;
      }
      if (
        this.registrationDetail.registrationCategoryId == '2' ||
        this.registrationDetail.registrationCategoryId == '4' ||
        this.registrationDetail.registrationCategoryId == '6'
      ) {
        data.payload.parentFirstName = this.registrationDetail.parentFirstName;
        data.payload.parentLastName = this.registrationDetail.parentLastName;
        data.payload.relationship = this.registrationDetail.relationship;
      }

      this.apiService.postRequest(data).subscribe({
        next: (response) => {
          const data = response.data;

          if (data.status == 'Success') {
            this.toastr.success('Booking Completed');
            this.router.navigate(['/confirmation', data.id]);
          } else {
            this.toastr.success('Something went wrong, please try again later');
          }
          this.paymentProcessing = false;
        },
        error: (err) => {
          this.paymentProcessing = false;
          console.error('An error occurred :', err);
        },
      });
    }
  }

  pay(): void {
    this.paymentProcessing = true;
    let amount = this.registrationCategoryPrice;
    this.createPaymentIntent(amount)
      .pipe(
        switchMap((pi: any) =>
          this.stripeService.confirmCardPayment(pi.clientSecret, {
            payment_method: {
              card: this.card.element,
              billing_details: {
                name: this.cardHolderName, // Cardholder's name
                email: this.registrationDetail.email,
                phone: this.registrationDetail.phone,
                address: {
                  line1: this.registrationDetail.address,
                  city: this.registrationDetail.city,
                  postal_code: this.registrationDetail.zipcode,
                },
              },
            },
          })
        )
      )
      .subscribe((result: any) => {
        if (result.error) {
          this.toastr.error(result.error.message, 'Error!');
          this.paymentProcessing = false;
        } else {
          // The payment has been processed!
          const paymentIntent = result.paymentIntent;
          if (paymentIntent.status === 'succeeded') {
            const paymentIntentId = paymentIntent.id;
            this.confirmBooking(paymentIntentId);
          }
        }
      });
  }

  createPaymentIntent(amount: number): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(
      `${environment.ApiBaseURL}auth/stripe/create-payment-intent`,
      { amount }
    );
  }
}
