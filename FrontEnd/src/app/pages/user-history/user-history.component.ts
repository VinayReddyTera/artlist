import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.css']
})
export class UserHistoryComponent implements OnInit{

  constructor(private apiService : ApiService,private router:Router){}

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
    }
  ];
  defaultColDef : ColDef = {
    sortable:true,filter:true,resizable:true
  }
  pagination:any = true;
  gridApi:any;

  ngOnInit(): void {
    this.apiService.initiateLoading(true);
    this.apiService.fetchHistory().subscribe(
      (res:any)=>{
        if(res.status == 200){
          this.usersRowData = res.data;
          console.log(this.usersRowData)
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

  filter(){
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  refresh(){
    this.ngOnInit();
  }

}
