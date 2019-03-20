import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PhoneNumberLoginPage } from './phone-number-login.page';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';

const routes: Routes = [
  {
    path: '',
    component: PhoneNumberLoginPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    InternationalPhoneNumberModule
  ],
  declarations: [PhoneNumberLoginPage]
})
export class PhoneNumberLoginPageModule {}
