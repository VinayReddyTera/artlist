import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { dateRenderer } from '../dateRenderer';
import { ApiService } from '../services/api.service';
import { slotRenderer } from '../user-history/slotRenderer';
import { userHistoryTimeRenderer } from '../user-history/userHistoryTimeRenderer';
import { artistRenderer } from './artistContact';
import { refundAcceptRenderer } from './refundAccept';
import { userRenderer } from './userContact';

declare const $:any;

@Component({
  selector: 'app-refunds',
  templateUrl: './refunds.component.html',
  styleUrls: ['./refunds.component.css']
})
export class RefundsComponent implements OnInit{

  constructor(private apiService : ApiService,private router:Router){}

  errorMessage : any;
  successMessage : any;
  usersRowData:any = [];
  usersColumnDefs = [
    {
      field: "artistName",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Artist Name",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "action",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Artist Contact",
      cellRenderer: artistRenderer,
      width:150
    },
    {
      field: "candName",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "User Name",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "action",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "User Contact",
      cellRenderer: userRenderer,
      width:150
    },
    {
      field: "name",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Skill Name",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "type",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Booking Type",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "bookingType",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Event Type",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value,
      width:130
    },
    {
      field: "date",
      filter: "agDateColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Date",
      cellRenderer: dateRenderer
    },
    {
      field: "from",
      filter: "agDateColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "From",
      cellRenderer: userHistoryTimeRenderer
    },
    {
      field: "to",
      filter: "agDateColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "To",
      cellRenderer: userHistoryTimeRenderer
    },
    {
      field: "slot",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Slot",
      cellRenderer: slotRenderer
    },
    {
      field: "address",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Address",
      cellRenderer: (params:any)=> {
        if(params.value === '' || params.value === null || params.value === undefined){
          return 'N/A'
        }
        else{
          return params.value
        }
      }
    },
    {
      field: "mandal",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Mandal",
      cellRenderer: (params:any)=> {
        if(params.value === '' || params.value === null || params.value === undefined){
          return 'N/A'
        }
        else{
          return params.value
        }
      }
    },
    {
      field: "district",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "District",
      cellRenderer: (params:any)=> {
        if(params.value === '' || params.value === null || params.value === undefined){
          return 'N/A'
        }
        else{
          return params.value
        }
      }
    },
    {
      field: "state",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "State",
      cellRenderer: (params:any)=> {
        if(params.value === '' || params.value === null || params.value === undefined){
          return 'N/A'
        }
        else{
          return params.value
        }
      }
    },
    {
      field: "pincode",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Pincode",
      cellRenderer: (params:any)=> {
        if(params.value === '' || params.value === null || params.value === undefined){
          return 'N/A'
        }
        else{
          return params.value
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
      },
      width:130
    },
    {
      field: "paid",
      filter: "agDateColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Payment Status",
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
      field: "paymentType",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Payment Type",
      cellRenderer: (params:any)=> {
        if(params.value === '' || params.value === null || params.value === undefined){
          return 'N/A'
        }
        else{
          return params.value
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
          else if(params.value == 'Paid'){
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
      field: "commission",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Commission",
      cellRenderer: (params:any)=> {
        if(params.value === '' || params.value === null || params.value === undefined){
          return 'N/A'
        }
        else{
          return params.value
        }
      }
    },
    {
      field: "refundReason",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Refund Reason",
      cellRenderer: (params:any)=> {
        if(params.value === '' || params.value === null || params.value === undefined){
          return 'N/A'
        }
        else{
          return params.value
        }
      }
    },
    {
      field: "action",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Action",
      cellRenderer: refundAcceptRenderer,
      width:200,
      cellRendererParams: { onStatusChange: this.accept.bind(this) }
    }
  ];
  defaultColDef : ColDef = {
    sortable:true,filter:true,resizable:true
  }
  pagination:any = true;
  gridApi:any;
  rating:any;
  text:any;

  ngOnInit(): void {
    this.apiService.initiateLoading(true);
    this.apiService.fetchAllRefunds().subscribe(
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
      this.apiService.initiateLoading(false);
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

  accept(data:any,status:any){
    console.log(data);
    if(status == 'accept'){
      data.refundStatus = true;
    }
    else{
      data.refundStatus = false
    }
    console.log(data)
    this.apiService.initiateLoading(true);
    this.apiService.payRefund(data).subscribe(
      (res:any)=>{
        if(res.status == 200){
          let msgData = {
            severity : "success",
            summary : 'Success',
            detail : res.data,
            life : 5000
          }
          this.apiService.sendMessage(msgData);
          this.refresh()
        }
        else if(res.status == 204){
          let msgData = {
            severity : "error",
            summary : 'Error',
            detail : res.data,
            life : 5000
          }
          this.apiService.sendMessage(msgData);
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
      this.apiService.initiateLoading(false);
    })
  }

}