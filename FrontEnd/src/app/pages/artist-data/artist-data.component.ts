import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EncryptionService } from '../services/encryption.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';

declare const Razorpay: any;
declare const $:any;

@Component({
  selector: 'app-artist-data',
  templateUrl: './artist-data.component.html',
  styleUrls: ['./artist-data.component.css']
})
export class ArtistDataComponent implements OnInit{

  constructor(private router:Router,private decrypt: EncryptionService,
    private apiservice:ApiService,private fb: FormBuilder){}

  artistData:any;
  apiCalled:boolean=false;
  bookingForm:any;
  showFrom:boolean=false;
  availableData: any;
  price:any;
  checkAvailability : boolean = false;
  minDate : Date = new Date(new Date().setDate(new Date().getDate()+1));
  paymentId:any;
  states:any;
  userData:any;
  payNow:boolean=true;

  ngOnInit(): void {
    if(localStorage.getItem('data')){
      this.userData = JSON.parse(this.decrypt.deCrypt(localStorage.getItem('data')));
    }
    this.states = environment.states;
    if(localStorage.getItem('artistData')){
      this.artistData = JSON.parse(this.decrypt.deCrypt(localStorage.getItem('artistData')));
    }
    else{
      this.router.navigateByUrl('all-artists')
    }
    console.log(this.artistData)
    this.bookingForm = this.fb.group({
      bookingType:['',[Validators.required]],
      type:['',[Validators.required]],
      date:['',[Validators.required]],
      name:[this.artistData.skill.name],
      artistId:[this.artistData.id],
      price:[''],
      modifiedBy:['user'],
      pricing:[this.artistData.skill.pricing],
      commission:['']
    })
  }

  get f() { return this.bookingForm.controls; }

  fetchAvailable(){
    if(!this.apiCalled){
      this.apiservice.initiateLoading(true);
      this.apiservice.fetchAvailable({'id':this.artistData.id}).subscribe(
        (res:any)=>{
          if(res.status == 200){
            this.availableData = res.data
            console.log(this.availableData)
            this.apiCalled = true;
          }
          else if(res.status == 204){
            let msgData = {
              severity : "error",
              summary : 'Error',
              detail : res.data,
              life : 5000
            }
            this.apiservice.sendMessage(msgData);
          }
        },
        (err:any)=>{
          console.log(err)
        }
      ).add(()=>{
        this.apiservice.initiateLoading(false);
      })
    }
  }

  bookNow(){
    let date = this.bookingForm.value.date;
    let type = this.bookingForm.value.type;
    let dates = this.availableData[type];
    let isFound = false;
    console.log(this.bookingForm.valid,this.bookingForm.value)
    if(this.bookingForm.valid){
      this.bookingForm.controls.commission.setValue(-(this.bookingForm.value.price*(1-environment.artistCommission)));
      if(type == 'fullDay'){
        for(let i of dates){
          if(new Date(i).toLocaleDateString() == new Date(date).toLocaleDateString()){
            isFound = true;
            break
          }
        }
      }
      else{
        for(let i of dates){
          if(new Date(i.date).toLocaleDateString() == new Date(date).toLocaleDateString()){
            isFound = true;
            break
          }
        }
      }
      if(isFound){
        if(this.bookingForm.value.type == 'hourly'){
          this.calPrice();
          const start = this.bookingForm.value.from.split(':')[0];
          const end = this.bookingForm.value.to.split(':')[0];
          let availability:any;
          for(let i of this.availableData.hourly){
            if(new Date(this.bookingForm.value.date).toDateString() == new Date(i.date).toDateString()){
              availability = i.availability;
              break;
            }
          }
          for(let i=start;i<end;i++){
            if(availability[i] == 0){
              let msgData = {
                severity : "error",
                summary : 'Error',
                detail : 'Slot already booked',
                life : 5000
              }
              this.apiservice.sendMessage(msgData);
              this.bookingForm.controls.from.setValue('');
              this.bookingForm.controls.to.setValue('');
              return
            }
          }
          let minutes = this.calTimeDiff(this.bookingForm.value.from,this.bookingForm.value.to);
          if(minutes<=0){
            let msgData = {
              severity : "error",
              summary : 'Error',
              detail : 'end time should be greater than start time',
              life : 5000
            }
            this.apiservice.sendMessage(msgData);
            return
          }
          let from = this.format(this.bookingForm.value.from,this.bookingForm.value.date);
          let to = this.format(this.bookingForm.value.to,this.bookingForm.value.date);
          this.bookingForm.controls.from.setValue(from);
          this.bookingForm.controls.to.setValue(to);
        }
        this.apiservice.initiateLoading(true);
        this.apiservice.bookArtist(this.bookingForm.value).subscribe(
        (res : any)=>{
          console.log(res)
          if(res.status == 200){
            let msgData = {
              severity : "success",
              summary : 'Success',
              detail : res.data,
              life : 5000
            }
            if(this.payNow){
              this.razor(res.id,this.bookingForm.value.price)
            }
            else{
              this.apiservice.sendMessage(msgData);
              $('#booking').modal('hide')
            }
          this.apiCalled = false;
          }
          else if(res.status == 204){
            let msgData = {
                severity : "error",
                summary : 'Error',
                detail : res.data,
                life : 5000
              }
            this.apiservice.sendMessage(msgData);
            if(res.data == 'Slot already booked'){
              this.apiCalled = false;
              this.fetchAvailable();
            }
          }
        },
        (err:any)=>{
          console.log(err);
        }
      ).add(()=>{
        this.apiservice.initiateLoading(false);
      })
      }
      else{
        let msgData = {
          severity : "error",
          summary : 'Error',
          detail : 'date should be present in available dates',
          life : 5000
        }
        this.apiservice.sendMessage(msgData);
        return
      }
    }
    else{
      const controls = this.bookingForm.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
              controls[name].markAsDirty()
          }
      }
    }
  }

  addField(){
    this.bookingForm.controls.date.setValue('');
    if(this.bookingForm.value.type == 'hourly'){
      this.price = '0';
      this.bookingForm.controls.price.setValue(this.price);
      this.bookingForm.addControl('from', new FormControl('', Validators.required));
      this.bookingForm.addControl('to', new FormControl('', Validators.required));
      this.showFrom = true;
    }
    else{
      this.bookingForm.removeControl('from');
      this.bookingForm.removeControl('to');
      this.showFrom = false;
    }
    if(this.bookingForm.value.bookingType == 'onsite'){
      if(this.bookingForm.value.type == 'event'){
        this.price = this.artistData.skill.pricing.event
        this.bookingForm.controls.price.setValue(this.price);
        this.bookingForm.addControl('slot', new FormControl('', Validators.required));
      }
      else{
        this.bookingForm.removeControl('slot');
      }
      if(this.bookingForm.value.type == 'fullDay'){
        this.price = this.artistData.skill.pricing.fullDay
        this.bookingForm.controls.price.setValue(this.price);
      }
    }
    else{
      if(this.bookingForm.value.type == 'event'){
        this.price = this.artistData.skill.pricing.oEvent
        this.bookingForm.controls.price.setValue(this.price);
        this.bookingForm.addControl('slot', new FormControl('', Validators.required));
      }
      else{
        this.bookingForm.removeControl('slot');
      }
      if(this.bookingForm.value.type == 'fullDay'){
        this.price = this.artistData.skill.pricing.oFullDay
        this.bookingForm.controls.price.setValue(this.price);
      }
    }
  }

  buttonFullDay(date:any,event:any){
    this.bookingForm.controls.date.setValue(date);
    for(let i in this.availableData.fullDay){
      let id = 'btn' + i
      document.getElementById(id)?.classList.remove('btn-clicked');
    }
    document.getElementById(event.target.id)?.classList.add('btn-clicked');
  }

  buttonEvent(i:any,date:any,event:any){
    this.bookingForm.controls.date.setValue(date);
    let text = event.target.innerText[0];
    if(text == '4'){
      this.bookingForm.controls.slot.setValue(1);
    }
    else if(text == '9'){
      this.bookingForm.controls.slot.setValue(2);
    }
    else if(text == '2'){
      this.bookingForm.controls.slot.setValue(3);
    }
    else if(text == '7'){
      this.bookingForm.controls.slot.setValue(4);
    }
    else if(text == '1'){
      this.bookingForm.controls.slot.setValue(5);
    }
    for(let i in this.availableData.event){
      for(let j in this.availableData.event[i].slots){
        let id = 'btn' + i + j
        document.getElementById(id)?.classList.remove('btn-clicked');
      }
    }
    document.getElementById(event.target.id)?.classList.add('btn-clicked');
  }

  format(timeString:any,dateString:any){
    const originalDate = new Date(dateString);
    const [hours, minutes] = timeString.split(':').map(Number);
    let newDate = new Date(originalDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate = new Date(newDate)
    return newDate;
  }

  calPrice(){
    if(this.bookingForm.value.from && this.bookingForm.value.to){
      let minutes = this.calTimeDiff(this.bookingForm.value?.from,this.bookingForm.value?.to);
      if(minutes<=0){
        let msgData = {
          severity : "warn",
          summary : 'warning',
          detail : 'end time should be greater than start time',
          life : 5000
        }
        this.apiservice.sendMessage(msgData);
      }
      else{
        if(this.bookingForm.value.bookingType == 'onsite'){
          this.price = Math.round(this.artistData.skill.pricing.hourly*(minutes/60))
        }
        else{
          this.price = Math.round(this.artistData.skill.pricing.oHourly*(minutes/60))
        }
        this.bookingForm.controls.price.setValue(this.price);
      }
    }
  }

  calTimeDiff(start:any,end:any){
    // Split the time strings into hours and minutes
    const fromTimeParts = start.split(':');
    const toTimeParts = end?.split(':');

    // Convert the time parts to integers
    const fromHours = parseInt(fromTimeParts[0], 10);
    const fromMinutes = parseInt(fromTimeParts[1], 10);
    const toHours = parseInt(toTimeParts[0], 10);
    const toMinutes = parseInt(toTimeParts[1], 10);

    // Calculate the time difference in minutes
    const totalMinutesFrom = fromHours * 60 + fromMinutes;
    const totalMinutesTo = toHours * 60 + toMinutes;
    const timeDifferenceMinutes = totalMinutesTo - totalMinutesFrom;
    return timeDifferenceMinutes
  }

  addAddress(){
    if(this.bookingForm.value.bookingType == 'onsite'){
      this.bookingForm.addControl('address', new FormControl('', Validators.required));
      this.bookingForm.addControl('mandal', new FormControl('', Validators.required));
      this.bookingForm.addControl('district', new FormControl('', Validators.required));
      this.bookingForm.addControl('state', new FormControl('Telangana', Validators.required));
      this.bookingForm.addControl('pincode', new FormControl('', Validators.required));
    }
    else{
      this.bookingForm.removeControl('address');
      this.bookingForm.removeControl('mandal');
      this.bookingForm.removeControl('district');
      this.bookingForm.removeControl('state');
      this.bookingForm.removeControl('pincode');
    }
    if(this.bookingForm.value?.type == 'hourly'){
      this.calPrice()
    }
    else if(this.bookingForm.value?.type == 'fullDay'){
      if(this.bookingForm.value.bookingType == 'onsite'){
        this.price = this.artistData.skill.pricing.fullDay
        this.bookingForm.controls.price.setValue(this.price);
      }
      else{
        this.price = this.artistData.skill.pricing.oFullDay
        this.bookingForm.controls.price.setValue(this.price);
      }
    }
    else if(this.bookingForm.value?.type == 'event'){
      if(this.bookingForm.value.bookingType == 'onsite'){
        this.price = this.artistData.skill.pricing.event
        this.bookingForm.controls.price.setValue(this.price);
      }
      else{
        this.price = this.artistData.skill.pricing.oEvent
        this.bookingForm.controls.price.setValue(this.price);
      }
    }
  }

  updatePay(data:any){
    if(data == 'paynow'){
      this.payNow = true;
      // this.bookingForm.controls.paid.setValue(true);
      // this.bookingForm.addControl('paymentType', new FormControl('online', Validators.required));
    }
    else{
      this.payNow = false;
      // this.bookingForm.controls.paid.setValue(false);
      // this.bookingForm.removeControl('paymentType');
    }
  }

  razor(id:any,price:any){
    let payload = {
      price:price*100
    }
    this.createOrder(payload,id);
  }
  
  createOrder(payload:any,id:any){
    this.apiservice.initiateLoading(true)
    this.apiservice.createOrder(payload).subscribe(
      (res:any)=>{
        if(res.status == 200){
          let options = { 
            "key": environment.keyid,  
            "amount": payload.price,  
            "currency": "INR", 
            "name": "Artlist", 
            "description": "Pay & Book Artist", 
            "image": environment.payDetails.image, 
            "order_id": res.data.id,
            "notes":{
              "id" : id,
              "type" : 'schedule'
            },
            "prefill": {
              "contact":this.userData.phoneNo,
              "name": this.userData.name,   
              "email": this.userData.email
             },
             "modal":{
              "backdropclose" : false,
              "escape" : false,
              "confirm_close" : true,
              "ondismiss":()=>{
                $('#booking').modal('hide')
              }
            },
            "handler": (response:any)=>{
              $('#booking').modal('hide')
            },
            "theme": { 
                "color": environment.payDetails.color
            } 
        }; 
          let razorpayObject = new Razorpay(options);
          razorpayObject.open();
          razorpayObject.on('payment.failed',(response:any)=>{ 
            console.log(response);
          });
        }
        else if(res.status == 204){
          let msgData = {
            severity : "error",
            summary : 'Error',
            detail : res.data,
            life : 5000
          }
          this.apiservice.sendMessage(msgData);
          return
        }
      },
      (err:any)=>{
        console.log(err)
      }
    ).add(()=>{
      this.apiservice.initiateLoading(false)
    })
  }

}
