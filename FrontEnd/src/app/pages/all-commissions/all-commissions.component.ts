import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { contactDetailsRenderer } from '../all-approvers/contactRenderer';
import { dateRenderer } from '../dateRenderer';
import { ApiService } from '../services/api.service';
import { commissionRenderer } from './commissionRenderer';
import { payCommissionRenderer } from './payCommission';

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
      headerName: "Artist Name",
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
      headerName: "View Details",
      cellRenderer: commissionRenderer,
      cellRendererParams: { onStatusChange: this.viewAll.bind(this) }
    },
    {
      field: "action",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Pay Now",
      cellRenderer: payCommissionRenderer,
      cellRendererParams: { onStatusChange: this.paynow.bind(this) }
    }
  ];
  payColumnDefs = [
    {
      field: "paid",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "User Paid",
      cellRenderer: (params:any)=> {
        if(params.value == null){
          return 'N/A'
        }
        else{
          if(params.value == false){
            let link = `<span class="badge badge-soft-danger" style="font-size:13px">Not Paid</span>`;
            return link
          }
          else if(params.value == true){
            let link = `<span class="badge badge-soft-success" style="font-size:13px">Paid</span>`;
            return link
          }
          else{
            return 'N/A'
          }
        }
      }
    },
    {
      field: "commissionPaid",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Commission Status",
      cellRenderer: (params:any)=> {
        if(params.value == null){
          return 'N/A'
        }
        else{
          if(params.value == 'Not Paid'){
            let link = `<span class="badge badge-soft-danger" style="font-size:13px">Not Paid</span>`;
            return link
          }
          else{
            return 'N/A'
          }
        }
      }
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
      field: "price",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Price",
      cellRenderer: (params:any)=> {
        if(params.value == null){
          return 'N/A'
        }
        else{
          let data = `<span class="text-success">${params.value} ₹</span>`
          return data
        }
      }
    },
    {
      field: "paymentType",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Payment Type",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "name",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Skill Name",
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
          if(params.value == 'pending'){
            let link = `<span class="badge badge-soft-warning" style="font-size:13px">Pending</span>`;
            return link
          }
          else if(params.value == 'a'){
            let link = `<span class="badge badge-soft-info" style="font-size:13px">Accepted</span>`;
            return link
          }
          else if(params.value == 'r'){
            let link = `<span class="badge badge-soft-danger" style="font-size:13px">rejected</span>`;
            return link
          }
          else if(params.value == 'c'){
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
      field: "type",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Booking Type",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "date",
      filter: "agDateColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Date",
      cellRenderer: dateRenderer
    }
  ];
  defaultColDef : ColDef = {
    sortable:true,filter:true,resizable:true
  }
  pagination:any = true;
  gridApi:any;
  gridApi1:any;
  feedback:any;
  rating:any;
  text:any;
  commission:any = 0;
  showBtn: Boolean = false;
  paymentData:any;

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
          this.errorMessage = res.data;
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
      this.commission = Math.round(this.commission);
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
    this.commission = 0;
    this.showBtn = false;
    this.usersRowData = [];
    this.ngOnInit();
  }

  paynow(data:any){
    this.paymentData = data;
    console.log(data)
    $(`#payNow`).modal('show');
  }

  pay(){
    let payload:any = {
      id : [],
      artistId:this.paymentData.artistId,
      email: this.paymentData.email,
      name : this.paymentData.candName,
      commission:Math.round(this.paymentData.commission)
    }
    for(let i of this.paymentData.data){
      payload.id.push(i._id)
    }
    console.log(payload)
    if(payload.id.length>0){
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
        this.apiService.initiateLoading(false);
        $(`#payNow`).modal('hide');
        $(`#viewPay`).modal('hide');
        this.refresh();
      })
    }
  }

  viewAll(data:any){
    console.log(data);
    this.paymentData = data;
    $(`#viewPay`).modal('show');
  }

}
