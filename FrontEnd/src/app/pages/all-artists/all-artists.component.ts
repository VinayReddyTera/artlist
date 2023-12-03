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

rows: number = 10;
totalRecords : any;
startIndex = 1;
endIndex = 5;
filteredData:any = [];
filterForm : any;

constructor(private apiService:ApiService,private router:Router,private encrypt:EncryptionService,private fb: FormBuilder){}

ngOnInit() {
  //  this.apiService.initiateLoading(true);
  //  this.apiService.getArtists().subscribe(
  //   (res:any)=>{
  //     if(res.status == 200){
  //       const newArray:any = [];
  //       res.data.forEach((person:any) => {
  //           person.skills.forEach((skill:any) => {
  //               newArray.push({
  //                   id: person._id,
  //                   name: person.name,
  //                   email: person.email,
  //                   phoneNo: person.phoneNo,
  //                   address: person.address,
  //                   mandal: person.mandal,
  //                   district: person.district,
  //                   state: person.state,
  //                   pincode: person.pincode,
  //                   language: person.language,
  //                   skill: skill
  //               });
  //           });
  //       });
  //       console.log(newArray)
  //       this.artists = newArray;
  //     }
  //     else if(res.status == 204){
  //       let msgData = {
  //         severity : "error",
  //         summary : 'Error',
  //         detail : res.data,
  //         life : 5000
  //       }
  //       this.apiService.sendMessage(msgData);
  //     }
  //   },
  //   (err:any)=>{
  //     console.log(err)
  //   }
  // ).add(()=>{
  //   this.apiService.initiateLoading(false)
  // })
  console.log(this.artists[0])
  if(this.artists.length > 0){
    this.totalRecords = this.artists.length;
    this.filteredData = this.artists.slice(0,10)
  }
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
  this.filteredData = this.artists.slice(this.first,this.first+this.rows)
}

view(data:any){
    localStorage.setItem('artistData',this.encrypt.enCrypt(JSON.stringify(data)));
    this.router.navigateByUrl('artist-data');
    // window.open(`${window.location.origin}/artist-data`)
}

clear(){
  this.filterForm.reset()
}

filter(){
console.log(this.filterForm.value)
}

}
