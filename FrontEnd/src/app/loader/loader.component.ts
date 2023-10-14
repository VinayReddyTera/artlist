import { Component, OnInit } from '@angular/core';
import { ApiService } from '../pages/services/api.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit{

  constructor(private apiService:ApiService){}

  loading:boolean = false;

  ngOnInit(): void {
    this.apiService.loader.subscribe((data:any) => {
      if(data){
        this.loading = true;
      }
      else{
        this.loading = false;
      }
    });
  }

}
