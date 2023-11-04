import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptionService } from '../services/encryption.service';

@Component({
  selector: 'app-artist-data',
  templateUrl: './artist-data.component.html',
  styleUrls: ['./artist-data.component.css']
})
export class ArtistDataComponent implements OnInit{

  constructor(private router:Router,private decrypt: EncryptionService){}

  artistData:any;

  ngOnInit(): void {
    if(localStorage.getItem('artistData')){
      this.artistData = JSON.parse(this.decrypt.deCrypt(localStorage.getItem('artistData')));
    }
    else{
      this.router.navigateByUrl('all-artists')
    }
    console.log(this.artistData)
  }

}
