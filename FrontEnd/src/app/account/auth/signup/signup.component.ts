import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/pages/services/api.service';
import { environment } from 'src/environments/environment.prod';

declare const $:any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm:any;
  submitted = false;
  error = '';
  successmsg = false;
  successMessage:any;
  errorMessage:any;
  showPassword: boolean = false;
  showConfirmPassword : boolean = false;
  // set the currenr year
  year: number = new Date().getFullYear();
  role : any;
  states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Delhi",
    "Puducherry"
  ];

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private activeRoute : ActivatedRoute,
     private router: Router,private apiService:ApiService) { }

  ngOnInit() {
    this.role = this.activeRoute.snapshot.params['type']
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required,this.validateEmail]],
      phoneNo: ['', [Validators.required,this.validatePhone]],
      role : [this.role, Validators.required],
      password: ['', [Validators.required]],
      cPassword: ['', [Validators.required]]
    },{validator : this.validatePassword});

    const addressControl = this.signupForm.get('address');
    if (this.role === 'artist') {
      if (!addressControl) {
        this.signupForm.addControl('address', new FormControl('', Validators.required));
        this.signupForm.addControl('mandal', new FormControl('', Validators.required));
        this.signupForm.addControl('district', new FormControl('', Validators.required));
        this.signupForm.addControl('state', new FormControl('', Validators.required));
        this.signupForm.addControl('pincode', new FormControl('', Validators.required));
      }
    } else {
      if (addressControl) {
        this.signupForm.removeControl('address');
        this.signupForm.removeControl('mandal');
        this.signupForm.removeControl('district');
        this.signupForm.removeControl('state');
        this.signupForm.removeControl('pincode');
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

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    if(this.showPassword){
      document.getElementById("password")?.setAttribute("type","text");
    }
    else{
      document.getElementById("password")?.setAttribute("type","password");
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

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  onSubmit() {
    this.submitted = true;
    console.log(this.signupForm.value);
    if(this.signupForm.value.role == 'artist' || this.signupForm.value.role == 'user'){
      if(this.signupForm.valid){
        this.apiService.initiateLoading(true)
        this.apiService.register(this.signupForm.value).subscribe(
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
    else{
      $('#invalidRoleModal').modal('show')
    }
  }

  navigateUser(){
    this.router.navigateByUrl('/account/signup/user').then(()=>{
      $('#invalidRoleModal').modal('hide');
      this.signupForm.controls['role'].setValue(this.activeRoute.snapshot.params['type'])
    })
  }

  navigateArtist(){
    this.router.navigateByUrl('/account/signup/artist').then(()=>{
      $('#invalidRoleModal').modal('hide')
      this.signupForm.controls['role'].setValue(this.activeRoute.snapshot.params['type'])
    })
  }

}
