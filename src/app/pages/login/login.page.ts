import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../providers/Auth/auth.service";
import { NavController } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  form: FormGroup;
  submitAttempt = false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: ""
    });
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginPage");
  }

  onSubmit2({ value, valid }) {
    console.log(value, valid);
    this.submitAttempt = true;
    if (valid) {
      this.auth
        .signInWithEmail(value.email, value.password)
        .then(() => this.router.navigateByUrl("/"));
    }

    // throw "please take care , invalid form"
  }

  ngOnInit() {}
}
