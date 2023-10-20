import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { Router } from '@angular/router';
import { genreRenderer } from './genreRenderer';
import { editRenderer } from './editRenderer';

declare const $:any;

@Component({
  selector: 'app-skill-data',
  templateUrl: './skill-data.component.html',
  styleUrls: ['./skill-data.component.css']
})
export class SkillDataComponent {

  constructor(private apiService : ApiService,
    private spinner : NgxSpinnerService,private router:Router) { }
  
  errorMessage : any;
  usersRowData:any = [];
  usersColumnDefs = [
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
          if(params.value == true){
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
    },
    {
      field: "pricing.hourly",
      filter: "agDateColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Hourly Pricing",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value} ₹`
    },
    {
      field: "pricing.fullDay",
      filter: "agDateColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Full Day Pricing",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value} ₹`
    },
    {
      field: "pricing.event",
      filter: "agDateColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Event based Pricing",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value} ₹`
    },
    {
      field: "portfolio",
      filter: "agDateColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Portfolio",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value.toString()}`
    },
    {
      field: "action",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "View Genre",
      cellRenderer: genreRenderer,
      cellRendererParams: { onStatusChange: this.viewGenre.bind(this) }
    },
    {
      field: "action",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Edit",
      cellRenderer: editRenderer,
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
          if(params.value == true){
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
    },
    {
      field: "portfolio",
      filter: "agDateColumnFilter",
      filterParams: { suppressAndOrCondition: true },
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

}
