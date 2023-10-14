import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/pages/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EncryptionService } from 'src/app/pages/services/encryption.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetForm:any;
  submitted = false;
  error = '';
  success = '';
  loading = false;
  year: number = new Date().getFullYear();
  successMessage:any;
  errorMessage:any;
  showPassword: boolean = false;
  showConfirmPassword : boolean = false;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
    private router: Router, private encrypt: EncryptionService,
    private apiservice : ApiService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      cPassword: ['', [Validators.required]]
    },{validator : this.validatePassword});
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }

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

  onSubmit() {
    this.success = '';
    this.submitted = true;
    let token = this.route.snapshot.params['token'];
    if(this.resetForm.valid){
      let payload = {
        password : this.resetForm.value.password,
        token : token
      }
      this.apiservice.initiateLoading(true)
      this.apiservice.resetPassword(payload).subscribe(
        (res:any)=>{
          console.log(res)
          if(res.status == 200){
            this.successMessage = res.data
          }
          else if(res.status == 204){
            this.errorMessage = res.data
          }
        },
        (err:any)=>{
          console.log(err)
        }
      ).add(()=>{
        this.apiservice.initiateLoading(false)
        setTimeout(()=>{
          if(this.successMessage){
            this.router.navigateByUrl('/account/login')
          }
          this.successMessage = null;
          this.errorMessage = null;
        },3000)
      })
    }
  }
}
