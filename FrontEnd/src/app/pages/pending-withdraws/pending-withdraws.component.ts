import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { dateRenderer } from '../dateRenderer';
import { ApiService } from '../services/api.service';
import { withdrawPayRenderer } from './pay';
import { pendingRenderer } from './pending-contact';
import { historyRenderer } from './viewHistory';

declare const $:any;

@Component({
  selector: 'app-pending-withdraws',
  templateUrl: './pending-withdraws.component.html',
  styleUrls: ['./pending-withdraws.component.css']
})
export class PendingWithdrawsComponent implements OnInit{

  constructor(private apiService : ApiService,private router:Router){}

  errorMessage : any;
  successMessage : any;
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
      cellRenderer: pendingRenderer,
      width:150
    },
    {
      field: "role",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Role",
      width:150
    },
    {
      field: "amount",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Amount",
      width:150
    },
    {
      field: "type",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Type",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "status",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Status",
      hide:true,
      cellRenderer: (params:any)=> {
        if(params.value == null){
          return 'N/A'
        }
        else{
          if(params.value == 'Pending'){
            let link = `<span class="badge badge-soft-warning" style="font-size:13px">Pending</span>`;
            return link
          }
          else if(params.value == 'Completed'){
            let link = `<span class="badge badge-soft-success" style="font-size:13px">Completed</span>`;
            return link
          }
          else{
            return params.value
          }
        }
      }
    },
    {
      field: "date",
      filter: "agDateColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Date",
      cellRenderer: dateRenderer
    },
    {
      field: "action",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "View Withdraw Data",
      cellRenderer: historyRenderer,
      cellRendererParams: { onStatusChange: this.viewHistory.bind(this) },
      width:150
    },
    {
      field: "action",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Pay Now",
      cellRenderer: withdrawPayRenderer,
      cellRendererParams: { onStatusChange: this.pay.bind(this) }
    }
  ];
  payColumnDefs = [
    {
      field: "type",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Type",
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
          if(params.value == 'Pending'){
            let link = `<span class="badge badge-soft-warning" style="font-size:13px">Pending</span>`;
            return link
          }
          else if(params.value == 'Completed'){
            let link = `<span class="badge badge-soft-success" style="font-size:13px">Completed</span>`;
            return link
          }
          else if(params.value == 'Rejected'){
            let link = `<span class="badge badge-soft-danger" style="font-size:13px">Rejected</span>`;
            return link
          }
          else{
            return params.value
          }
        }
      }
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
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    }
  ];
  defaultColDef : ColDef = {
    sortable:true,filter:true,resizable:true
  }
  pagination:any = true;
  gridApi:any;
  gridApi1:any;
  groupData:any;
  normalData:any;
  paymentData:any;
  payloadData:any;

  ngOnInit(): void {
    this.apiService.initiateLoading(true);
    this.apiService.fetchPendingWithdraws().subscribe(
      (res:any)=>{
        if(res.status == 200){
          const transformedArray = res.data.flatMap((user:any) =>
            user.withdrawHistory.map((history:any) => ({
              _id: user._id,
              name: user.name,
              email: user.email,
              phoneNo: user.phoneNo,
              role: user.role,
              amount: history.amount,
              date: history.date,
              group : false,
              historyId: history._id,
              status: history.status,
              type: history.type
            }))
          );
          this.groupData = res.data.map((user:any) => {
            const totalAmount = user.withdrawHistory.reduce((sum:any, history:any) => sum + history.amount, 0);
          
            return {
              _id: user._id,
              name: user.name,
              email: user.email,
              phoneNo: user.phoneNo,
              role: user.role,
              amount: totalAmount,
              group:true,
              withdrawHistory : user.withdrawHistory
            };
          });
          this.normalData = transformedArray
          this.usersRowData = this.groupData
          console.log(this.groupData)
          console.log(transformedArray)
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
  onGridReady1(params: GridReadyEvent) {
    this.gridApi1 = params.api;
  }

  filter1(){
    this.gridApi1.setQuickFilter(
      (document.getElementById('filter-text-box1') as HTMLInputElement).value
    );
  }

  filter(){
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  refresh(){
    this.usersRowData = [];
    this.normalData = [];
    this.groupData = [];
    this.ngOnInit();
  }

  viewHistory(data:any){
    console.log(data)
    this.paymentData = data.withdrawHistory;
    $(`#viewPay`).modal('show');
  }

  pay(data:any){
    this.payloadData = data;
    console.log(data)
    $(`#viewConfirm`).modal('show');
  }

  paynow(){
    let value = (<HTMLInputElement>document.getElementById('check'));
    let payload:any = {
      role : this.payloadData.role,
      name : this.payloadData.name,
      email : this.payloadData.email,
      amount : this.payloadData.amount,
      ids : []
    };
    if(value.checked){
      for(let i of this.payloadData.withdrawHistory){
        payload.ids.push(i._id)
      }
    }
    else{
      payload.ids.push(this.payloadData.historyId)
    }
    console.log(payload)
    if(payload.ids.length>0){
      this.apiService.initiateLoading(true);
      this.apiService.payBalance(payload).subscribe(
        (res:any)=>{
          if(res.status == 200){
            let msgData = {
              severity : "success",
              summary : 'Success',
              detail : res.data,
              life : 5000
            }
            this.apiService.sendMessage(msgData);
            $(`#viewConfirm`).modal('hide');
            this.refresh()
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
              let msgData = {
                severity : "error",
                summary : 'Error',
                detail : res.data,
                life : 5000
              }
              this.apiService.sendMessage(msgData);
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
  }

  change(){
    let data = (<HTMLInputElement>document.getElementById('check'));
    if(data.checked){
      this.usersRowData = this.groupData;
    }
    else{
      this.usersRowData = this.normalData
    }
  }

}
