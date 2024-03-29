import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/pages/services/api.service';
import { HttpClient } from '@angular/common/http';
import { EncryptionService } from 'src/app/pages/services/encryption.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-artist-profile',
  templateUrl: './artist-profile.component.html',
  styleUrls: ['./artist-profile.component.css']
})
export class ArtistProfileComponent implements OnInit{

  profileForm : any;
  errorMessage : any;
  submitted : boolean = false;
  passSubmitted : boolean = false;
  showPassword: boolean = false;
  showConfirmPassword : boolean = false;
  showOldPassword : boolean = false;
  resetForm:any;
  userData:any;
  profileStatus : any;
  show:any={
    'showProfile':true,
    'showAvailable':false,
    'showPassword':false,
    'showProfileStatus':false,
    'showWallet':false
  }
  items: any;
  states:any;
  languages:any;
  availableDays:any;
  availableArray:any;
  dayMappings:any = {
    "mon": "Monday",
    "tue": "Tuesday",
    "wed": "Wednesday",
    "thu": "Thursday",
    "fri": "Friday",
    "sat": "Saturday",
    "sun": "Sunday"
  };
  walletForm:any;
  amount:any = 0;

  constructor(public http: HttpClient, public router: Router,
    private apiService : ApiService,private fb: FormBuilder,
    private encrypt:EncryptionService,private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.languages = environment.languages;
    this.states = environment.states;
    this.apiService.initiateLoading(true)
    this.apiService.getAvailable().subscribe(
      (res:any)=>{
        if(res.status == 200){
          this.availableDays = res.data;
          this.availableArray = Object.entries(this.availableDays);
        }
        else if(res.status == 204){
          if(res.data == 'Invalid token'){
            localStorage.clear();
            this.router.navigate(['/account/login']);
          }
          else{
            let msgData = {
              severity : "error",
              summary : 'Error',
              detail : res.data,
              life : 5000
            }
            this.apiService.sendMessage(msgData);
          }
        }
      },
      (err:any)=>{
        console.log(err)
      }
    ).add(()=>{
      this.apiService.initiateLoading(false)
    })

    this.walletForm = this.fb.group({
      amount: ['',[Validators.required,this.validateAmount.bind(this)]]
    });

    this.apiService.initiateLoading(true);
    this.apiService.fetchBalance().subscribe(
    (res : any)=>{
      console.log(res)
      if(res.status == 200){
        this.amount = res.data.wallet
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
    this.apiService.initiateLoading(false);
    if(this.amount == 0){
      this.walletForm.get('amount').disable();
    }
    setTimeout(()=>{
      this.errorMessage = null;
    },5000)
  })

    if(localStorage.getItem('data')){
      this.userData = JSON.parse(this.encrypt.deCrypt(localStorage.getItem('data')));
      this.profileStatus = this.userData.profileStatus
    }
    
    this.activatedRoute.queryParamMap.subscribe(params => {
      // Optional parameter
      const status:any = params.get('status');
      const data:any = params.get('data');
      if(this.encrypt.deCrypt(data) == 'wallet'){
        this.show.showProfile = false;
        this.show.showWallet = true;
        return
      }
      if(this.encrypt.deCrypt(data) == 'verify'){
        this.show.showProfile = false;
        this.show.showProfileStatus = true;
        return
      }
      if(status == 200){
        let msgData = {
          severity : "success",
          summary : 'Success',
          detail : data,
          life : 5000
        }
        if(data == 'Email Verified'){
          this.userData.emailVerified = true
        }
        if(data == 'Phone Verified'){
          this.userData.phoneVerified = true
        }
        this.apiService.sendMessage(msgData);
        if(this.userData.phoneVerified && this.userData.emailVerified){
          this.profileStatus = "complete"
        }
        let encryptData : any = {
          name : this.userData.name,
          email : this.userData.email,
          phoneNo : this.userData.phoneNo,
          profileStatus : this.profileStatus,
          role: this.userData.role,
          id : this.userData.id,
          emailVerified : this.userData.emailVerified,
          phoneVerified : this.userData.phoneVerified,
          language : this.userData.language,
          address : this.userData.address,
          mandal : this.userData.mandal,
          district : this.userData.district,
          state : this.userData.state,
          pincode : this.userData.pincode
        }
        localStorage.setItem('data', this.encrypt.enCrypt(JSON.stringify(encryptData)));
      }
      else if(status == 204){
        let msgData = {
          severity : "error",
          summary : 'Error',
          detail : data,
          life : 5000
        }
        this.apiService.sendMessage(msgData);
      }
      this.router.navigateByUrl('/artist-profile')
    })
    this.items = [
      {
          icon: 'mdi mdi-account-edit',
          command: () => {
              this.setKeyTrue('showProfile')
          }
      },
      {
        icon: 'mdi mdi-calendar-check',
        command: () => {
          this.setKeyTrue('showAvailable')
        }
      },
      {
          icon: 'mdi mdi-key-variant',
          command: () => {
            this.setKeyTrue('showPassword')
          }
      },
      {
          icon: 'mdi mdi-list-status',
          command: () => {
            this.setKeyTrue('showProfileStatus')
          }
      },
      {
          icon: 'mdi mdi-contactless-payment',
          command: () => {
            this.setKeyTrue('showWallet')
          }
      }
    ];
    this.profileForm = this.fb.group({
      email:[this.userData.email,[Validators.required,this.validateEmail]],
      name:[this.userData.name,[Validators.required]],
      phoneNo : [this.userData.phoneNo,[Validators.required,this.validatePhone]],
      language : [this.userData.language, Validators.required],
      address : [this.userData.address, Validators.required],
      mandal: [this.userData.mandal, [Validators.required]],
      district: [this.userData.district, [Validators.required]],
      state: [this.userData.state, [Validators.required]],
      pincode: [this.userData.pincode, [Validators.required]]
    })

    this.resetForm = this.fb.group({
      password: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      cPassword: ['', [Validators.required]],
      role: [this.userData.role, [Validators.required]],
      email : [this.userData.email,[Validators.required]]
    },{validator : this.validatePassword});

  }

  validateAmount(c:FormControl){
    if(c.value<=0){
      return {
        amountError : {
          message : 'Amount cannot be less than or equal to 0'
        }
      }
    }
    else if(c.value > this.amount){
      return {
        amountError : {
          message : `Amount cannot be more than ${this.amount}`
        }
      }
    }
    else{
      return null
    }
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

  get f() { return this.profileForm.controls; }

  submit() {
    this.submitted = true;
    if(this.profileForm.valid){
      let emailVerified = this.userData.emailVerified;
      let phoneVerified = this.userData.phoneVerified;
      if(this.userData.email != this.profileForm.value.email){
        this.profileStatus = 'Incomplete';
        emailVerified = false;
        this.userData.emailVerified = false;
        this.userData.email = this.profileForm.value.email
      }
      if(this.userData.phoneNo != this.profileForm.value.phoneNo){
        this.profileStatus = 'Incomplete';
        phoneVerified = false;
        this.userData.phoneVerified = false;
        this.userData.phoneNo = this.profileForm.value.phoneNo
      }
      let payload = {
        name : this.profileForm.value.name,
        email : this.profileForm.value.email,
        phoneNo : this.profileForm.value.phoneNo,
        profileStatus : this.profileStatus,
        role: this.userData.role,
        id : this.userData.id,
        emailVerified : emailVerified,
        phoneVerified : phoneVerified,
        language : this.profileForm.value.language,
        address : this.profileForm.value.address,
        mandal : this.profileForm.value.mandal,
        district : this.profileForm.value.district,
        state : this.profileForm.value.state,
        pincode : this.profileForm.value.pincode
      }
      console.log(payload)
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
          localStorage.setItem('token',res.token);
          localStorage.setItem('data', this.encrypt.enCrypt(JSON.stringify(payload)));
          let now = new Date();
          let time = now.getTime();
          let expireTime = time + 600 * 36000;
          let clientData = {
            key : environment.secretKey,
            time : expireTime
          }
          localStorage.setItem('client-token',this.encrypt.enCrypt(JSON.stringify(clientData)));
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

  setKeyTrue(key:any) {
    for (const prop in this.show) {
      if (this.show.hasOwnProperty(prop)) {
        this.show[prop] = prop === key;
      }
    }
    setTimeout(() => {
      if(key == 'showAvailable'){
        Object.keys(this.availableDays).forEach(key => {
          const value = this.availableDays[key];
          let ele = (<HTMLInputElement>document.getElementById(key));
          ele.checked = value;
        });
      } 
    }, 100);
  }

  verifyEmail(){
    this.apiService.initiateLoading(true);
    this.apiService.sendVerifyEmail().subscribe(
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

  verifyPhone(){

  }

  updateDay(){
    this.apiService.initiateLoading(true);
    this.apiService.updateAvailable(this.availableDays).subscribe(
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

  withdraw(){
    if(this.walletForm.valid){
      this.apiService.initiateLoading(true);
      this.apiService.withdrawBalance(this.walletForm.value).subscribe(
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
          this.amount -= this.walletForm.value.amount;
          this.walletForm.reset();
          if(this.amount == 0){
            this.walletForm.get('amount').disable()
          }
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
      const controls = this.walletForm.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
              controls[name].markAsDirty()
          }
      }
    }
  }

}
