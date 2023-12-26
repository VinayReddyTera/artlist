import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { contactDetailsRenderer } from '../all-approvers/contactRenderer';
import { dateRenderer } from '../dateRenderer';
import { ApiService } from '../services/api.service';
import { slotRenderer } from '../user-history/slotRenderer';
import { userHistoryTimeRenderer } from '../user-history/userHistoryTimeRenderer';
import { artistfeedbackRenderer } from './feedbackRenderer';
import { FormBuilder, FormControl, Validators} from '@angular/forms';

declare const $:any;

@Component({
  selector: 'app-artist-history',
  templateUrl: './artist-history.component.html',
  styleUrls: ['./artist-history.component.css']
})
export class ArtistHistoryComponent  implements OnInit{

  constructor(private apiService : ApiService,private router:Router,private fb: FormBuilder){}

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
  showTable:any = false;
  showAdvance:any = false;
  first: number = 0;
  rows: number = 10;
  totalRecords : any;
  startIndex = 1;
  endIndex = 5;
  displayData:any = [];
  filteredData:any = [];
  filterForm : any;
  filterApplied:boolean = false;
  historyData:any;
  dataView:any;
  disable:any = false;
  disableRefund:boolean=true;
  isStatusEditable:boolean = false;
  statusForm:any;
  dynamicOptions:any;

  ngOnInit(): void {
    this.statusForm = this.fb.group({
      status:['',[Validators.required]]
    })
    this.apiService.initiateLoading(true);
    this.apiService.fetchHistory().subscribe(
      (res:any)=>{
        if(res.status == 200){
          this.usersRowData = res.data;
          this.historyData = res.data;
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
      if(this.historyData.length > 0){
        this.totalRecords = this.historyData.length;
        this.displayData = this.historyData.slice(0,10);
      }
    })
    this.filterForm = this.fb.group({
      name:[''],
      date:[''],
      status : [''],
      skillName:[''],
      rating : ['']
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
    let obj:any = {
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
    if(event.data.type == 'hourly'){
      obj.from = event.data.from;
      obj.to = event.data.to;
    }
    else if(event.data.type == 'event'){
      obj.slot = event.data.slot
    }
    if(event.data.bookingType == 'onsite'){
      obj.address = event.data.address;
      obj.mandal = event.data.mandal;
      obj.district = event.data.district;
      obj.state = event.data.state;
      obj.pincode = event.data.pincode;
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

  change(){
    let data = (<HTMLInputElement>document.getElementById('check'));
    if(data.checked){
      this.showTable = false;
    }
    else{
      this.showTable = true;
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    if(this.filterApplied){
      this.displayData = this.filteredData.slice(this.first,this.first+this.rows)
    }
    else{
      this.displayData = this.historyData.slice(this.first,this.first+this.rows)
    }
  }

  clear(){
    this.filterForm.reset();
    this.displayData = this.historyData.slice(0,10);
    this.filteredData = [];
    this.filterApplied = false;
    this.errorMessage = null;
  }
  
  filterCard(){
  console.log(this.filterForm.value);
  if((this.filterForm.value.status).toLowerCase() == 'completed'){
    this.filterForm.controls.status.setValue('c');
  }
  else if((this.filterForm.value.status).toLowerCase() == 'accepted'){
    this.filterForm.controls.status.setValue('a');
  }
  else if((this.filterForm.value.status).toLowerCase() == 'rejected'){
    this.filterForm.controls.status.setValue('r');
  }
  this.filterApplied = true
  this.filteredData = this.historyData.filter((item:any) => {
    // Function to check if a string contains a substring
    const containsSubstring = (str:any, substr:any) => str.toLowerCase().includes(substr.toLowerCase());

    // Function to check if a date string contains a substring
    const containsDateSubstring = (dateStr: any, dateSubstr: any) =>
    new Date(dateStr).toDateString().includes(new Date(dateSubstr).toDateString());
  
    // Filter by name
    if (this.filterForm.value.name && !containsSubstring(item.candName, this.filterForm.value.name)) {
      return false;
    }

    // Filter by date
    if (this.filterForm.value.date && !containsDateSubstring(item.date, this.filterForm.value.date)) {
      return false;
    }
  
    // Filter by status
    if (this.filterForm.value.status && !containsSubstring(item.status, this.filterForm.value.status)) {
      return false;
    }
  
    // Filter by skillName
    if (this.filterForm.value.skillName && !(containsSubstring(item.name, this.filterForm.value.skillName))) {
      return false;
    }

    // Filter by rating (assuming it is a property of the item, adjust as needed)
    if (this.filterForm.value.rating && item.rating < parseInt(this.filterForm.value.rating)) {
      return false;
    }
  
    // If all conditions pass, include the item in the filtered result
    return true;
  });
  this.totalRecords = this.filteredData.length
  this.displayData = this.filteredData.slice(0,10)
  if(this.filteredData.length == 0){
    this.errorMessage = 'No Data Available with above filter!'
  }
  else{
    this.errorMessage = null
  }
  }

  openDataView(data:any){
    console.log(data)
    this.dataView = data;
    let status = data.status
    $(`#dataView`).modal('show');
    if(data.modifiedBy == 'user' || new Date(data.date)<new Date() || (status == 'completed' || status == 'c' || status == 'artist not attended' || status =='cancelled')){
      this.disable = true
    }
    if((status == 'r' || status == 'a') && new Date(data.date)>=new Date()){
      this.disable = false
    }
    if((data.paid == true && data.status == 'artist not attended') || data.refundRequested){
      this.disableRefund = false
    }
    if(new Date(data.date)<new Date() && data.status != 'c' && data.status != 'r'){
      this.isStatusEditable = true;
      if(status == 'r'){
        this.dynamicOptions = {
          'r':'rejected',
        }
      }
      else{
        this.dynamicOptions = {
          'c':'completed',
          'artist not attended':'artist not attended',
          'cancelled':'cancelled'
        }
      }
    }
    else{
      this.isStatusEditable = false
    }
  }

  statusSubmit(){
    if(this.statusForm.valid){
      let payload :any = [{
        id : this.dataView._id,
        artistName : this.dataView.candName,
        artistPhone : this.dataView.phoneNo,
        artistEmail : this.dataView.email,
        bookingType : this.dataView.bookingType,
        type : this.dataView.type,
        date : this.dataView.date,
        name : this.dataView.name,
        price : this.dataView.price,
        refundStatus : this.dataView.refundStatus,
        userId : this.dataView.userId,
        paid : this.dataView.paid,
        status : this.statusForm.value.status
      }]
      if(this.dataView.type == 'hourly'){
        payload[0].from = this.dataView.from;
        payload[0].to = this.dataView.to;
      }
      else if(this.dataView.type == 'event'){
        payload[0].slot = this.dataView.slot
      }
      if(this.dataView.bookingType == 'onsite'){
        payload[0].address = this.dataView.address;
        payload[0].mandal = this.dataView.mandal;
        payload[0].district = this.dataView.district;
        payload[0].state = this.dataView.state;
        payload[0].pincode = this.dataView.pincode;
      }
      console.log(payload)
      // this.submitStatus(payload)
    }
    else{
      const controls = this.statusForm.controls;
      for(const name in controls) {
        if(controls[name].invalid) {
            controls[name].markAsDirty()
        }
      }
    }
  }

}