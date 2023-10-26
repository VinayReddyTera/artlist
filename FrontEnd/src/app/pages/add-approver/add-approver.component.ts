import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/pages/services/api.service';
import { environment } from 'src/environments/environment.prod';
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
  skillList = [
  { name: "Director" },
  { name: "Producer" },
  { name: "Screenwriter" },
  { name: "Cinematographer/Director of Photography (DP)" },
  { name: "Actor/Actress" },
  { name: "Editor" },
  { name: "Costume Designer" },
  { name: "Makeup and Hair Stylists" },
  { name: "Production Designer/Art Director" },
  { name: "Location Manager" },
  { name: "Sound Engineer" },
  { name: "Composer" },
  { name: "Music Director" },
  { name: "Choreographer" },
  { name: "Dancer" },
  { name: "Stunt Coordinator" },
  { name: "Special Effects Supervisor" },
  { name: "Visual Effects (VFX) Artists" },
  { name: "Dialect Coach" },
  { name: "Production Manager" },
  { name: "Casting Director" },
  { name: "Script Supervisor" },
  { name: "Gaffer" },
  { name: "Key Grip" },
  { name: "Assistant Director (1st AD, 2nd AD)" },
  { name: "Production Assistant (PA)" },
  { name: "Set Decorator" },
  { name: "Wardrobe Supervisor" },
  { name: "Animal Wrangler" },
  { name: "DIT (Digital Imaging Technician)" },
  { name: "Colorist" },
  { name: "Grip" },
  { name: "Best Boy" },
  { name: "Boom Operator" },
  { name: "Caterer/Craft Service" },
  { name: "Legal and Clearance Team" },
  { name: "Publicist" },
  { name: "Singer" },
  { name: "Musician" },
  { name: "Sound Recordist" },
  { name: "Sound designer" },
  { name: "Lighting Designer" },
  { name: "Prop Master" },
  { name: "Storyboard Artist" },
  { name: "Location Scout" },
  { name: "Dance Instructor" },
  { name: "Fight Choreographer" },
  { name: "SFX Makeup Artist" },
  { name: "Foley Artist" },
  { name: "ADR Supervisor" },
  { name: "Post-Production Supervisor" },
  { name: "Public Relations Manager" },
  { name: "Film Editor" },
  { name: "Line producer" },
  { name: "Marketing Director" },
  { name: "Set Builder" },
  { name: "Cinematographer's Assistant" },
  { name: "Background performers" }
  ];
  languages = [
    {"name": "Hindi"},
    {"name": "Bengali"},
    {"name": "English"},
    {"name": "Telugu"},
    {"name": "Marathi"},
    {"name": "Tamil"},
    {"name": "Urdu"},
    {"name": "Gujarati"},
    {"name": "Kannada"},
    {"name": "Odia"},
    {"name": "Punjabi"},
    {"name": "Malayalam"},
    {"name": "Assamese"},
    {"name": "Sanskrit"},
    {"name": "Konkani"},
    {"name": "Nepali"},
    {"name": "Manipuri"},
    {"name": "Sindhi"},
    {"name": "Maithili"},
    {"name": "Dogri"},
    {"name": "Bodo"},
    {"name": "Kashmiri"},
    {"name": "Santhali"}
  ];

  constructor(private formBuilder: FormBuilder,private route:ActivatedRoute,
    private apiService:ApiService,private encryptionService: EncryptionService) { }

  ngOnInit() {
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
    // if(this.signupForm.value.skillName){
    //   this.signupForm.value.skillName = this.signupForm.value.skillName.map((obj:any) => obj.name);
    // }
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
    const arrayOfObjects = this.updateData.skillName.map((str:any) => ({ name: str }));
    const arrayOfLang = this.updateData.language.map((str:any) => ({ name: str }));
    console.log(this.updateData)
    this.signupForm.patchValue({
      name: this.updateData.name,
      email : this.updateData.email,
      phoneNo : this.updateData.phoneNo,
      skillName: arrayOfObjects,
      language : arrayOfLang
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