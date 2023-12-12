import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { contactDetailsRenderer } from '../all-approvers/contactRenderer';
import { dateRenderer } from '../dateRenderer';
import { ApiService } from '../services/api.service';
import { slotRenderer } from '../user-history/slotRenderer';
import { userHistoryTimeRenderer } from '../user-history/userHistoryTimeRenderer';
import { artistfeedbackRenderer } from './feedbackRenderer';

declare const $:any;

@Component({
  selector: 'app-artist-history',
  templateUrl: './artist-history.component.html',
  styleUrls: ['./artist-history.component.css']
})
export class ArtistHistoryComponent  implements OnInit{

  constructor(private apiService : ApiService,private router:Router){}

  errorMessage : any;
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
      editable: (params:any) => {
        if(new Date(params.data.date)<new Date() && params.data.status != 'c' && params.data.status != 'r'){
          return true
        }
        else{
          return false
        }
      },
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params:any) => {
        const status = params.value;
        let date = new Date(params.data.date)
        if(date<new Date()){
          if(status == 'r'){
            return {
              values: ['rejected']
            }
          }
          else{
            return {
              values: ['completed','artist not attended','cancelled','Discard Editing']
            }
          }
        }
        else{
          if(status == 'a'){
            return {
              values: ['accepted']
            }
          }
          else if(status == 'r'){
            return {
              values: ['rejected']
            }
          }
          else{
            return {
              values: [status]
            }
          }
        }
    },
      cellRenderer: (params:any)=> {
        if(params.value == null){
          return 'N/A'
        }
        else{
          if(params.value == 'pending'){
            let link = `<span class="badge badge-soft-warning" style="font-size:13px">Pending</span>`;
            return link
          }
          else if(params.value == 'a' || params.value == 'accepted'){
            let link = `<span class="badge badge-soft-info" style="font-size:13px">Accepted</span>`;
            return link
          }
          else if(params.value == 'r' || params.value == 'artist not attended' || params.value == 'cancelled'){
            let text = ''
            if(params.value == 'r'){
              text = 'Rejected'
            }
            else text = params.value
            let link = `<span class="badge badge-soft-danger" style="font-size:13px">${text}</span>`;
            return link
          }
          else if(params.value == 'c'){
            let link = `<span class="badge badge-soft-success" style="font-size:13px">Completed</span>`;
            return link
          }
          else if(params.value == 'completed'){
            let link = `<span class="badge badge-soft-success" style="font-size:13px">Completed</span>`;
            return link
          }
          else if(params.value == 'rescheduled'){
            let link = `<span class="badge badge-soft-warning" style="font-size:13px">Rescheduled</span>`;
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
      field: "paid",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Paid",
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
      field: "action",
      headerName: "View Feedback",
      cellRenderer: artistfeedbackRenderer,
      cellRendererParams: { onStatusChange: this.viewFeedback.bind(this) }
    }
  ];
  modifiedRows:any=[];
  public rowSelection: 'single' | 'multiple' = 'multiple';
  defaultColDef : ColDef = {
    sortable:true,filter:true,resizable:true
  }
  pagination:any = true;
  gridApi:any;
  feedback:any;
  rating:any;

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

  viewFeedback(data:any){
    if(data.feedback){
      this.feedback = data.feedback
      this.rating = data.rating
    }
    else{
      this.feedback = '';
      this.rating = ''
    }
    $('#viewFeedback').modal('show')
  }

  onRowValueChanged(event:any) {
    // console.log(event)
    if(event.value == 'Discard Editing'){
      event.node.setDataValue(event.colDef.field, event.oldValue);
    }
    const existingRow = this.modifiedRows.find((row:any) => row.id === event.data._id);
    let status = ''
    if(event.data.status == 'completed'){
      status = 'c'
    }
    else status = event.data.status;
    let obj = {
      id : event.data._id,
      status : status,
      candName : event.data.candName,
      candPhone : event.data.phoneNo,
      candEmail : event.data.email,
      bookingType : event.data.bookingType,
      type : event.data.type,
      date : event.data.date,
      name : event.data.name
    }
    if (!existingRow) {
      this.modifiedRows.push(obj)
    }
    else{
      for(let i of this.modifiedRows){
        if(i.id == event.data._id){
          i.status = status;
          break;
        }
      }
    }
    console.log(this.modifiedRows)
  }

  updateMultipleStatus(){
    if(this.modifiedRows.length>0){
      this.apiService.initiateLoading(true);
      this.apiService.updateEvent(this.modifiedRows).subscribe(
      (res : any)=>{
        console.log(res)
        if(res.status == 200){
          let msgData = {
            severity : "success",
            summary : 'Success',
            detail : res.data,
            life : 5000
          }
        this.apiService.sendMessage(msgData);
        $(`#approve`).modal('hide');
        $(`#reject`).modal('hide');
        this.usersRowData = [];
        this.errorMessage = null;
        this.refresh();
        }
        else if(res.status == 204){
          let msgData = {
              severity : "error",
              summary : 'Error',
              detail : res.data,
              life : 5000
            }
          this.apiService.sendMessage(msgData);
        }
      },
      (err:any)=>{
        console.log(err);
      }
    ).add(()=>{
      this.apiService.initiateLoading(false)
    })
    }
    else{
      let msgData = {
        severity : "error",
        summary : 'Error',
        detail : 'Edit atleast one row',
        life : 5000
      }
      this.apiService.sendMessage(msgData);
    }
  }

}