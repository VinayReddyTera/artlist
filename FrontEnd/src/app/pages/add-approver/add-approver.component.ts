import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/pages/services/api.service';
import { environment } from 'src/environments/environment';
import { EncryptionService } from '../services/encryption.service';

declare const $:any;

@Component({
  selector: 'app-add-approver',
  templateUrl: './add-approver.component.html',
  styleUrls: ['./add-approver.component.css']
})
export class AddApproverComponent implements OnInit{

  signupForm:any;
  submitted = false;
  error = '';
  successmsg = false;
  isCreating:any = true;
  isUpdating:any = false;
  successMessage:any;
  errorMessage:any;
  updateData : any;
  skillList:any;
  languages:any;

  constructor(private formBuilder: FormBuilder,private route:ActivatedRoute,
    private apiService:ApiService,private encryptionService: EncryptionService) { }

  ngOnInit() {
    this.languages = environment.languages;
    this.skillList = environment.skillList;
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required,this.validateName]],
      email: ['', [Validators.required,this.validateEmail]],
      phoneNo: ['', [Validators.required,this.validatePhone]],
      role : ['tag', Validators.required],
      skillName: ['', Validators.required],
      language: ['', Validators.required]
    });

    if(localStorage.getItem('editApprover')){
      if(this.encryptionService.deCrypt(this.route.snapshot.paramMap.get('type')) == 'edit'){
        this.isCreating = false;
        this.isUpdating = true;
        this.updateData = JSON.parse(this.encryptionService.deCrypt(localStorage.getItem('editApprover')));
        this.edit();
      }
      else{
        localStorage.removeItem('editApprover')
      }
    }
  }

  validateEmail(c:FormControl): { emailError: { message: string; }; } | null{
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

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  onSubmit() {
    this.submitted = true;
    console.log(this.signupForm.value);
    if(this.signupForm.valid){
      this.apiService.initiateLoading(true)
      if(this.isCreating){
        this.apiService.addApprover(this.signupForm.value).subscribe(
          (res:any)=>{
            if(res.status == 200){
              this.successMessage = res.data;
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
            console.log(err)
          }
        ).add(()=>{
          this.apiService.initiateLoading(false)
          setTimeout(()=>{
            this.successMessage = null;
            this.errorMessage = null;
          },4000)
        })
      }
      else{
        this.apiService.editApprover(this.signupForm.value).subscribe(
          (res:any)=>{
            if(res.status == 200){
              this.successMessage = res.data;
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
            console.log(err)
          }
        ).add(()=>{
          this.apiService.initiateLoading(false)
          setTimeout(()=>{
            this.successMessage = null;
            this.errorMessage = null;
          },4000)
        })
      }
    }
  }

  edit(){
    console.log(this.updateData)
    this.signupForm.patchValue({
      name: this.updateData.name,
      email : this.updateData.email,
      phoneNo : this.updateData.phoneNo,
      skillName: this.updateData.skillName,
      language : this.updateData.language
    });

    this.signupForm.get('name').setValidators([Validators.required,this.validateName]);
    this.signupForm.get('name').updateValueAndValidity();
    this.signupForm.get('email').setValidators([Validators.required,this.validateEmail]);
    this.signupForm.get('email').updateValueAndValidity();
    this.signupForm.get('phoneNo').setValidators([Validators.required,this.validatePhone]);
    this.signupForm.get('phoneNo').updateValueAndValidity();
    this.signupForm.get('skillName').setValidators(Validators.required);
    this.signupForm.get('skillName').updateValueAndValidity();
    this.signupForm.get('language').setValidators(Validators.required);
    this.signupForm.get('language').updateValueAndValidity();
    this.signupForm.addControl('id', new FormControl(this.updateData._id, Validators.required));
  }

}