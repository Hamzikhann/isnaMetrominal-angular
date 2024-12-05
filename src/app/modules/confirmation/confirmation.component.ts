import { Component } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { EventService } from 'src/app/services/events.service';
import * as moment from 'moment';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
})
export class ConfirmationComponent {
  loading: boolean = false;

  bookingId: any;
  eventId: any;
  eventDetails: any;
  registrationDetail: any;
  paymentDetails: any;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastr: ToastrService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.bookingId = params['id'];
      this.getBookingDetails();
    });
    this.clearData();
  }

  getBookingDetails() {
    this.loading = true;

    const data = {
      path: 'booking/detail',
      payload: {
        bookingId: this.bookingId,
      },
    };
    this.apiService.postRequest(data).subscribe((response: any) => {
      const bookingDetails = response.data;

      this.eventDetails = bookingDetails.event;
      if (this.eventDetails) {
        this.eventDetails.eventStartDate = moment(
          this.eventDetails.eventStartDate
        ).format('MMMM Do');
        this.eventDetails.eventEndDate = moment(
          this.eventDetails.eventEndDate
        ).format('MMMM Do YYYY');
      }

      this.registrationDetail = bookingDetails.registration;
      this.paymentDetails = bookingDetails.bookingPayments;
      if (this.paymentDetails[0]) {
        this.paymentDetails = this.paymentDetails[0];
      }

      this.autoDownloadPdf();
      this.loading = false;
    });
  }

  clearData() {
    localStorage.clear();
    this.eventService.setAdvertisementDetails(null);
    this.eventService.setBoothDetails(null);
    this.eventService.setContactDetails(null);
  }

  autoDownloadPdf() {
    setTimeout(() => {
      this.downloadPDF();
    }, 3000);
  }

  downloadPDF() {
    const element = document.getElementById('content');
    const elementSecond = document.getElementById('content2');
    if (element && elementSecond) {
      html2canvas(element).then((canvas) => {
        const pdf = new jspdf.jsPDF('p', 'mm', 'a4');

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 172;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const xPos = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
        const yPos = (pdf.internal.pageSize.getHeight() - imgHeight) / 2;

        pdf.addImage(imgData, 'PNG', xPos, 14, imgWidth, imgHeight);

        html2canvas(elementSecond).then((canvas2) => {
          pdf.addPage();

          const imgData2 = canvas2.toDataURL('image/png');
          const imgHeight2 = (canvas2.height * imgWidth) / canvas2.width;
          const xPos2 = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
          const yPos2 = (pdf.internal.pageSize.getHeight() - imgHeight2) / 2;

          pdf.addImage(imgData2, 'PNG', xPos2, 14, imgWidth, imgHeight2);

          pdf.save('isna-matrimonial-confirmation.pdf');
        });
      });
    }
  }
}
