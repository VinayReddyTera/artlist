import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ApiService } from 'src/app/pages/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EncryptionService } from 'src/app/pages/services/encryption.service';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.scss']
})

export class PasswordresetComponent implements OnInit {

  resetForm:any;
  submitted = false;
  error = '';
  success = '';
  loading = false;
  year: number = new Date().getFullYear();
  successMessage:any;
  errorMessage:any;

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder,private apiservice : ApiService,
    private spinner: NgxSpinnerService, private encryptionService: EncryptionService) { }

  ngOnInit() {

    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, this.validateEmail]],
      role: ['', [Validators.required]],
    });
  }

  validateEmail(c:FormControl){
    const emailRegex = environment.emailRegex
    return emailRegex.test(c.value)? null : {
      emailError : {
        message : 'Invalid email format!'
      }
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }

  onSubmit() {
    this.success = '';
    this.submitted = true;
    if(this.resetForm.valid){
      this.apiservice.initiateLoading(true)
      this.apiservice.forgotPassword(this.resetForm.value).subscribe(
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
          this.successMessage = null;
          this.errorMessage = null;
        },4000)
      })
    }
  }
}
