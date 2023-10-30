import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { dateRenderer } from '../dateRenderer';
import { Router } from '@angular/router';
import { contactDetailsRenderer } from '../all-approvers/contactRenderer';
import { genreRendererArtistApprove } from './genreRenderer';
import { editRendererArtistApprove } from './editRenderer';

declare const $:any;

@Component({
  selector: 'app-artist-approve',
  templateUrl: './artist-approve.component.html',
  styleUrls: ['./artist-approve.component.css']
})
export class ArtistApproveComponent implements OnInit{

  errorMessage : any;
  usersRowData:any = [];
  usersColumnDefs = [
    {
      field: "name",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Name",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "action",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Contact",
      cellRenderer: contactDetailsRenderer,
      width:150
    },
    {
      field: "skill.experience",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Experience",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value} years`
    },
    {
      field: "skill.validated",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Validated",
      cellRenderer: (params:any)=> {
        if(params.value == null){
          return 'N/A'
        }
        else{
          if(params.value == 'a'){
            let link = `<span class="badge badge-soft-success" style="font-size:13px">Approved</span>`;
            return link
          }
          else if(params.value == 'r'){
            let link = `<span class="badge badge-soft-danger" style="font-size:13px">Rejected</span>`;
            return link
          }
          else if(params.value == 'nv'){
            let link = `<span class="badge badge-soft-warning" style="font-size:13px">Not Validated</span>`;
            return link
          }
          else{
            return 'N/A'
          }
        }
      }
    },
    {
      field: "skill.status",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Status",
      cellRenderer: (params:any)=> {
        if(params.value == null){
          return 'N/A'
        }
        else{
          if(params.value == 'active'){
            let link = `<span class="badge badge-soft-success" style="font-size:13px">${params.value}</span>`;
            return link
          }
          else{
            let link = `<span class="badge badge-soft-danger" style="font-size:13px">${params.value}</span>`;
            return link
          }
        }
      }
    },
    {
      field: "skill.pricing.hourly",
      filter: "agDateColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Hourly Pricing",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value} ₹`
    },
    {
      field: "skill.pricing.fullDay",
      filter: "agDateColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Full Day Pricing",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value} ₹`
    },
    {
      field: "skill.pricing.event",
      filter: "agDateColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Event based Pricing",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value} ₹`
    },
    {
      field: "action",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "View Genre",
      cellRenderer: genreRendererArtistApprove,
      cellRendererParams: { onStatusChange: this.viewGenre.bind(this) }
    },
    {
      field: "action",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Edit",
      cellRenderer: editRendererArtistApprove,
      // cellRendererParams: { onStatusChange: this.viewJD.bind(this) }
    }
  ];
  genreColumnDefs = [
    {
      field: "name",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Skill Name",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "experience",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Experience",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value} years`
    },
    {
      field: "validated",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Validated",
      cellRenderer: (params:any)=> {
        if(params.value == null){
          return 'N/A'
        }
        else{
          if(params.value == 'a'){
            let link = `<span class="badge badge-soft-success" style="font-size:13px">Approved</span>`;
            return link
          }
          else if(params.value == 'r'){
            let link = `<span class="badge badge-soft-danger" style="font-size:13px">Rejected</span>`;
            return link
          }
          else if(params.value == 'nv'){
            let link = `<span class="badge badge-soft-warning" style="font-size:13px">Not Validated</span>`;
            return link
          }
          else{
            return 'N/A'
          }
        }
      }
    },
    {
      field: "status",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Status",
      cellRenderer: (params:any)=> {
        if(params.value == null){
          return 'N/A'
        }
        else{
          if(params.value == 'active'){
            let link = `<span class="badge badge-soft-success" style="font-size:13px">${params.value}</span>`;
            return link
          }
          else{
            let link = `<span class="badge badge-soft-danger" style="font-size:13px">${params.value}</span>`;
            return link
          }
        }
      }
    }
  ];
  genreRowData:any;
  defaultColDef : ColDef = {
    sortable:true,filter:true,resizable:true
  }
  pagination:any = true;
  gridApi:any;
  gridApi1:any;

  constructor(private apiService:ApiService,private router:Router){}

  ngOnInit(): void {
    this.apiService.initiateLoading(true);
    this.apiService.pendingArtists().subscribe(
      (res:any)=>{
        if(res.status == 200){
          const newArray:any = [];
          res.data.forEach((person:any) => {
              person.skills.forEach((skill:any) => {
                  newArray.push({
                      name: person.name,
                      email: person.email,
                      phoneNo: person.phoneNo,
                      skill: skill
                  });
              });
          });
          console.log(newArray)
          this.usersRowData = newArray;
        }
        else if(res.status == 204){
          if(res.data == 'Invalid token'){
            localStorage.clear();
            this.router.navigate(['/account/login']);
          }
          else{
            this.errorMessage = res.data;
          }
        }
      },
      (err:any)=>{
        console.log(err)
      }
    ).add(()=>{
      this.apiService.initiateLoading(false)
    })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onGridReady1(params: GridReadyEvent) {
    this.gridApi1 = params.api;
  }

  filter(){
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  filter1(){
    this.gridApi1.setQuickFilter(
      (document.getElementById('filter-text-box1') as HTMLInputElement).value
    );
  }

  refresh(){
    this.ngOnInit();
  }

  viewGenre(data:any){
    console.log(data)
    $('#viewGenreModal').modal('show');
    this.genreRowData = data
  }


}
