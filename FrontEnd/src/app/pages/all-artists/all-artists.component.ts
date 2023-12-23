import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EncryptionService } from '../services/encryption.service';
import { FormBuilder } from '@angular/forms';

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

constructor(private apiService:ApiService,private router:Router,private encrypt:EncryptionService,private fb: FormBuilder){}

ngOnInit() {
   this.apiService.initiateLoading(true);
   this.apiService.getArtists().subscribe(
    (res:any)=>{
      if(res.status == 200){
        console.log(res.data)
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
        this.artists = newArray;
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
}

onPageChange(event: any) {
  this.first = event.first;
  this.rows = event.rows;
  if(this.filterApplied){
    this.displayData = this.filteredData.slice(this.first,this.first+this.rows)
  }
  else{
    this.displayData = this.artists.slice(this.first,this.first+this.rows)
  }
}

view(data:any){
    localStorage.setItem('artistData',this.encrypt.enCrypt(JSON.stringify(data)));
    this.router.navigateByUrl('artist-data');
    // window.open(`${window.location.origin}/artist-data`)
}

clear(){
  this.filterForm.reset();
  this.displayData = this.artists.slice(0,10);
  this.filteredData = [];
  this.filterApplied = false
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

}
