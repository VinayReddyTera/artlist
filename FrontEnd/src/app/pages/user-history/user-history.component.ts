import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { contactDetailsRenderer } from '../all-approvers/contactRenderer';
import { dateRenderer } from '../dateRenderer';
import { ApiService } from '../services/api.service';
import { feedbackRenderer } from './feedback';
import { slotRenderer } from './slotRenderer';
import { userHistoryTimeRenderer } from './userHistoryTimeRenderer';
import { FormBuilder, FormControl, Validators, FormArray, AbstractControl, FormGroup  } from '@angular/forms';

declare const $:any;

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.css']
})
export class UserHistoryComponent implements OnInit{

  constructor(private apiService : ApiService,private router:Router,private fb: FormBuilder){}

  errorMessage : any;
  usersRowData:any = [];
  usersColumnDefs = [
    {
      field: "candName",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Artist Name",
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
      field: "name",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Skill Name",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
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
          else if(params.value == 'rescheduled'){
            let link = `<span class="badge badge-soft-warning" style="font-size:13px">Rescheduled</span>`;
            return link
          }
          else{
            return 'N/A'
          }
        }
      }
    },
    {
      field: "type",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Booking Type",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "date",
      filter: "agDateColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Date",
      cellRenderer: dateRenderer
    },
    {
      field: "from",
      filter: "agDateColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "From",
      cellRenderer: userHistoryTimeRenderer
    },
    {
      field: "to",
      filter: "agDateColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "To",
      cellRenderer: userHistoryTimeRenderer
    },
    {
      field: "slot",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Slot",
      cellRenderer: slotRenderer
    },
    {
      field: "price",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
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
      field: "paid",
      filter: "agDateColumnFilter",
      filterParams: { suppressAndOrCondition: true },
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
      field: "action",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Give/View Feedback",
      cellRenderer: feedbackRenderer,
      cellRendererParams: { onStatusChange: this.viewFeedback.bind(this) }
    }
  ];
  defaultColDef : ColDef = {
    sortable:true,filter:true,resizable:true
  }
  pagination:any = true;
  gridApi:any;
  feedbackForm:any;

  ngOnInit(): void {
    this.feedbackForm = this.fb.group({
      feedback:['',[Validators.required]],
      id:['',[Validators.required]]
    })
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
    this.ngOnInit();
  }

  viewFeedback(data:any){
    if(data.date>new Date()){
      this.feedbackForm.controls.id.setValue(data._id);
      if(data.feedback){
        this.feedbackForm.controls.feedback.setValue(data.feedback);
      }
      else{
        this.feedbackForm.controls.feedback.setValue('');
      }
      $('#giveFeedback').modal('show')
    }
    else{
      $('#noFeedback').modal('show')
    }
  }

  submitFeedback(){
    if(this.feedbackForm.valid){
      this.apiService.initiateLoading(true);
      this.apiService.giveArtistFeedback(this.feedbackForm.value).subscribe(
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
        this.errorMessage = err.error
        console.log(err);
      }
    ).add(()=>{
      this.apiService.initiateLoading(false)
      setTimeout(()=>{
        this.errorMessage = null;
      },5000)
    })
  }
  else{
    const controls = this.feedbackForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            controls[name].markAsDirty()
        }
    }
  }
  }

}
