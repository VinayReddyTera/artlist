import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/pages/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { EncryptionService } from 'src/app/pages/services/encryption.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {

  profileForm : any;
  errorMessage : any;
  submitted : boolean = false;
  passSubmitted : boolean = false;
  showProfile : boolean = true;
  showPasswordPage : boolean = false;
  showPassword: boolean = false;
  showConfirmPassword : boolean = false;
  showOldPassword : boolean = false;
  resetForm:any;

  constructor(public http: HttpClient, public router: Router,
    private apiService : ApiService,private fb: FormBuilder,
    private encrypt:EncryptionService) { }

  ngOnInit() {

    this.profileForm = this.fb.group({
      email:['',[Validators.required,this.validateEmail]],
      name:['',[Validators.required]],
      phoneNo : ['',[Validators.required,this.validatePhone]]
    })

    this.resetForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      password: ['', [Validators.required]],
      cPassword: ['', [Validators.required]]
    },{validator : this.validatePassword});
  }

  validateEmail(c:FormControl){
    const emailRegex = environment.emailRegex
    return emailRegex.test(c.value)? null : {
      emailError : {
        message : 'Invalid email format!'
      }
    }
  }

  validatePhone(c:FormControl): { phoneError: { message: string; }; } | null{
    const phoneRegex = environment.phoneNoRegex
    return phoneRegex.test(c.value)? null : {
      phoneError : {
        message : 'Invalid Mobile No format!'
      }
    }
  }

  validatePassword(c:FormGroup){
    if(c.controls['password'].value == c.controls['cPassword'].value){
      return null
    }
    else{
      return {
        passwordError : {
          message : "Passwords Didn't Match!"
        }
      }
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    if(this.showPassword){
      document.getElementById("password")?.setAttribute("type","text");
    }
    else{
      document.getElementById("password")?.setAttribute("type","password");
    }
  }

  toggleOldPasswordVisibility(): void {
    this.showOldPassword = !this.showOldPassword;
    if(this.showOldPassword){
      document.getElementById("oldPassword")?.setAttribute("type","text");
    }
    else{
      document.getElementById("oldPassword")?.setAttribute("type","password");
    }
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
    if(this.showConfirmPassword){
      document.getElementById("cPassword")?.setAttribute("type","text");
    }
    else{
      document.getElementById("cPassword")?.setAttribute("type","password");
    }
  }

  submit() {
    this.submitted = true
    if(this.profileForm.valid){
      this.apiService.initiateLoading(true);
      this.apiService.login(this.profileForm.value).subscribe(
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
          localStorage.setItem('role', this.profileForm.value.role);
          localStorage.setItem('profileStatus', res.data?.status);
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
    const controls = this.profileForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            controls[name].markAsDirty()
        }
    }
  }
  }

  onSubmit() {
    this.passSubmitted = true;
    if(this.resetForm.valid){
      this.apiService.initiateLoading(true)
      this.apiService.resetPassword(this.resetForm.valid).subscribe(
        (res:any)=>{
          console.log(res)
          if(res.status == 200){
            console.log('ok')
          }
          else if(res.status == 204){
            this.errorMessage = res.data
          }
        },
        (err:any)=>{
          console.log(err)
        }
      ).add(()=>{
        this.apiService.initiateLoading(false)
      })
    }
  }

  toggle(){
    this.showProfile = !this.showProfile;
    this.showPasswordPage = !this.showPasswordPage
  }

}
