import { Component, OnInit } from '@angular/core';
import { Extended, User } from '../../interfaces/data-models';
import { AuthService } from '../../providers/Auth/auth.service';
import { UsersService } from '../../providers/AppData/users.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  currUser: Observable<Extended<User>>;
  displayNameCtrl: FormControl;
  emailCtrl: FormControl;
  showEditUserName = false;
  user: Extended<User>;
  displayNameCtrlVisible = false;
  emailCtrlVisible = false;

  constructor(
    public usersService: UsersService,
    fb: FormBuilder
  ) {
    this.currUser = this.usersService.currentUser.pipe(tap(extUser => {
      this.user = extUser;
      this.displayNameCtrl.setValue(extUser.data.displayName);
    }));
    this.displayNameCtrl = fb.control("", [Validators.required, Validators.minLength(5)]);
    this.emailCtrl = fb.control("", [Validators.required, Validators.email]);
  }
  showEditDisplayName() {
    this.displayNameCtrlVisible = true;
    if (this.user.data.displayName) {
      this.displayNameCtrl.setValue(this.user.data.displayName);
    }
  }
  showEditEmail() {
    this.emailCtrlVisible = true;
    if (this.user.data.email) {
      this.emailCtrl.setValue(this.user.data.email);
    }
  }
  hideEditDisplayName() {
    this.displayNameCtrlVisible = false;
    this.displayNameCtrl.reset();
  }
  hideEditEmail() {
    this.emailCtrlVisible = false;
    this.emailCtrl.reset();
  }
  updateDisplayName() {
    if (this.displayNameCtrl.valid) {
      if (this.displayNameCtrl.value !== this.user.data.displayName) {
        this.user.data.displayName = this.displayNameCtrl.value;
        this.usersService.saveOld(this.user).then(() => this.hideEditDisplayName());
      }
    }
  }
  updateEmail() {
    if (this.emailCtrl.valid) {
      if (this.emailCtrl.value !== this.user.data.email) {
        this.user.data.email = this.emailCtrl.value;
        this.usersService.saveOld(this.user).then(() => this.hideEditEmail());
      }
    }
  }

  ngOnInit() {
  }

}
