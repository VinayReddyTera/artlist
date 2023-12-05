import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { Router } from '@angular/router';
import { genreRenderer } from './genreRenderer';
import { editRenderer } from './editRenderer';
import { pricingRenderer } from './pricingRenderer';

declare const $:any;

@Component({
  selector: 'app-skill-data',
  templateUrl: './skill-data.component.html',
  styleUrls: ['./skill-data.component.css']
})
export class SkillDataComponent implements OnInit{

  constructor(private apiService : ApiService,
    private spinner : NgxSpinnerService,private router:Router) { }
  
  errorMessage : any;
  usersRowData:any = [];
  usersColumnDefs = [
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
      field: "action",
      headerName: "Pricing",
      cellRenderer: pricingRenderer,
      cellRendererParams: { onStatusChange: this.viewPricing.bind(this) }
    },
    {
      field: "portfolio",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Portfolio",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value.toString()}`
    },
    {
      field: "action",
      headerName: "View Genre",
      cellRenderer: genreRenderer,
      cellRendererParams: { onStatusChange: this.viewGenre.bind(this) }
    },
    {
      field: "action",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Edit",
      cellRenderer: editRenderer
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
  pricing:any;

  ngOnInit(): void {
    this.spinner.show()
    this.apiService.getArtistSkill().subscribe(
      (res : any)=>{
        if(res.status == 200){
          this.usersRowData = res.data;
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

  viewPricing(data:any){
    console.log(data)
    this.pricing = data
    $('#viewPricing').modal('show');
  }

}
