import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../providers/Auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"]
})
export class SignupPage implements OnInit {
  form: FormGroup;
  submitAttempt = false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: ["", Validators.required]
    });
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad SignupPage");
  }
  onSubmit({ value, valid }) {
    console.log(value, valid);
    this.submitAttempt = true;
    if (valid) {
      this.auth
        .signupUser(value.email, value.password)
        .then(() => this.router.navigateByUrl("home"));
    }
    // throw "please take care , invalid form"
  }

  ngOnInit() {}
}
