import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EncryptionService } from '../services/encryption.service';

@Component({
  selector: 'app-artist-data',
  templateUrl: './artist-data.component.html',
  styleUrls: ['./artist-data.component.css']
})
export class ArtistDataComponent implements OnInit{

  constructor(private router:Router,private decrypt: EncryptionService,private apiservice:ApiService){}

  artistData:any;
  apiCalled:boolean=false

  ngOnInit(): void {
    if(localStorage.getItem('artistData')){
      this.artistData = JSON.parse(this.decrypt.deCrypt(localStorage.getItem('artistData')));
    }
    else{
      this.router.navigateByUrl('all-artists')
    }
    console.log(this.artistData)
  }

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

}
