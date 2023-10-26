import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { Router } from '@angular/router';
import { editRenderer1 } from './editRenderer';
import { contactDetailsRenderer } from './contactRenderer';
import { dateRenderer } from '../dateRenderer';

@Component({
  selector: 'app-all-approvers',
  templateUrl: './all-approvers.component.html',
  styleUrls: ['./all-approvers.component.css']
})
export class AllApproversComponent implements OnInit {

  constructor(private apiService : ApiService,
    private spinner : NgxSpinnerService,private router:Router) { }
  
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
      field: "skillName",
      filter: "agDateColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Skills",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value.toString()}`
    },
    {
      field: "createdOn",
      filter: "agDateColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Date of Joining",
      cellRenderer: dateRenderer
    },
    {
      field: "action",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Edit",
      cellRenderer: editRenderer1
    }
  ];
  defaultColDef : ColDef = {
    sortable:true,filter:true,resizable:true
  }
  pagination:any = true;
  gridApi:any;

  ngOnInit(): void {
    this.spinner.show()
    this.apiService.allApprovers().subscribe(
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

  filter(){
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  refresh(){
    this.ngOnInit();
  }

}