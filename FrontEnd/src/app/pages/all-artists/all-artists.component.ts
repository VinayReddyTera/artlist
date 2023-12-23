import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EncryptionService } from '../services/encryption.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

declare const $:any;

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

constructor(private apiService:ApiService,private router:Router,private encrypt:EncryptionService,private fb: FormBuilder){}

ngOnInit() {
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
    artistName:[''],
    artistPhone:[''],
    artistEmail:['']
  })
  this.inaugForm = this.fb.group({
    bookingType:['onsite'],
    type:['inauguration'],
    date:['',[Validators.required]],
    artistId:[''],
    modifiedBy:['user'],
    price:[''],
    commission:[''],
    inaug:[true],
    paid:[true],
    artistName:[''],
    artistPhone:[''],
    artistEmail:['']
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

get f() { return this.wishesForm.controls; }

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
      this.wishesForm.controls.commission.setValue(this.wishesForm.value.price*0.95);
    }
    else{
      this.wishesForm.controls.commission.setValue(-(this.wishesForm.value.price*0.05));
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

}
