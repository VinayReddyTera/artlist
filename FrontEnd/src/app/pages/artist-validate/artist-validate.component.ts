import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormControl, Validators, FormArray, AbstractControl, FormGroup  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from '../services/encryption.service';

@Component({
  selector: 'app-artist-validate',
  templateUrl: './artist-validate.component.html',
  styleUrls: ['./artist-validate.component.css']
})
export class ArtistValidateComponent implements OnInit{

  constructor(private apiService: ApiService, private fb: FormBuilder,private route:ActivatedRoute,
    private encryptionService: EncryptionService,private router : Router){}

  updateData:any;

  ngOnInit(): void {
    if(localStorage.getItem('approveSkill')){
      this.updateData = JSON.parse(this.encryptionService.deCrypt(localStorage.getItem('approveSkill')));
      console.log(this.updateData)
    }
  }
}
