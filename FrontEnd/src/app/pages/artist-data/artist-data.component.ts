import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EncryptionService } from '../services/encryption.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

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

  ngOnInit(): void {
    if(localStorage.getItem('artistData')){
      this.artistData = JSON.parse(this.decrypt.deCrypt(localStorage.getItem('artistData')));
    }
    else{
      this.router.navigateByUrl('all-artists')
    }
    console.log(this.artistData)
    this.bookingForm = this.fb.group({
      type:['',[Validators.required]]
    })
  }

  // convenience getter for easy access to form fields
  get f() { return this.bookingForm.controls; }

  fetchAvailable(){
    if(!this.apiCalled){
      this.apiservice.initiateLoading(true);
      this.apiservice.fetchAvailable({'id':this.artistData.id}).subscribe(
        (res:any)=>{
          if(res.status == 200){
            console.log(res)
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
    console.log(this.bookingForm.value)
    if(this.bookingForm.valid){
      this.apiservice.initiateLoading(true);
      this.apiservice.login(this.bookingForm.value).subscribe(
      (res : any)=>{
        console.log(res)
        if(res.status == 200){
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
        console.log(err);
      }
    ).add(()=>{
      this.apiservice.initiateLoading(false)
    })
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
    if(this.bookingForm.value.type == 'hourly'){
      this.bookingForm.addControl('from', new FormControl('', Validators.required));
      this.bookingForm.addControl('to', new FormControl('', Validators.required));
      this.showFrom = true;
    }
    else{
      this.bookingForm.removeControl('from');
      this.bookingForm.removeControl('to');
      this.showFrom = false;
    }
  }

}
