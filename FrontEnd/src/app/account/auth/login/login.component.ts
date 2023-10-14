import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/pages/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { EncryptionService } from 'src/app/pages/services/encryption.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  public showPassword: boolean = false;
  loginForm : any;
  errorMessage : any;
  year: number = new Date().getFullYear();
  submitted : boolean = false;
  constructor(public http: HttpClient, public router: Router,
    private apiService : ApiService,private fb: FormBuilder,
    private encrypt:EncryptionService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email:['',[Validators.required,this.validateEmail]],
      password:['',[Validators.required]],
      role : ['',[Validators.required]]
    })
  }

  validateEmail(c:FormControl){
    const emailRegex = environment.emailRegex
    return emailRegex.test(c.value)? null : {
      emailError : {
        message : 'Invalid email format!'
      }
    }
  }

    public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    if(this.showPassword){
      document.getElementById("password")?.setAttribute("type","text");
    }
    else{
      document.getElementById("password")?.setAttribute("type","password");
    }
  }

  login() {
    this.submitted = true
    if(this.loginForm.valid){
      this.apiService.initiateLoading(true);
    this.apiService.login(this.loginForm.value).subscribe(
      (res : any)=>{
        console.log(res)
        if(res.status == 200){
          localStorage.clear();
          let now = new Date();
          let time = now.getTime();
          let expireTime = time + 600 * 36000;
          localStorage.setItem('email', res.data.email);
          localStorage.setItem('name', res.data.name);
          localStorage.setItem('phoneNo', res.data.phoneNo);
          localStorage.setItem('id', res.data._id);
          localStorage.setItem('client-token',this.encrypt.enCrypt(environment.secretKey));
          localStorage.setItem('token',res.token);
          localStorage.setItem('role', this.loginForm.value.role);
          localStorage.setItem('profileStatus', res.data?.status);
          localStorage.setItem('microsoftInt', JSON.stringify(res.data.MCalendar));
          localStorage.setItem('googleInt', JSON.stringify(res.data.GCalendar));
          this.router.navigateByUrl('/artist-dashboard');
        }
        else if(res.status == 204){
          this.errorMessage = res.data;
          let msgData = {
            severity : "error",
            summary : 'Error',
            detail : res.data,
            life : 5000
          }
          this.apiService.sendMessage(msgData);
        }
      },
      (err:any)=>{
        this.errorMessage = err.error
        console.log(err);
      }
    ).add(()=>{
      this.apiService.initiateLoading(false)
      setTimeout(()=>{
        this.errorMessage = null;
      },5000)
    })
  }
  else{
    const controls = this.loginForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            controls[name].markAsDirty()
        }
    }
  }
  }

}
