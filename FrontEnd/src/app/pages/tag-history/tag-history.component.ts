import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { Router } from '@angular/router';
import { contactDetailsRenderer } from '../all-approvers/contactRenderer';
import { genreRendererTagHistory } from './genreRenderer';

declare const $:any;

@Component({
  selector: 'app-tag-history',
  templateUrl: './tag-history.component.html',
  styleUrls: ['./tag-history.component.css']
})
export class TagHistoryComponent {

  constructor(private apiService : ApiService,
    private spinner : NgxSpinnerService,private router:Router) { }
  
  errorMessage : any;
  usersRowData:any = [];
  usersColumnDefs = [
    {
      field: "name",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Name",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "action",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Contact",
      cellRenderer: contactDetailsRenderer,
      width:150
    },
    {
      field: "skill.name",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Skill Name",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "skill.experience",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Experience",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value} years`
    },
    {
      field: "skill.validated",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
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
      field: "skill.feedback",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Feedback",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "skill.status",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
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
      filterParams: { maxNumConditions: 1 },
      headerName: "Hourly Pricing",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value} ₹`
    },
    {
      field: "skill.pricing.fullDay",
      filter: "agDateColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Full Day Pricing",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value} ₹`
    },
    {
      field: "skill.pricing.event",
      filter: "agDateColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Event based Pricing",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value} ₹`
    },
    {
      field: "skill.portfolio",
      filter: "agDateColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Portfolio",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value.toString()}`
    },
    {
      field: "action",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "View Genre",
      cellRenderer: genreRendererTagHistory,
      cellRendererParams: { onStatusChange: this.viewGenre.bind(this) }
    }
  ];
  genreColumnDefs = [
    {
      field: "name",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Skill Name",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "experience",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Experience",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value} years`
    },
    {
      field: "validated",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
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
      field: "feedback",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Feedback",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "status",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
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
      field: "portfolio",
      filter: "agDateColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Portfolio",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value.toString()}`
    }
  ];
  genreRowData:any;
  defaultColDef : ColDef = {
    sortable:true,filter:true,resizable:true
  }
  pagination:any = true;
  gridApi:any;
  gridApi1:any;

  ngOnInit(): void {
    this.spinner.show()
    this.apiService.getArtistHistory().subscribe(
      (res : any)=>{
        console.log(res)
        if(res.status == 200){
          let transformedArray:any = [];
          res.data.forEach((item:any) => {
            item.skills.forEach((skill:any) => {
                transformedArray.push({
                    name: item.name,
                    email: item.email,
                    phoneNo: item.phoneNo,
                    skill: skill,
                });
            });
          });
          console.log(transformedArray)
          this.usersRowData=transformedArray;
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
      (err)=>{
        this.errorMessage = err.error.message
      }
    ).add(()=>{
      this.spinner.hide()
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
