import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EncryptionService } from '../services/encryption.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

declare const $:any;
declare const Razorpay: any;

@Component({
  selector: 'app-all-artists',
  templateUrl: './all-artists.component.html',
  styleUrls: ['./all-artists.component.css']
})
export class AllArtistsComponent implements OnInit{
artists:any=[];
showAdvance:any = false;
first: number = 0;
errorMessage:any = ''
rows: number = 10;
totalRecords : any;
startIndex = 1;
endIndex = 5;
displayData:any = [];
filteredData:any = [];
filterForm : any;
filterApplied:boolean = false;
inaugArray:any=[];
wishesArray:any=[];
show:any = {
  showArt : true,
  showInaug : false,
  showWishes : false
}
inaugfilterForm : any;
wishesfilterForm : any;
wishesForm:any;
inaugForm:any;
minDate : Date = new Date(new Date().setDate(new Date().getDate()+1));
price:any;
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
availableData: any;
paymentId:any;
userData:any;

constructor(private apiService:ApiService,private router:Router,private encrypt:EncryptionService,private fb: FormBuilder){}

ngOnInit() {
  if(localStorage.getItem('data')){
    this.userData = JSON.parse(this.encrypt.deCrypt(localStorage.getItem('data')));
  }
  this.wishesForm = this.fb.group({
    bookingType:['online'],
    type:['Personal Wishes'],
    date:['',[Validators.required]],
    artistId:[''],
    modifiedBy:['user'],
    price:[''],
    commission:[''],
    wishes:[true],
    paid:[true],
    paymentType:['online'],
    artistName:[''],
    artistPhone:[''],
    artistEmail:['']
  })
  this.inaugForm = this.fb.group({
    bookingType:['onsite'],
    type:['Inauguration'],
    date:['',[Validators.required]],
    artistId:[''],
    modifiedBy:['user'],
    price:[''],
    commission:[''],
    inaug:[true],
    paid:[true],
    slot:['',[Validators.required]],
    paymentType:['online'],
    artistName:[''],
    artistPhone:[''],
    artistEmail:[''],
    address : ['',[Validators.required]],
    mandal : ['',[Validators.required]],
    district : ['',[Validators.required]],
    state : ['Telangana',[Validators.required]],
    pincode : ['',[Validators.required]]
  })
   this.apiService.initiateLoading(true);
   this.apiService.getArtists().subscribe(
    (res:any)=>{
      if(res.status == 200){
        const newArray:any = [];
        res.data.forEach((person:any) => {
            person.skills.forEach((skill:any) => {
                newArray.push({
                    id: person._id,
                    name: person.name,
                    email: person.email,
                    phoneNo: person.phoneNo,
                    address: person.address,
                    mandal: person.mandal,
                    district: person.district,
                    state: person.state,
                    pincode: person.pincode,
                    language: person.language,
                    skill: skill
                });
            });
        });
        res.data.forEach((item:any) => {
          if (item.inaug) {
              const { skills, wishes, wishesPrice, ...inaugItem } = item;
              this.inaugArray.push(inaugItem);
          }
          if (item.wishes) {
              const { skills, inaug, inaugPrice, ...wishesItem } = item;
              this.wishesArray.push(wishesItem);
          }
      });
        this.artists = newArray;
        console.log(this.inaugArray);
        console.log(this.wishesArray)
      }
      else if(res.status == 204){
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
    this.apiService.initiateLoading(false);
    console.log(this.artists)
    if(this.artists.length > 0){
      this.totalRecords = this.artists.length;
      this.displayData = this.artists.slice(0,10);
    }
  })
  this.filterForm = this.fb.group({
    name:[''],
    address:[''],
    language : [''],
    skillName:[''],
    experience:[''],
    rating : ['']
  })
  this.inaugfilterForm = this.fb.group({
    name:[''],
    address:[''],
    price:[''],
    language : ['']
  })
  this.wishesfilterForm = this.fb.group({
    name:[''],
    price:[''],
    language : ['']
  })
}

onPageChange(event: any) {
  this.first = event.first;
  this.rows = event.rows;
  if(this.filterApplied){
    this.displayData = this.filteredData.slice(this.first,this.first+this.rows)
  }
  else{
    if(this.show.showArt){
      this.displayData = this.artists.slice(this.first,this.first+this.rows);
    }
    else if(this.show.showInaug){
      this.displayData = this.inaugArray.slice(this.first,this.first+this.rows);
    }
    else{
      this.displayData = this.wishesArray.slice(this.first,this.first+this.rows);
    }
  }
}

view(data:any){
    localStorage.setItem('artistData',this.encrypt.enCrypt(JSON.stringify(data)));
    this.router.navigateByUrl('artist-data');
    // window.open(`${window.location.origin}/artist-data`)
}

clear(data:any){
  if(data == 'art'){
    this.filterForm.reset();
    this.displayData = this.artists.slice(0,10);
  }
  else if(data == 'inaug'){
    this.inaugfilterForm.reset();
    this.displayData = this.inaugArray.slice(0,10);
  }
  else{
    this.wishesfilterForm.reset();
    this.displayData = this.wishesArray.slice(0,10);
  }
  this.filteredData = [];
  this.filterApplied = false;
  this.startIndex = 1;
  this.endIndex = 5;
  this.first = 0;
  this.rows = 10;
}

filter(){
console.log(this.filterForm.value);
this.filterApplied = true
this.filteredData = this.artists.filter((item:any) => {
  // Function to check if a string contains a substring
  const containsSubstring = (str:any, substr:any) => str.toLowerCase().includes(substr.toLowerCase());

  // Filter by name
  if (this.filterForm.value.name && !containsSubstring(item.name, this.filterForm.value.name)) {
    return false;
  }

  // Filter by address
  if (
    this.filterForm.value.address &&
    !(
      containsSubstring(item.address, this.filterForm.value.address) ||
      containsSubstring(item.mandal, this.filterForm.value.address) ||
      containsSubstring(item.district, this.filterForm.value.address) ||
      containsSubstring(item.state, this.filterForm.value.address) ||
      containsSubstring(item.pincode.toString(), this.filterForm.value.address)
    )
  ) {
    return false;
  }

  // Filter by language
  if (
    this.filterForm.value.language &&
    !item.language.some((lang:any) => containsSubstring(lang, this.filterForm.value.language))
  ) {
    return false;
  }

  // Filter by skillName
  if (
    this.filterForm.value.skillName &&
    !(
      containsSubstring(item.skill.name, this.filterForm.value.skillName) ||
      item.skill.genre.some((genre:any) => containsSubstring(genre.name, this.filterForm.value.skillName))
    )
  ) {
    return false;
  }

  // Filter by experience
  if (this.filterForm.value.experience && item.skill.experience !== parseInt(this.filterForm.value.experience)) {
    return false;
  }

  // Filter by rating (assuming it is a property of the item, adjust as needed)
  if (this.filterForm.value.rating && item.skill.rating !== parseInt(this.filterForm.value.rating)) {
    return false;
  }

  // If all conditions pass, include the item in the filtered result
  return true;
});
this.totalRecords = this.filteredData.length
this.displayData = this.filteredData.slice(0,10)
if(this.filteredData.length == 0){
  this.errorMessage = 'No Data Available with above filter!'
}
else{
  this.errorMessage = null
}
}

inaugFilter(){
  console.log(this.inaugfilterForm.value);
  this.filterApplied = true
  this.filteredData = this.inaugArray.filter((item:any) => {
    // Function to check if a string contains a substring
    const containsSubstring = (str:any, substr:any) => str.toLowerCase().includes(substr.toLowerCase());
  
    // Filter by name
    if (this.inaugfilterForm.value.name && !containsSubstring(item.name, this.inaugfilterForm.value.name)) {
      return false;
    }
  
    // Filter by address
    if (
      this.inaugfilterForm.value.address &&
      !(
        containsSubstring(item.address, this.inaugfilterForm.value.address) ||
        containsSubstring(item.mandal, this.inaugfilterForm.value.address) ||
        containsSubstring(item.district, this.inaugfilterForm.value.address) ||
        containsSubstring(item.state, this.inaugfilterForm.value.address) ||
        containsSubstring(item.pincode.toString(), this.inaugfilterForm.value.address)
      )
    ) {
      return false;
    }
  
    // Filter by language
    if (
      this.inaugfilterForm.value.language &&
      !item.language.some((lang:any) => containsSubstring(lang, this.inaugfilterForm.value.language))
    ) {
      return false;
    }
  
    // Filter by price
    if (this.inaugfilterForm.value.price && item.inaugPrice < parseInt(this.inaugfilterForm.value.price)) {
      return false;
    }
  
    // If all conditions pass, include the item in the filtered result
    return true;
  });
  this.totalRecords = this.filteredData.length
  this.displayData = this.filteredData.slice(0,10)
  if(this.filteredData.length == 0){
    this.errorMessage = 'No Data Available with above filter!'
  }
  else{
    this.errorMessage = null
  }
}

wishesFilter(){
  console.log(this.wishesfilterForm.value);
  this.filterApplied = true
  this.filteredData = this.wishesArray.filter((item:any) => {
    // Function to check if a string contains a substring
    const containsSubstring = (str:any, substr:any) => str.toLowerCase().includes(substr.toLowerCase());
  
    // Filter by name
    if (this.wishesfilterForm.value.name && !containsSubstring(item.name, this.wishesfilterForm.value.name)) {
      return false;
    }
  
    // Filter by language
    if (
      this.wishesfilterForm.value.language &&
      !item.language.some((lang:any) => containsSubstring(lang, this.wishesfilterForm.value.language))
    ) {
      return false;
    }
  
    // Filter by price
    if (this.wishesfilterForm.value.price && item.wishesPrice < parseInt(this.wishesfilterForm.value.price)) {
      return false;
    }
  
    // If all conditions pass, include the item in the filtered result
    return true;
  });
  this.totalRecords = this.filteredData.length
  this.displayData = this.filteredData.slice(0,10)
  if(this.filteredData.length == 0){
    this.errorMessage = 'No Data Available with above filter!'
  }
  else{
    this.errorMessage = null
  }
}

change(key:any){
  for (const prop in this.show) {
    if (this.show.hasOwnProperty(prop)) {
      this.show[prop] = prop === key;
    }
  }
  this.filteredData = [];
  this.errorMessage = null;
  this.startIndex = 1;
  this.endIndex = 5;
  this.first = 0;
  this.rows = 10;
  this.filterApplied = false;
  if(this.show.showArt){
    if(this.artists.length > 0){
      this.totalRecords = this.artists.length;
      this.displayData = this.artists.slice(0,10);
    }
  }
  else if(this.show.showInaug){
    if(this.inaugArray.length > 0){
      this.totalRecords = this.inaugArray.length;
      this.displayData = this.inaugArray.slice(0,10);
    }
  }
  else{
    if(this.wishesArray.length > 0){
      this.totalRecords = this.wishesArray.length;
      this.displayData = this.wishesArray.slice(0,10);
    }
  }
}

bookInaug(data:any){
console.log(data);
this.fetchAvailable(data._id)
this.price = data.inaugPrice;
this.inaugForm.controls.price.setValue(data.inaugPrice);
this.inaugForm.controls.artistId.setValue(data._id);
this.inaugForm.controls.artistName.setValue(data.name);
this.inaugForm.controls.artistPhone.setValue(data.phoneNo);
this.inaugForm.controls.artistEmail.setValue(data.email);
$('#bookInaug').modal('show')
}

bookWishes(data:any){
console.log(data);
this.price = data.wishesPrice;
this.wishesForm.controls.price.setValue(data.wishesPrice);
this.wishesForm.controls.artistId.setValue(data._id);
this.wishesForm.controls.artistName.setValue(data.name);
this.wishesForm.controls.artistPhone.setValue(data.phoneNo);
this.wishesForm.controls.artistEmail.setValue(data.email);
$('#bookWishes').modal('show')
}

get g() { return this.wishesForm.controls; }
get f() { return this.inaugForm.controls; }

updateWishesPay(data:any){
  if(data == 'paynow'){
    this.wishesForm.controls.paid.setValue(true);
    this.wishesForm.addControl('paymentType', new FormControl('online', Validators.required));
  }
  else{
    this.wishesForm.controls.paid.setValue(false);
    this.wishesForm.removeControl('paymentType');
  }
}

updateInaugPay(data:any){
  if(data == 'paynow'){
    this.inaugForm.controls.paid.setValue(true);
    this.inaugForm.addControl('paymentType', new FormControl('online', Validators.required));
  }
  else{
    this.inaugForm.controls.paid.setValue(false);
    this.inaugForm.removeControl('paymentType');
  }
}

confirmbookWishes(){
  if(this.wishesForm.valid){
    if(this.wishesForm.value.paid){
      this.wishesForm.controls.commission.setValue(this.wishesForm.value.price*environment.artistCommission);
      this.wishesForm.addControl('paymentId', new FormControl(this.paymentId, Validators.required));
    }
    else{
      this.wishesForm.controls.commission.setValue(-(this.wishesForm.value.price*(1-environment.artistCommission)));
    }
    this.apiService.initiateLoading(true);
    this.apiService.bookWishes(this.wishesForm.value).subscribe(
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
      $('#bookWishes').modal('hide')
      }
      else if(res.status == 204){
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
      console.log(err);
    }
  ).add(()=>{
    this.apiService.initiateLoading(false);
  })
  }
  else{
    const controls = this.wishesForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            controls[name].markAsDirty()
        }
    }
  }
}

confirmbookInaug(){
  let date = this.inaugForm.value.date;
  let dates = this.availableData['event'];
  let isFound = false;
  console.log(this.inaugForm.value)
  if(this.inaugForm.valid){
    if(this.inaugForm.value.paid){
      this.inaugForm.controls.commission.setValue(this.inaugForm.value.price*environment.artistCommission);
      this.inaugForm.addControl('paymentId', new FormControl(this.paymentId, Validators.required));
    }
    else{
      this.inaugForm.controls.commission.setValue(-(this.inaugForm.value.price*(1-environment.artistCommission)));
    }
    for(let i of dates){
      if(new Date(i.date).toLocaleDateString() == new Date(date).toLocaleDateString()){
        isFound = true;
        break
      }
    }
    if(isFound){
      this.apiService.initiateLoading(true);
      this.apiService.bookInaug(this.inaugForm.value).subscribe(
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
        $('#bookInaug').modal('hide')
        }
        else if(res.status == 204){
          let msgData = {
              severity : "error",
              summary : 'Error',
              detail : res.data,
              life : 5000
            }
          this.apiService.sendMessage(msgData);
          if(res.data == 'Slot already booked'){
            this.fetchAvailable(this.inaugForm.value.artistId);
          }
        }
      },
      (err:any)=>{
        console.log(err);
      }
    ).add(()=>{
      this.apiService.initiateLoading(false);
    })
    }
    else{
      let msgData = {
        severity : "error",
        summary : 'Error',
        detail : 'date should be present in available dates',
        life : 5000
      }
      this.apiService.sendMessage(msgData);
      return
    }
  }
  else{
    const controls = this.inaugForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            controls[name].markAsDirty()
        }
    }
  }
}

fetchAvailable(id:any){
  this.apiService.initiateLoading(true);
  this.apiService.fetchAvailable({'id':id}).subscribe(
    (res:any)=>{
      if(res.status == 200){
        this.availableData = res.data
        console.log(this.availableData)
      }
      else if(res.status == 204){
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
    this.apiService.initiateLoading(false);
  })
}

buttonEvent(i:any,date:any,event:any){
  this.inaugForm.controls.date.setValue(date);
  let text = event.target.innerText[0];
  if(text == '4'){
    this.inaugForm.controls.slot.setValue(1);
  }
  else if(text == '9'){
    this.inaugForm.controls.slot.setValue(2);
  }
  else if(text == '2'){
    this.inaugForm.controls.slot.setValue(3);
  }
  else if(text == '7'){
    this.inaugForm.controls.slot.setValue(4);
  }
  else if(text == '1'){
    this.inaugForm.controls.slot.setValue(5);
  }
  for(let i in this.availableData.event){
    for(let j in this.availableData.event[i].slots){
      let id = 'btn' + i + j
      document.getElementById(id)?.classList.remove('btn-clicked');
    }
  }
  document.getElementById(event.target.id)?.classList.add('btn-clicked');
}

razor(data:any){
  let payload;
  if(data == 'wishes'){
    if(this.wishesForm.valid){
      console.log(this.wishesForm.value);
      payload = {
        price:this.wishesForm.value.price*100
      }
      this.createOrder(payload,data);
    }
    else{
      const controls = this.wishesForm.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
              controls[name].markAsDirty()
          }
      }
    }
  }
  else{
    if(this.inaugForm.valid){
      console.log(this.inaugForm.value);
      payload = {
        price:this.inaugForm.value.price*100
      }
      this.createOrder(payload,data);
    }
    else{
      const controls = this.inaugForm.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
              controls[name].markAsDirty()
          }
      }
    }
  }
}

createOrder(payload:any,data:any){
  this.apiService.initiateLoading(true)
  this.apiService.createOrder(payload).subscribe(
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
            "description" : data
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
            "ondismiss":(response:any)=>{
              console.log(response)
            }
          },
          "handler": (response:any)=>{ 
            response.type = data;
            response.price = payload.price;
            console.log(response)
            var event = new CustomEvent("payment.success", 
            {
                detail: response,
                bubbles: true,
                cancelable: true
            }
          );    
          window.dispatchEvent(event);
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
        this.apiService.sendMessage(msgData);
        return
      }
    },
    (err:any)=>{
      console.log(err)
    }
  ).add(()=>{
    this.apiService.initiateLoading(false)
  })
}

@HostListener('window:payment.success', ['$event']) 
onPaymentSuccess(event:any): void {
  let payload = {
    razorpayOrderId: event.detail.razorpay_order_id,
    razorpayPaymentId: event.detail.razorpay_payment_id,
    razorpaySignature: event.detail.razorpay_signature
    }
    this.paymentId = [event.detail.razorpay_payment_id]
    console.log(this.paymentId)
    this.apiService.initiateLoading(true)
    this.apiService.verifyOrder(payload).subscribe(
    (res:any) => {
      if(res.status == 200){
        let mailPayload = {
          paymentId : event.detail.razorpay_payment_id,
          price : event.detail.price
        }
        this.apiService.sendMail(mailPayload).subscribe()
        if(event.detail.type == 'wishes'){
          this.confirmbookWishes();
        }
        else{
          this.confirmbookInaug();
        }
        console.log(res)
      }
      else if(res.status == 204){
        let msgData = {
          severity : "error",
          summary : 'Error',
          detail : res.data,
          life : 5000
        }
        this.apiService.sendMessage(msgData);
        return
      }
    },
    (err:any) => {
        console.log(err.error.message);
    }
    ).add(()=>{
      this.apiService.initiateLoading(false)
    });
}

}
