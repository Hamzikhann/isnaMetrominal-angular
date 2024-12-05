import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './modules/welcome/welcome.component';
import { PaymentComponent } from './modules/payment/payment.component';
import { ConfirmationComponent } from './modules/confirmation/confirmation.component';
import { ModulesComponent } from './modules/modules.component';
import { AdminComponent } from './modules/admin/admin.component';
import { RegistrationComponent } from './modules/registration/registration.component';
const routes: Routes = [
  {
    path: '',
    component: ModulesComponent,
    children: [
      { path: '', component: WelcomeComponent },
      { path: 'registration', component: RegistrationComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'confirmation/:id', component: ConfirmationComponent },
      { path: 'admin', component: AdminComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
