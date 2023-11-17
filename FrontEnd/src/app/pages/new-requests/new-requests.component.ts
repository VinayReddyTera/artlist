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
      filterParams: { suppressAndOrCondition: true },
      headerName: "Name",
      pinned : left,
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
      filterParams: { suppressAndOrCondition: true },
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

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      type:['',[Validators.required]],
      date:['',[Validators.required]],
      name:[''],
      artistId:[''],
      price:['']
    })
    this.apiService.initiateLoading(true);
    this.apiService.fetchNewRequests().subscribe(
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
            this.usersRowData = [];
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
        date:[new Date(data.date),[Validators.required]]
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
    }
    if(status == 'reschedule' && !this.apiCalled){
      this.apiService.initiateLoading(true);
      this.apiService.fetchAvailable({'id':data.artistId}).subscribe(
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
    $(`#${status}`).modal('show');
  }

  get f() { return this.bookingForm.controls; }

  changeStatus(status:any){
    let payload :any = {
      id : this.eventData._id
    }
    if(status == 'approve'){
      payload.status = 'a'
    }
    else if(status == 'reject'){
      payload.status = 'r'
    }
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

  reschedule(){
    if(this.bookingForm.valid && this.bookingForm.value.type == 'hourly'){
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
    console.log(this.bookingForm.valid,this.bookingForm.value)
    if(this.bookingForm.valid){
      this.apiService.initiateLoading(true);
      let payload = {
        id : this.eventData._id,
        data : this.bookingForm.value
      }
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
        this.usersRowData = [];
        this.errorMessage = null;
        this.ngOnInit();
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
    this.bookingForm.controls.slot.setValue(i+1);
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

}
