import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { left } from '@popperjs/core';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { contactDetailsRenderer } from '../all-approvers/contactRenderer';
import { dateRenderer } from '../dateRenderer';
import { ApiService } from '../services/api.service';
import { slotRenderer } from '../user-history/slotRenderer';
import { userHistoryTimeRenderer } from '../user-history/userHistoryTimeRenderer';
import { approverRenderer } from './approverRenderer';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { formatDate } from '@angular/common';

declare const $:any;

@Component({
  selector: 'app-new-requests',
  templateUrl: './new-requests.component.html',
  styleUrls: ['./new-requests.component.css']
})
export class NewRequestsComponent  implements OnInit{

  constructor(private apiService : ApiService,private router:Router,private fb: FormBuilder){}

  errorMessage : any;
  usersRowData:any = [];
  usersColumnDefs = [
    {
      field: "candName",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Name",
      pinned : left,
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
            let link = `<span class="badge badge-soft-warning" style="font-size:13px">${params.value}</span>`;
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
      filter: "agDateColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Portfolio",
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
      filterParams: { maxNumConditions: 1 },
      headerName: "Action",
      cellRenderer: approverRenderer,
      width:200,
      cellRendererParams: { onStatusChange: this.viewStatus.bind(this) }
    }
  ];
  defaultColDef : ColDef = {
    sortable:true,filter:true,resizable:true
  }
  pagination:any = true;
  gridApi:any;
  feedback:any;
  eventData:any;
  availableData: any;
  apiCalled:boolean=false;
  bookingForm:any;
  checkAvailability : boolean = false;
  minDate : Date = new Date(new Date().setDate(new Date().getDate()+1))
  showFrom:boolean=false;
  timeDiff:any;
  rejectForm:any;
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
  disableReschedule:any = false;

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      type:['',[Validators.required]],
      date:['',[Validators.required]]
    })
    this.rejectForm = this.fb.group({
      remarks:['',[Validators.required]]
    })
    this.apiService.initiateLoading(true);
    this.apiService.fetchNewRequests().subscribe(
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
            this.usersRowData = [];
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
    }
    else{
      this.feedback = ''
    }
    $('#viewFeedback').modal('show')
  }


  viewStatus(data:any,status:any){
    console.log(data)
    this.eventData = data;
    if(status == 'reschedule'){
      this.bookingForm = this.fb.group({
        type:[data.type,[Validators.required]],
        name:[data.name,[Validators.required]],
        bookingType:[data.bookingType,[Validators.required]],
        artistId:[data.artistId,[Validators.required]],
        date:[new Date(data.date),[Validators.required]],
        userId:[data.userId,[Validators.required]],
        paid : [data.paid]
      })
      if(data.type == 'hourly'){
        this.timeDiff = this.calTimeDiff(formatDate(new Date(data.from), 'HH:mm', 'en-US'),formatDate(new Date(data.to), 'HH:mm', 'en-US'))
        this.showFrom = true;
        this.bookingForm.addControl('from', new FormControl(formatDate(new Date(data.from), 'HH:mm', 'en-US'), Validators.required));
        this.bookingForm.addControl('to', new FormControl(formatDate(new Date(data.to), 'HH:mm', 'en-US'), Validators.required));
      }
      else if(data.type == 'event'){
        this.bookingForm.addControl('slot', new FormControl(data.slot, Validators.required));
      }
      if(data.bookingType == 'onsite'){
        this.bookingForm.addControl('address', new FormControl(data.address, Validators.required));
        this.bookingForm.addControl('mandal', new FormControl(data.mandal, Validators.required));
        this.bookingForm.addControl('district', new FormControl(data.district, Validators.required));
        this.bookingForm.addControl('state', new FormControl(data.state, Validators.required));
        this.bookingForm.addControl('pincode', new FormControl(data.pincode, Validators.required));
      }
    }
    if(status == 'reschedule' && !this.apiCalled){
      this.fetchAvailable()
    }
    $(`#${status}`).modal('show');
  }

  get f() { return this.bookingForm.controls; }
  get rf() { return this.rejectForm.controls; }

  changeStatus(status:any){
    let payload :any = [{
      id : this.eventData._id,
      candName : this.eventData.candName,
      candPhone : this.eventData.phoneNo,
      candEmail : this.eventData.email,
      bookingType : this.eventData.bookingType,
      type : this.eventData.type,
      date : this.eventData.date,
      name : this.eventData.name,
      price : this.eventData.price,
      refundStatus : this.eventData.refundStatus,
      userId : this.eventData.userId,
      paid : this.eventData.paid
    }]
    if(status == 'approve'){
      payload[0].status = 'a'
    }
    else if(status == 'reject'){
      payload[0].status = 'r'
      if(this.rejectForm.valid){
        payload[0].remarks = this.rejectForm.value.remarks
      }
      else{
        const controls = this.rejectForm.controls;
        for (const name in controls) {
          if (controls[name].invalid) {
              controls[name].markAsDirty()
          }
        }
        return
      }
    }
    if(this.eventData.type == 'hourly'){
      payload[0].from = this.eventData.from;
      payload[0].to = this.eventData.to;
    }
    else if(this.eventData.type == 'event'){
      payload[0].slot = this.eventData.slot
    }
    if(this.eventData.bookingType == 'onsite'){
      payload[0].address = this.eventData.address;
      payload[0].mandal = this.eventData.mandal;
      payload[0].district = this.eventData.district;
      payload[0].state = this.eventData.state;
      payload[0].pincode = this.eventData.pincode;
    }
    console.log(payload)
    this.apiService.initiateLoading(true);
    this.apiService.updateEvent(payload).subscribe(
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
      $(`#${status}`).modal('hide');
      $('#dataView').modal('hide')
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

  fetchAvailable(){
    this.apiService.initiateLoading(true);
    this.apiService.fetchAvailable({'id':this.eventData.artistId}).subscribe(
      (res:any)=>{
        if(res.status == 200){
          this.availableData = res.data
          console.log(this.availableData);
          this.apiCalled = true;
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
        console.log(err)
      }
    ).add(()=>{
      this.apiService.initiateLoading(false);
      console.log(this.bookingForm.value.type)
    })
  }

  reschedule(){
    let date = this.bookingForm.value.date;
    let type = this.eventData.type;
    let dates = this.availableData[type];
    let isFound = false;
    console.log(this.bookingForm.value)
    if(this.bookingForm.valid){
      if(type == 'fullDay'){
        for(let i of dates){
          if(new Date(i).toLocaleDateString() == new Date(date).toLocaleDateString()){
            isFound = true;
            break
          }
        }
      }
      else{
        for(let i of dates){
          if(new Date(i.date).toLocaleDateString() == new Date(date).toLocaleDateString()){
            isFound = true;
            break
          }
        }
      }
      if(isFound){
        if(this.eventData.type == 'hourly'){
          let newTimeDiff = this.calTimeDiff(this.bookingForm.value.from,this.bookingForm.value.to);
          if(this.timeDiff != newTimeDiff){
            let msgData = {
              severity : "error",
              summary : 'Error',
              detail : `Time difference should match ${this.convertMinutesToHoursAndMinutes(this.timeDiff)}`,
              life : 5000
            }
            this.apiService.sendMessage(msgData);
            return
          }
          const start = this.bookingForm.value.from.split(':')[0];
          const end = this.bookingForm.value.to.split(':')[0];
          let availability:any;
          for(let i of this.availableData.hourly){
            if(new Date(this.bookingForm.value.date).toDateString() == new Date(i.date).toDateString()){
              availability = i.availability;
              break;
            }
          }
          for(let i=start;i<end;i++){
            if(availability[i] == 0){
              let msgData = {
                severity : "error",
                summary : 'Error',
                detail : 'Slot already booked',
                life : 5000
              }
              this.apiService.sendMessage(msgData);
              this.bookingForm.controls.from.setValue('');
              this.bookingForm.controls.to.setValue('');
              return
            }
          }
          let minutes = this.calTimeDiff(this.bookingForm.value.from,this.bookingForm.value.to);
          if(minutes<=0){
            let msgData = {
              severity : "error",
              summary : 'Error',
              detail : 'end time should be greater than start time',
              life : 5000
            }
            this.apiService.sendMessage(msgData);
            return
          }
          let from = this.format(this.bookingForm.value.from,this.bookingForm.value.date);
          let to = this.format(this.bookingForm.value.to,this.bookingForm.value.date);
          this.bookingForm.controls.from.setValue(from);
          this.bookingForm.controls.to.setValue(to);
        }
        this.apiService.initiateLoading(true);
        let payload:any = {
          id : this.eventData._id,
          data : this.bookingForm.value
        }
        if(this.eventData.paid && this.eventData.refundStatus == 'positive'){
          payload.oldPrice = this.eventData.price;
          payload.refundStatus = this.eventData.refundStatus
        }
        console.log(payload)
        this.apiService.updateBooking(payload).subscribe(
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
          $(`#reschedule`).modal('hide');
          $(`#dataView`).modal('hide');
          this.usersRowData = [];
          this.errorMessage = null;
          this.ngOnInit();
          this.apiCalled=false
          }
          else if(res.status == 204){
            let msgData = {
                severity : "error",
                summary : 'Error',
                detail : res.data,
                life : 5000
              }
            this.apiService.sendMessage(msgData);
            if(res.data == 'Slot already booked'){
              this.fetchAvailable();
            }
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
          detail : 'date should be present in available dates',
          life : 5000
        }
        this.apiService.sendMessage(msgData);
        return
      }
    }
    else{
      const controls = this.bookingForm.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
              controls[name].markAsDirty()
          }
      }
    }
  }

  buttonFullDay(date:any,event:any){
    this.bookingForm.controls.date.setValue(date);
    for(let i in this.availableData.fullDay){
      let id = 'btn' + i
      document.getElementById(id)?.classList.remove('btn-clicked');
    }
    document.getElementById(event.target.id)?.classList.add('btn-clicked');
  }

  buttonEvent(i:any,date:any,event:any){
    this.bookingForm.controls.date.setValue(date);
    let text = event.target.innerText[0];
    if(text == '4'){
      this.bookingForm.controls.slot.setValue(1);
    }
    else if(text == '9'){
      this.bookingForm.controls.slot.setValue(2);
    }
    else if(text == '2'){
      this.bookingForm.controls.slot.setValue(3);
    }
    else if(text == '7'){
      this.bookingForm.controls.slot.setValue(4);
    }
    else if(text == '1'){
      this.bookingForm.controls.slot.setValue(5);
    }
    for(let i in this.availableData.event){
      for(let j in this.availableData.event[i].slots){
        let id = 'btn' + i + j
        document.getElementById(id)?.classList.remove('btn-clicked');
      }
    }
    document.getElementById(event.target.id)?.classList.add('btn-clicked');
  }

  format(timeString:any,dateString:any){
    const originalDate = new Date(dateString);
    const [hours, minutes] = timeString.split(':').map(Number);
    let newDate = new Date(originalDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate = new Date(newDate)
    return newDate;
  }

  calTimeDiff(start:any,end:any){
    // Split the time strings into hours and minutes
    const fromTimeParts = start.split(':');
    const toTimeParts = end.split(':');

    // Convert the time parts to integers
    const fromHours = parseInt(fromTimeParts[0], 10);
    const fromMinutes = parseInt(fromTimeParts[1], 10);
    const toHours = parseInt(toTimeParts[0], 10);
    const toMinutes = parseInt(toTimeParts[1], 10);

    // Calculate the time difference in minutes
    const totalMinutesFrom = fromHours * 60 + fromMinutes;
    const totalMinutesTo = toHours * 60 + toMinutes;
    const timeDifferenceMinutes = totalMinutesTo - totalMinutesFrom;
    return timeDifferenceMinutes
  }

  convertMinutesToHoursAndMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
  
    if (hours > 0 && remainingMinutes > 0) {
      return `${hours} hours ${remainingMinutes} minutes`;
    } else if (hours > 0) {
      return `${hours} hours`;
    } else {
      return `${remainingMinutes} minutes`;
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
  if((this.filterForm.value?.status).toLowerCase() == 'completed'){
    this.filterForm.controls.status.setValue('c');
  }
  else if((this.filterForm.value?.status).toLowerCase() == 'accepted'){
    this.filterForm.controls.status.setValue('a');
  }
  else if((this.filterForm.value?.status).toLowerCase() == 'rejected'){
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
    console.log('here')
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
    if(data.modifiedBy == 'artist' || new Date(data.date)<new Date() || (status == 'completed' || status == 'c' || status == 'artist not attended' || status =='cancelled')){
      this.disable = true;
      this.disableReschedule = true;
    }
    if((status == 'r' || status == 'a') && new Date(data.date)>=new Date()){
      this.disable = false;
      this.disableReschedule = false;
    }
    if(data.type == 'Personal Wishes' || data.type == 'Inauguration'){
      this.disableReschedule = true;
    }
  }

}
