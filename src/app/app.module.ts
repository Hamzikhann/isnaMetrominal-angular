import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModulesComponent } from './modules/modules.component';
import { WelcomeComponent } from './modules/welcome/welcome.component';
import { RegistrationComponent } from './modules/registration/registration.component';
import { AdminComponent } from './modules/admin/admin.component';
import { ConfirmationComponent } from './modules/confirmation/confirmation.component';
import { PaymentComponent } from './modules/payment/payment.component';

///////////////////////////
///////////////////////////

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxStripeModule } from 'ngx-stripe';
import { DataTablesModule } from 'angular-datatables';

import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
// import { IndexComponent } from './modules/index.component';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    ModulesComponent,
    WelcomeComponent,
    RegistrationComponent,
    AdminComponent,
    ConfirmationComponent,
    PaymentComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    PdfViewerModule,
    DataTablesModule,
    NgxStripeModule.forRoot(environment.stripe.publicKey),
    ToastrModule.forRoot({
      timeOut: 6000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
