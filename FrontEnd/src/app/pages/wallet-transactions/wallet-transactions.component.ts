import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { dateRenderer } from '../dateRenderer';
import { ApiService } from '../services/api.service';

declare const $:any;

@Component({
  selector: 'app-wallet-transactions',
  templateUrl: './wallet-transactions.component.html',
  styleUrls: ['./wallet-transactions.component.css']
})
export class WalletTransactionsComponent implements OnInit{

  constructor(private apiService : ApiService,private router:Router){}

  errorMessage : any;
  successMessage : any;
  usersRowData:any = [];
  usersColumnDefs = [
    {
      field: "type",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Type",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "date",
      filter: "agDateColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Date",
      cellRenderer: dateRenderer
    },
    {
      field: "amount",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Amount",
      cellRenderer: (params:any)=> {
        if(params.value == null){
          return 'N/A'
        }
        else if(params.value < 0){
          let data = `<span class="badge badge-soft-danger font-size-13">${params.value} ₹</span>`
          return data
        }
        else if(params.value >= 0){
          let data = `<span class="badge badge-soft-success font-size-13">${params.value} ₹</span>`
          return data
        }
        else{
          return params.value
        }
      }
    }
  ];
  defaultColDef : ColDef = {
    sortable:true,filter:true,resizable:true
  }
  pagination:any = true;
  gridApi:any;
  amount:any;

  ngOnInit(): void {
    this.apiService.initiateLoading(true);
    this.apiService.fetchWalletWithdraws().subscribe(
      (res:any)=>{
        if(res.status == 200){
          this.usersRowData = res.data?.walletHistory;
          this.amount = res.data?.wallet;
          if(this.usersRowData.length == 0){
            this.successMessage = 'No Wallet Transactions Yet!'
          }
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
    this.usersRowData = [];
    this.ngOnInit();
  }

}
