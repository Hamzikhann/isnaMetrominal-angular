import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { EventService } from 'src/app/services/events.service';
import { HttpClient } from '@angular/common/http';

import {
  StripeCardElementOptions,
  StripeElementsOptions,
  StripePaymentElementOptions,
  PaymentIntent,
} from '@stripe/stripe-js';

import { environment } from 'src/environments/environment';
import { StripeCardNumberComponent, StripeService } from 'ngx-stripe';
import { Observable, switchMap } from 'rxjs';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  countries: any = ['United States', 'Canada', 'Other'];
  selectedRegistration: any;
  registrations: any;
  dtOptions: any;
  userLoggedIn: boolean = false;
  user: any = {
    email: '',
    password: '',
    token: '',
  };
  condition: boolean = false;
  seatingGroupId: any = '0';
  seatingGroup: any = [];
  seatingGroupArray: any = [];

  educationLevelId: any = '0';
  educationLevel: any = [];

  professionId: any = '0';
  professions: any = [];

  categoryId: any = '0';
  categories: any = [];
  registrationDetailsErr: boolean = false;
  isPayment: boolean = false;

  maleIds: any = [];
  femaleIds: any = [];
  maritalStatuses: any = [
    'Single',
    // 'Married',
    'Divorced',
    'Widowed',
    // 'Separated',
  ];

  residentialStatuses: any = [
    'Own Home',
    'Renting',
    'Living with Family',
    'Student Housing',
    'Temporary Accommodation',
    'Homeless',
    'Other',
  ];

  statesUS: any = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming',
  ];

  statesCanada: any = [
    'Alberta',
    'British Columbia',
    'Manitoba',
    'New Brunswick',
    'Newfoundland and Labrador',
    'Nova Scotia',
    'Ontario',
    'Prince Edward Island',
    'Quebec',
    'Saskatchewan',
    'Northwest Territories',
    'Nunavut',
    'Yukon',
  ];

  // seatingGroupId: any;
  // seatingGroup: any = [];
  seatingGroupErr: boolean = false;

  // educationLevelId: any;
  // educationLevel: any = [];

  // professionId: any;
  // professions: any = [];
  eventId: any;
  eventDetails: any;

  registrationCategoryId: any;
  // categories: any = [];

  registration: any = {
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    martialStatus: '',
    gender: '',
    otherProfession: '',
    residentialStatus: '',
    residentialStatusOther: '',
    ethnicBackground: '',
    city: '',
    country: '',
    countryOther: '',
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
    educationLevelOther: '',
    professionId: '',
    seatingGroupId: '',
  };

  genderMaleSeatsAvailable: boolean = true;
  genderFemaleSeatsAvailable: boolean = true;
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
  registrationCategoryDetail: any;
  registrationCategoryPrice: any;
  acknowledgment: any;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private eventService: EventService,
    private stripeService: StripeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      dom: 'Bfrtip',
      buttons: [
        {
          extend: 'excel',
          text: 'Export as Excel',
          title: 'ISNA Metrimonial 2024 - Registrations',
          exportOptions: {
            columns: ':not(:last-child)',
          },
        },
      ],
      aaSorting: [],
      columnDefs: [
        {
          targets: [1],
          render: (data: any, type: any, full: any, meta: any) => {
            if (type === 'sort') {
              return moment(data, 'MMM Do, h:mm A').unix();
            }
            return data;
          },
        },
      ],
    };

    // this.getBookings();

    // let data = {
    //   path: 'dashboard/list',
    // };
    // this.apiService.postRequest(data).subscribe((data: any) => {
    //   this.categories = data.data.categories;
    //   this.professions = data.data.profession;
    //   this.educationLevel = data.data.educationLevel;
    //   this.seatingGroup = data.data.seatingGroup;
    //   this.seatingGroupArray = this.seatingGroup;

    //   this.seatingGroup.forEach((e: any, index: any) => {
    //     if (e.maleStatus == 'Y') {
    //       this.seatingGroupArray[index].malechecked = true;
    //     }
    //     if (e.maleStatus == 'N') {
    //       this.seatingGroupArray[index].malechecked = false;
    //     }
    //     if (e.femaleStatus == 'Y') {
    //       this.seatingGroupArray[index].femalechecked = true;
    //     }
    //     if (e.femaleStatus == 'N') {
    //       this.seatingGroupArray[index].femalechecked = false;
    //     }
    //   });
    //   console.log(this.seatingGroupArray);
    // });
  }

  login() {
    const data = {
      path: 'auth/login',
      payload: {
        email: this.user.email,
        password: this.user.password,
      },
    };
    this.apiService.postRequest(data).subscribe((response) => {
      const data = response.data;
      const token = response.token;

      if (data.user && data.user.id) {
        this.user.token = token;
        this.userLoggedIn = true;

        this.authService.setUserId(data.user.id);
        this.authService.setUser(data.user);
        this.authService.setToken(token);
        this.getBookings();
        this.getDropdownList();
      }
    });
  }

  getBookings() {
    this.registrations = [];
    const data = {
      path: 'booking/list',
      payload: {},
    };
    this.apiService.postRequest(data).subscribe((response) => {
      this.registrations = response.data;

      this.registrations.forEach((element: any) => {
        element.bookingId = 1000 + element.id;
        element.datetime = moment(element.createdAt).format('MMM Do, h:mm A');
        element.registration.age = this.calculateAge(
          element.registration.dateOfBirth
        );
      });
    });
  }

  // getInfo(){
  //   let data = {
  //     path: 'dashboard/list',
  //   };
  //   this.apiService.postRequest(data).subscribe((data: any) => {
  //     this.categories = data.data.categories;
  //     this.professions = data.data.profession;
  //     this.educationLevel = data.data.educationLevel;
  //     // this.seatingGroup = data.data.seatingGroup;
  //   });
  //   this.eventService.getContactDetails().subscribe((data: any) => {
  //     if (data) {
  //       this.registration = data;
  //       if (this.registration.gender) {
  //         if (this.seatingGroup.length == 0) this.getGenderSeatingGroup();
  //       }

  //       this.seatingGroupId = this.registration.seatingGroupId;
  //       this.professionId = this.registration.professionId;
  //       this.educationLevelId = this.registration.educationLevelId;
  //       this.registrationCategoryId = this.registration.registrationCategoryId;
  //     }
  //   });
  // }

  updateContactData() {
    this.eventService.setContactDetails(this.registration);
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

  getDropdownList() {
    const data = {
      path: 'dashboard/list',
      payload: {},
    };
    this.apiService.postRequest(data).subscribe((response) => {
      this.seatingGroup = response.data.seatingGroup;
      this.educationLevel = response.data.educationLevel;
      this.professions = response.data.profession;
      this.categories = response.data.categories;
    });
  }

  onRefund(booking: any) {
    const data = {
      path: 'booking/refund',
      payload: {
        referenceNo: booking.bookingPayments[0].referenceNo,
      },
    };
    this.apiService.postRequest(data).subscribe((response) => {
      this.toastr.info(response.message);
      this.getBookings();
    });
  }

  onUpdate(booking: any) {
    const data = {
      path: 'registration/update',
      payload: {
        id: booking.id,
        bookingId: booking.bookingId,
        firstName: booking.registration.firstName,
        lastName: booking.registration.lastName,
        martialStatus: booking.registration.martialStatus,
        gender: booking.registration.gender,
        seatingGroupId: this.seatingGroupId,
        categoryId: this.categoryId,
        professionId: this.professionId,
        otherProfession: booking.registration.otherProfession,
        educationLevelId: this.educationLevelId,
        educationLevelOther: booking.registration.educationLevelOther,
        residentialStatus: booking.registration.residentialStatus,
        ethnicBackground: booking.registration.ethnicBackground,
        address: booking.registration.address,
        city: booking.registration.city,
        country: booking.registration.country,
        otherCountry: booking.registration.otherCountry,
        state: booking.registration.state,
        otherState: booking.registration.otherState,
        zipCode: booking.registration.zipCode,
        email: booking.registration.email,
        phone: booking.registration.phone,
        cellPhone: booking.registration.cellPhone,
        dateOfBirth: booking.registration.dateOfBirth,

        parentFirstName: booking.registration.parentFirstName,
        parentLastName: booking.registration.parentLastName,
        relationship: booking.registration.relationship,
      },
    };

    this.apiService.postRequest(data).subscribe((response) => {
      this.toastr.info(response.message);
      this.getBookings();
    });
  }
  setRegistrationCategory() {
    this.registration.registrationCategoryId = this.registrationCategoryId;
    this.eventService.setContactDetails(this.registration);
  }
  setProfession(profession: any) {
    this.professionId = profession?.value;
    this.eventService.setContactDetails(this.registration);
  }
  setEducation(education: any) {
    this.educationLevelId = education?.value;
    this.eventService.setContactDetails(this.registration);
  }
  setSeating(seating: any) {
    this.seatingGroupId = seating?.value;
    this.eventService.setContactDetails(this.registration);
  }
  onSelectedBooking(booking: any) {
    this.selectedRegistration = {
      id: booking.id,
      bookingId: booking.bookingId,
      registration: {
        address: booking.registration.address,
        dateOfBirth: booking.registration.dateOfBirth,

        firstName: booking.registration.firstName,
        lastName: booking.registration.lastName,
        email: booking.registration.email,

        phone: booking.registration.phone,
        cellPhone: booking.registration.cellPhone,
        fax: booking.registration.fax,

        ethnicBackground: booking.registration.ethnicBackground,
        city: booking.registration.city,
        otherCountry: booking.registration.otherCountry,
        state: booking.registration.state,
        otherState: booking.registration.otherState,
        zipCode: booking.registration.zipCode,

        country: booking.registration.country,
        otherProfession: booking.registration.otherProfession,

        gender: booking.registration.gender,
        martialStatus: booking.registration.martialStatus,
        parentFirstName: booking.registration.parentFirstName,
        parentLastName: booking.registration.parentLastName,
        relationship: booking.registration.relationship,
        residentialStatus: booking.registration.residentialStatus,
        seatingGroup: booking.registration.seatingGroup.title,
        profession: booking.registration.profession.title,
        educationLevel: booking.registration.educationLevel.title,
        educationLevelOther: booking.registration.educationLevelOther,
        category: booking.registration.category.title,
      },
      bookingPayments: booking.bookingPayments,
      status: booking.status,
    };
    // this.seatingGroupId=booking.registration.seatingGroup.title
    // this.categoryId
    // this.educationLevel
    // this.professionId=booking.registration.profession.title
  }

  edit() {
    this.condition = true;
  }

  save() {
    this.condition = false;
    // console.log('male', this.maleIds);
    // console.log('female', this.femaleIds);
    // const lastMaleOccurrences = this.getLastOccurrences(this.maleIds, 'maleid');
    // const lastFeMaleOccurrences = this.getLastOccurrences(
    //   this.femaleIds,
    //   'femaleid'
    // );
    // console.log(this.seatingGroupArray);
    const data = {
      path: 'seatingGroup/status/update',
      payload: {
        seatingGroup: this.seatingGroupArray,
      },
    };

    this.apiService.postRequest(data).subscribe((response) => {});
  }
  getLastOccurrences(ids: any[], idKey: string): any[] {
    const lastOccurrenceMap = new Map<number, any>();

    ids.forEach((item) => {
      const id = item[idKey];
      if (id !== undefined) {
        lastOccurrenceMap.set(id, item);
      }
    });

    return Array.from(lastOccurrenceMap.values());
  }
  onCheckboxChangeMale(event: Event, ageGroup: any) {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;

    if (!isChecked) {
      this.seatingGroupArray.forEach((e: any) => {
        if (ageGroup.id == e.id) {
          e.malechecked = false;
        }
      });
    } else {
      this.seatingGroupArray.forEach((e: any) => {
        if (ageGroup.id == e.id) {
          e.malechecked = true;
        }
      });
    }
    // let maleObj = {
    //   isChecked,
    //   maleid: ageGroup.id,
    // };
    // this.maleIds.push(maleObj);
  }
  onCheckboxChangeFemale(event: Event, ageGroup: any) {
    // console.log(ageGroup, event);
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    if (!isChecked) {
      this.seatingGroupArray.forEach((e: any) => {
        if (ageGroup.id == e.id) {
          e.femalechecked = false;
        }
      });
    } else {
      this.seatingGroupArray.forEach((e: any) => {
        if (ageGroup.id == e.id) {
          e.femalechecked = true;
        }
      });
    }
    // let femaleObj = {
    //   isChecked,
    //   femaleid: ageGroup.id,
    // };

    // this.femaleIds.push(femaleObj);
  }
  resetSelectedBooking() {
    this.selectedRegistration = null;
  }

  checkContactDetails() {
    const age = this.calculateAge(this.registration.dateOfBirth);

    this.registrationDetailsErr = false;
    var fieldName = '';
    var errMsg =
      'Please complete all the necessary fields on the registration form.';

    if (age > 45) {
      fieldName = 'Date of Birth';
      this.registrationDetailsErr = true;
      errMsg = 'People aged 46 and older cannot register.';
    } else if (this.registration.firstName == '') {
      fieldName = 'First Name';
      this.registrationDetailsErr = true;
    } else if (this.registration.lastName == '') {
      fieldName = 'Last Name';
      this.registrationDetailsErr = true;
    } else if (this.registration.martialStatus == '') {
      fieldName = 'Martial Status';
      this.registrationDetailsErr = true;
    } else if (this.registration.gender == '') {
      fieldName = 'Gender';
      this.registrationDetailsErr = true;
    } else if (this.registration.seatingGroupId == '') {
      fieldName = 'Seating Group';
      this.registrationDetailsErr = true;
    } else if (this.registration.professionId == '') {
      fieldName = 'Profession';
      this.registrationDetailsErr = true;
    } else if (this.registration.educationLevelId == '') {
      fieldName = 'Education Level';
      this.registrationDetailsErr = true;
    } else if (this.registration.residentialStatus == '') {
      fieldName = 'Residential Status';
      this.registrationDetailsErr = true;
    } else if (this.registration.ethnicBackground == '') {
      fieldName = 'Ethnic Background';
      this.registrationDetailsErr = true;
    } else if (this.registration.address == '') {
      fieldName = 'Address';
      this.registrationDetailsErr = true;
    } else if (this.registration.city == '') {
      fieldName = 'City';
      this.registrationDetailsErr = true;
    } else if (this.registration.country == '') {
      fieldName = 'Country';
      this.registrationDetailsErr = true;
    } else if (this.registration.state == '' && !this.registration.otherState) {
      fieldName = 'State';
      this.registrationDetailsErr = true;
    } else if (this.registration.zipCode == '') {
      fieldName = 'Zipcode';
      this.registrationDetailsErr = true;
    } else if (
      this.registration.email == '' ||
      !this.registration.email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      fieldName = 'Email';
      this.registrationDetailsErr = true;
      errMsg = "The email you entered isn't in the right format.";
    } else if (this.registration.phone == '') {
      fieldName = 'Phone';
      this.registrationDetailsErr = true;
    } else if (this.registration.dateOfBirth == '') {
      fieldName = 'Date of Birth';
      this.registrationDetailsErr = true;
    } else if (this.registration.registrationCategoryId == '') {
      fieldName = 'Registration Category';
      this.registrationDetailsErr = true;
    }

    if (this.registrationDetailsErr) {
      this.toastr.error(errMsg, fieldName);
    } else {
      this.setContactData();
    }
  }

  setContactData() {
    // this.eventService.setContactDetails(this.registration);
    this.isPayment = true;
    this.getCategory();
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

    this.eventService.getEventId().subscribe((data: any) => {
      this.eventId = data;
    });

    this.eventService.getEventDetails().subscribe((data: any) => {
      this.eventDetails = data;
    });
  }

  confirmBooking(paymentIntentId: any) {
    if (!this.registration) {
      this.toastr.error('Kindly enter contact details');
    } else {
      const data = {
        path: 'booking/create/admin',
        payload: {
          eventId: '1',
          status: 'Success',
          totalPayment: this.registrationCategoryDetail.price,
          registrationMethod: 'Online',
          paymentMethod: 'Card',
          referenceNo: paymentIntentId,

          firstName: this.registration.firstName,
          lastName: this.registration.lastName,
          martialStatus: this.registration.martialStatus,
          gender: this.registration.gender,
          seatingGroupId:
            this.registration.seatingGroupId == 0
              ? 1
              : this.registration.seatingGroupId,
          professionId: this.registration.professionId,
          otherProfession: this.registration.otherProfession,
          educationLevelId: this.registration.educationLevelId,
          educationLevelOther: '',
          residentialStatus: this.registration.residentialStatus,
          ethnicBackground: this.registration.ethnicBackground,
          address: this.registration.address,
          city: this.registration.city,
          country: this.registration.country,
          otherCountry: this.registration.countryOther,
          state: this.registration.state,
          otherState: this.registration.otherState,
          zipCode: this.registration.zipCode,
          email: this.registration.email,
          phone: this.registration.phone,
          cellPhone: this.registration.cellPhone,
          dateOfBirth: this.registration.dateOfBirth,

          categoryId: this.registration.registrationCategoryId,

          parentFirstName: '',
          parentLastName: '',
          relationship: '',
        },
      };
      if (this.registration.educationLevelId == '6') {
        data.payload.educationLevelOther =
          this.registration.educationLevelOther;
      }
      if (this.registration.residentialStatus == 'Other') {
        data.payload.residentialStatus =
          this.registration.residentialStatusOther;
      }
      if (
        this.registration.registrationCategoryId == '2' ||
        this.registration.registrationCategoryId == '4' ||
        this.registration.registrationCategoryId == '6'
      ) {
        data.payload.parentFirstName = this.registration.parentFirstName;
        data.payload.parentLastName = this.registration.parentLastName;
        data.payload.relationship = this.registration.relationship;
      }

      this.apiService.postRequest(data).subscribe({
        next: (response) => {
          const data = response.data;

          if (data.status == 'Success') {
            this.toastr.success('Booking Completed');
            this.isPayment = false;
            this.reset();
            this.getBookings();
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
                email: this.registration.email,
                phone: this.registration.phone,
                address: {
                  line1: this.registration.address,
                  city: this.registration.city,
                  postal_code: this.registration.zipcode,
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
  acknowledgeStatement(event: any) {
    console.log(event.target.checked, this.acknowledgment);
  }

  reset = () => {
    this.registration = {
      firstName: '',
      lastName: '',
      address: '',
      email: '',
      martialStatus: '',
      gender: '',
      otherProfession: '',
      residentialStatus: '',
      residentialStatusOther: '',
      ethnicBackground: '',
      city: '',
      country: '',
      countryOther: '',
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
      educationLevelOther: '',
      professionId: '',
      seatingGroupId: '',
    };
  };
}
