import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { contactDetailsRenderer } from '../all-approvers/contactRenderer';
import { dateRenderer } from '../dateRenderer';
import { ApiService } from '../services/api.service';
import { commissionRenderer } from './commissionRenderer';

declare const $:any;

@Component({
  selector: 'app-all-commissions',
  templateUrl: './all-commissions.component.html',
  styleUrls: ['./all-commissions.component.css']
})
export class AllCommissionsComponent implements OnInit{

  constructor(private apiService : ApiService,private router:Router){}

  errorMessage : any;
  successMessage : any;
  usersRowData:any = [];
  usersColumnDefs = [
    {
      field: "candName",
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
      field: "commission",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Commission",
      cellRenderer: (params:any)=> {
        if(params.value == null){
          return 'N/A'
        }
        else{
          if(params.value < 0){
            let link = `<span class="text-danger" style="font-size:13px">${params.value} ₹</span>`;
            return link
          }
          else{
            let link = `<span class="text-success" style="font-size:13px">${params.value} ₹</span>`;
            return link
          }
        }
      }
    },
    {
      field: "action",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "View Genre",
      cellRenderer: commissionRenderer,
      cellRendererParams: { onStatusChange: this.viewAll.bind(this) }
    }
  ];
  defaultColDef : ColDef = {
    sortable:true,filter:true,resizable:true
  }
  pagination:any = true;
  gridApi:any;
  feedback:any;
  rating:any;
  text:any;
  commission:any = 0;
  showBtn: Boolean = false;

  ngOnInit(): void {
    this.apiService.initiateLoading(true);
    this.apiService.fetchAllUnpaidCommissions().subscribe(
      (res:any)=>{
        if(res.status == 200){
          console.log(res.data)
          this.usersRowData = res.data;
        }
        else if(res.status == 205){
          this.successMessage = res.data
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
      for(let i of this.usersRowData){
        this.commission += i.commission
      }
      if(this.commission > 0){
        this.text = 'Total amount you will receive from Artlist : '
      }
      else{
        this.showBtn = true;
        this.text = 'Total amount to be paid to Artlist : '
      }
      if(this.commission == 0){
        this.showBtn = false;
      }
      this.commission = Math.round(Math.abs(this.commission));
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
    this.commission = 0;
    this.showBtn = false;
  }

  pay(){
    let payload:any = [];
    for(let i of this.usersRowData){
      payload.push(i._id)
    }
    this.apiService.initiateLoading(true);
    this.apiService.payArtCommission(payload).subscribe(
      (res:any)=>{
        if(res.status == 200){
          let msgData = {
            severity : "success",
            summary : 'Success',
            detail : res.data,
            life : 5000
          }
        this.apiService.sendMessage(msgData);
        }
        else if(res.status == 204){
          if(res.data == 'Invalid token'){
            localStorage.clear();
            this.router.navigate(['/account/login']);
          }
          else{
            this.errorMessage = res.data;
            let msgData = {
              severity : "error",
              summary : 'Error',
              detail : res.data,
              life : 5000
            }
          this.apiService.sendMessage(msgData);
          }
        }
      },
      (err:any)=>{
        console.log(err)
      }
    ).add(()=>{
      this.apiService.initiateLoading(false)
      this.refresh()
    })
  }

  viewAll(data:any){
    console.log(data)
  }

}
