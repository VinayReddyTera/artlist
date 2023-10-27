import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-artist-approve',
  templateUrl: './artist-approve.component.html',
  styleUrls: ['./artist-approve.component.css']
})
export class ArtistApproveComponent implements OnInit{

  constructor(private apiService:ApiService){}

  ngOnInit(): void {
    this.apiService.initiateLoading(true);
    this.apiService.pendingArtists().subscribe(
      (res:any)=>{
        console.log(res)
      },
      (err:any)=>{
        console.log(err)
      }
    ).add(()=>{
      this.apiService.initiateLoading(false)
    })
  }

}
