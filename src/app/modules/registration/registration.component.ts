import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/events.service';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  countries: any = ['United States', 'Canada', 'Other'];

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

  maritalStatuses: any = ['Single', 'Divorced', 'Widowed'];

  residentialStatuses: any = [
    'Own Home',
    'Renting',
    'Living with Family',
    'Student Housing',
    'Temporary Accommodation',
    'Homeless',
    'Other',
  ];

  seatingGroupId: any;
  seatingGroup: any = [];
  seatingGroupErr: boolean = false;

  educationLevelId: any;
  educationLevel: any = [];

  professionId: any;
  professions: any = [];

  registrationCategoryId: any;
  categories: any = [];

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

  constructor(
    private eventService: EventService,
    private router: Router,
    private toastr: ToastrService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    let data = {
      path: 'dashboard/list',
    };
    this.apiService.postRequest(data).subscribe((data: any) => {
      this.categories = data.data.categories;
      this.professions = data.data.profession;
      this.educationLevel = data.data.educationLevel;
      // this.seatingGroup = data.data.seatingGroup;
    });
    this.eventService.getContactDetails().subscribe((data: any) => {
      if (data) {
        this.registration = data;
        if (this.registration.gender) {
          if (this.seatingGroup.length == 0) this.getGenderSeatingGroup();
        }

        this.seatingGroupId = this.registration.seatingGroupId;
        this.professionId = this.registration.professionId;
        this.educationLevelId = this.registration.educationLevelId;
        this.registrationCategoryId = this.registration.registrationCategoryId;
      }
    });

    this.checkGenderSeatsAvailability('Male');
    this.checkGenderSeatsAvailability('Female');
  }

  updateContactData() {
    this.eventService.setContactDetails(this.registration);
  }

  getGenderSeatingGroup() {
    const data = {
      path: 'seatingGroup/detail',
      payload: {
        gender: this.registration.gender,
      },
    };
    this.apiService.postRequest(data).subscribe((response) => {
      this.seatingGroup = response.data;
    });
  }

  onChangeGender(event: any) {
    this.seatingGroupErr = false;
    const data = {
      path: 'seatingGroup/detail',
      payload: {
        gender: this.registration.gender,
      },
    };
    this.apiService.postRequest(data).subscribe((response) => {
      this.seatingGroup = response.data;

      if (this.seatingGroup.length == 0) {
        event.target.checked = false;
        event.target.disabled = true;
        this.seatingGroupErr = true;

        if (this.registration.gender == 'Male')
          this.genderMaleSeatsAvailable = false;
        if (this.registration.gender == 'Female')
          this.genderFemaleSeatsAvailable = false;
      }
    });

    this.eventService.setContactDetails(this.registration);
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
        if (gender == 'Male') this.genderMaleSeatsAvailable = false;
        if (gender == 'Female') this.genderFemaleSeatsAvailable = false;

        console.log(gender, 'Seats Not Available');
      } else {
        console.log(gender, 'Seats Available');
      }
    });
  }

  setContactData() {
    this.eventService.setContactDetails(this.registration);
    this.router.navigate(['/payment']);
  }

  setRegistrationCategory() {
    this.registration.registrationCategoryId = this.registrationCategoryId;
    this.eventService.setContactDetails(this.registration);
  }
  setProfession() {
    this.registration.professionId = this.professionId;
    this.eventService.setContactDetails(this.registration);
  }
  setEducation() {
    this.registration.educationLevelId = this.educationLevelId;
    this.eventService.setContactDetails(this.registration);
  }
  setSeating() {
    this.registration.seatingGroupId = this.seatingGroupId;
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

  checkContactDetails() {
    const age = this.calculateAge(this.registration.dateOfBirth);

    let registrationDetailsErr = false;
    var fieldName = '';
    var errMsg =
      'Please complete all the necessary fields on the registration form.';

    if (age > 45) {
      fieldName = 'Date of Birth';
      registrationDetailsErr = true;
      errMsg = 'People aged 46 and older cannot register.';
    } else if (this.registration.firstName == '') {
      fieldName = 'First Name';
      registrationDetailsErr = true;
    } else if (this.registration.lastName == '') {
      fieldName = 'Last Name';
      registrationDetailsErr = true;
    } else if (this.registration.martialStatus == '') {
      fieldName = 'Martial Status';
      registrationDetailsErr = true;
    } else if (this.registration.gender == '') {
      fieldName = 'Gender';
      registrationDetailsErr = true;
    } else if (this.registration.seatingGroupId == '') {
      fieldName = 'Seating Group';
      registrationDetailsErr = true;
    } else if (this.registration.professionId == '') {
      fieldName = 'Profession';
      registrationDetailsErr = true;
    } else if (this.registration.educationLevelId == '') {
      fieldName = 'Education Level';
      registrationDetailsErr = true;
    } else if (this.registration.residentialStatus == '') {
      fieldName = 'Residential Status';
      registrationDetailsErr = true;
    } else if (this.registration.ethnicBackground == '') {
      fieldName = 'Ethnic Background';
      registrationDetailsErr = true;
    } else if (this.registration.address == '') {
      fieldName = 'Address';
      registrationDetailsErr = true;
    } else if (this.registration.city == '') {
      fieldName = 'City';
      registrationDetailsErr = true;
    } else if (this.registration.country == '') {
      fieldName = 'Country';
      registrationDetailsErr = true;
    } else if (this.registration.state == '') {
      fieldName = 'State';
      registrationDetailsErr = true;
    } else if (this.registration.zipCode == '') {
      fieldName = 'Zipcode';
      registrationDetailsErr = true;
    } else if (
      this.registration.email == '' ||
      !this.registration.email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      fieldName = 'Email';
      registrationDetailsErr = true;
      errMsg = "The email you entered isn't in the right format.";
    } else if (this.registration.phone == '') {
      fieldName = 'Phone';
      registrationDetailsErr = true;
    } else if (this.registration.dateOfBirth == '') {
      fieldName = 'Date of Birth';
      registrationDetailsErr = true;
    } else if (this.registration.registrationCategoryId == '') {
      fieldName = 'Registration Category';
      registrationDetailsErr = true;
    }

    if (registrationDetailsErr) {
      this.toastr.error(errMsg);
    } else {
      this.setContactData();
    }
  }
}
