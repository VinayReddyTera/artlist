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
  userData:any;
  profileStatus : any;

  constructor(public http: HttpClient, public router: Router,
    private apiService : ApiService,private fb: FormBuilder,
    private encrypt:EncryptionService) { }

  ngOnInit() {
    if(localStorage.getItem('data')){
      this.userData = JSON.parse(this.encrypt.deCrypt(localStorage.getItem('data')));
      this.profileStatus = this.userData.profileStatus
    }
    this.profileForm = this.fb.group({
      email:[this.userData.email,[Validators.required,this.validateEmail]],
      name:[this.userData.name,[Validators.required]],
      phoneNo : [this.userData.phoneNo,[Validators.required,this.validatePhone]],
    })

    this.resetForm = this.fb.group({
      password: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      cPassword: ['', [Validators.required]],
      role: [this.userData.role, [Validators.required]],
      email : [this.userData.email,[Validators.required]]
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

  validateName(c:FormControl): { nameError: { message: string; }; } | null{
    const nameRegex = environment.nameRegex
    return nameRegex.test(c.value)? null : {
      nameError : {
        message : 'Invalid Name format!'
      }
    }
  }

  validatePassword(c:FormGroup){
    if(c.controls['newPassword'].value == c.controls['cPassword'].value){
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
      document.getElementById("newPassword")?.setAttribute("type","text");
    }
    else{
      document.getElementById("newPassword")?.setAttribute("type","password");
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
    this.submitted = true;
    if(this.userData.email != this.profileForm.value.email || this.userData.phoneNo != this.profileForm.value.phoneNo){
      this.profileStatus = 'Incomplete'
    }
    let payload = {
      name : this.profileForm.value.name,
      email : this.profileForm.value.email,
      phoneNo : this.profileForm.value.phoneNo,
      profileStatus : this.profileStatus,
      role: this.userData.role,
      id : this.userData.id
    }
    console.log(payload)
    if(this.profileForm.valid){
      this.apiService.initiateLoading(true);
      this.apiService.updateProfile(payload).subscribe(
      (res : any)=>{
        console.log(res)
        if(res.status == 200){
          let msgData = {
            severity : "success",
            summary : 'Success',
            detail : res.data,
            life : 5000
          }
          this.apiService.sendMessage(msgData);
        }
        else if(res.status == 204){
          this.errorMessage = res.data;
          let msgData = {
            severity : "error",
            summary : 'Error',
            detail : res.data,
            life : 5000
          }
          // this.apiService.sendMessage(msgData);
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
      this.apiService.initiateLoading(true);
      this.apiService.changePassword(this.resetForm.value).subscribe(
      (res : any)=>{
        console.log(res)
        if(res.status == 200){
          let msgData = {
            severity : "success",
            summary : 'Success',
            detail : res.data,
            life : 5000
          }
          this.apiService.sendMessage(msgData);
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
    const controls = this.resetForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            controls[name].markAsDirty()
        }
    }
  }
  }

  toggle(){
    this.showProfile = !this.showProfile;
    this.showPasswordPage = !this.showPasswordPage
  }

}
