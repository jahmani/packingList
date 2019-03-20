import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import * as firebase from "firebase";
import { parsePhoneNumberFromString, getExampleNumber } from 'libphonenumber-js/mobile';
import examples from 'libphonenumber-js/examples.mobile.json';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { isString } from 'util';

@Component({
  selector: 'app-phone-number-login',
  templateUrl: './phone-number-login.page.html',
  styleUrls: ['./phone-number-login.page.scss'],
})
export class PhoneNumberLoginPage implements OnInit {

  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  exampleNumber = "+962863925763";
  form;
  phoneNumber1;
  phoneNumber2;
  constructor(public fb: FormBuilder, public alertCtrl: AlertController) {
    this.exampleNumber = parsePhoneNumberFromString(this.exampleNumber).formatInternational();
    this.form = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.minLength(5), this.checkValidPhoneNumber]]
    });
  }
  ngOnInit() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }
  checkValidPhoneNumber(phoneNumberCtrl: FormControl) {
    const phoneNumber = phoneNumberCtrl.value;
    if (phoneNumber && isString(phoneNumber)) {
      const number = parsePhoneNumberFromString(phoneNumber);
      if (number && number.isValid) {
        console.log("valide number : ", phoneNumber, number);
        return null;
      }
    }
    console.log("invalide number : ", phoneNumber);
    return {valid: false};

  }
  async signIn(phoneNumber: string) {
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+" + phoneNumber;
    const confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier);

    // SMS sent. Prompt user to type the code from the message, then sign the
    // user in with confirmationResult.confirm(code).
    const prompt = await this.alertCtrl.create({
      message: 'Enter the Confirmation code',
      inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { console.log('Cancel clicked'); }
        },
        {
          text: 'Send',
          handler: data => {
            confirmationResult.confirm(data.confirmationCode)
              .then(function (result) {
                // User signed in successfully.
                console.log(result.user);
                // ...
              }).catch(function (error) {
                // User couldn't sign in (bad verification code?)
                // ...
              });
          }
        }
      ]
    });
    await prompt.present();


  }
}
