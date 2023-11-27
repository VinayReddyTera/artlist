import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridReadyEvent, ISelectCellEditorParams } from 'ag-grid-community';
import { contactDetailsRenderer } from '../all-approvers/contactRenderer';
import { dateRenderer } from '../dateRenderer';
import { ApiService } from '../services/api.service';
import { feedbackRenderer } from './feedback';
import { slotRenderer } from './slotRenderer';
import { userHistoryTimeRenderer } from './userHistoryTimeRenderer';
import { FormBuilder, FormControl, Validators, FormArray, AbstractControl, FormGroup  } from '@angular/forms';
import { formatDate } from '@angular/common';
import { UserApproverRenderer } from './userApproverRenderer';
import { left } from '@popperjs/core';

declare const $:any;

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.css']
})
export class UserHistoryComponent implements OnInit{

  constructor(private apiService : ApiService,private router:Router,private fb: FormBuilder){}

  errorMessage : any;
  modifiedRows:any=[]
  public rowSelection: 'single' | 'multiple' = 'multiple';
  usersRowData:any = [];
  usersColumnDefs = [
    {
      field: "candName",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Artist Name",
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
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params:any) => {
        const status = params.value;
         if (status === 'a' || status === 'completed'){
            return {
                values: ['accepted', 'completed']
            };
        }
        else{
          return {
            values: [status]
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
          else if(params.value == 'a'){
            let link = `<span class="badge badge-soft-info" style="font-size:13px">Accepted</span>`;
            return link
          }
          else if(params.value == 'accepted'){
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
      filterParams: { suppressAndOrCondition: true },
      headerName: "Booking Type",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "bookingType",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Event Type",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value,
      width:130
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
      },
      width:130
    },
    {
      field: "address",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Address",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "mandal",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Mandal",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "district",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "District",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "state",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "State",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "pincode",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Pincode",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
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
    },
    {
      field: "action",
      filter: "agTextColumnFilter",
      filterParams: { suppressAndOrCondition: true },
      headerName: "Action",
      cellRenderer: UserApproverRenderer,
      width:200,
      cellRendererParams: { onStatusChange: this.viewStatus.bind(this) }
    }
  ];
  defaultColDef : ColDef = {
    sortable:true,filter:true,resizable:true
  }
  pagination:any = true;
  gridApi:any;
  feedbackForm:any;
  eventData:any;
  availableData: any;
  bookingForm:any;
  checkAvailability : boolean = false;
  minDate : Date = new Date(new Date().setDate(new Date().getDate()+1))
  showFrom:boolean=false;
  price:any;
  rejectionForm:any;
  states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Delhi",
    "Puducherry"
  ];

  ngOnInit(): void {
    this.feedbackForm = this.fb.group({
      feedback:['',[Validators.required]],
      id:['',[Validators.required]]
    })
    this.rejectionForm = this.fb.group({
      remarks:['',[Validators.required]]
    })
    this.bookingForm = this.fb.group({
      bookingType:['',[Validators.required]],
      type:['',[Validators.required]],
      date:['',[Validators.required]],
      price:['']
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

  get f() { return this.bookingForm.controls; }

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

  viewStatus(data:any,status:any){
    console.log(data)
    this.eventData = data;
    this.price = data.price
    if(status == 'reschedule'){
      this.bookingForm = this.fb.group({
        bookingType:[data.bookingType,[Validators.required]],
        type:[data.type,[Validators.required]],
        artistId:[data.artistId,[Validators.required]],
        price:[data.price,[Validators.required]],
        date:[new Date(data.date),[Validators.required]],
        name:[data.name,[Validators.required]]
      })
      if(data.type == 'hourly'){
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
    if(status == 'reschedule'){
      this.fetchAvailable()
    }
    $(`#${status}`).modal('show');
  }

  fetchAvailable(){
    if(this.eventData.artistId){
      this.apiService.initiateLoading(true);
      this.apiService.fetchAvailable({'id':this.eventData?.artistId}).subscribe(
        (res:any)=>{
          if(res.status == 200){
            this.availableData = res.data
            console.log(this.availableData)
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
      })
    }
    else{
      this.checkAvailability = false;
      this.minDate = new Date(new Date().setDate(new Date().getDate()+1))
      this.showFrom=false;
      this.ngOnInit();
    }
  }

  changeStatus(status:any){
    let payload :any = {
      id : this.eventData._id
    }
    if(status == 'approve'){
      payload.status = 'a'
    }
    else if(status == 'reject'){
      payload.status = 'r';
      if(this.rejectionForm.valid){
        payload.remarks = this.rejectionForm.value.remarks;
      }
      else{
        const controls = this.rejectionForm.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                controls[name].markAsDirty()
            }
        }
        return
      }
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
    let date = this.bookingForm.value.date;
    let type = this.bookingForm.value.type;
    let dates = this.availableData[type];
    let isFound = false;
    console.log(this.bookingForm.valid,this.bookingForm.value)
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
        if(this.bookingForm.value.type == 'hourly'){
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
    console.log(this.bookingForm.value)
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

  calPrice(){
    if(this.bookingForm.value.from && this.bookingForm.value.to){
      let minutes = this.calTimeDiff(this.bookingForm.value.from,this.bookingForm.value.to);
      if(minutes<=0){
        let msgData = {
          severity : "warn",
          summary : 'warning',
          detail : 'end time should be greater than start time',
          life : 5000
        }
        this.apiService.sendMessage(msgData);
      }
      else{
        if(this.bookingForm.value.bookingType == 'onsite'){
          this.price = Math.round(this.eventData.pricing.hourly*(minutes/60))
        }
        else{
          this.price = Math.round(this.eventData.pricing.oHourly*(minutes/60))
        }
        this.bookingForm.controls.price.setValue(this.price);
      }
    }
    else{
      this.bookingForm.controls.from.markAsDirty();
      this.bookingForm.controls.to.markAsDirty();
    }
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

  addField(){
    this.bookingForm.controls.date.setValue('');
    if(this.bookingForm.value.type == 'hourly'){
      this.price = '0';
      this.bookingForm.controls.price.setValue(this.price);
      this.bookingForm.addControl('from', new FormControl('', Validators.required));
      this.bookingForm.addControl('to', new FormControl('', Validators.required));
      this.showFrom = true;
    }
    else{
      this.bookingForm.removeControl('from');
      this.bookingForm.removeControl('to');
      this.showFrom = false;
    }
    if(this.bookingForm.value.bookingType == 'onsite'){
      if(this.bookingForm.value.type == 'event'){
        this.price = this.eventData.pricing.event
        this.bookingForm.controls.price.setValue(this.price);
        this.bookingForm.addControl('slot', new FormControl('', Validators.required));
      }
      else{
        this.bookingForm.removeControl('slot');
      }
      if(this.bookingForm.value.type == 'fullDay'){
        this.price = this.eventData.pricing.fullDay
        this.bookingForm.controls.price.setValue(this.price);
      }
    }
    else{
      if(this.bookingForm.value.type == 'event'){
        this.price = this.eventData.pricing.oEvent
        this.bookingForm.controls.price.setValue(this.price);
        this.bookingForm.addControl('slot', new FormControl('', Validators.required));
      }
      else{
        this.bookingForm.removeControl('slot');
      }
      if(this.bookingForm.value.type == 'fullDay'){
        this.price = this.eventData.pricing.oFullDay
        this.bookingForm.controls.price.setValue(this.price);
      }
    }
    if(this.bookingForm.value.type == 'hourly' && this.eventData.type == 'hourly'){
      this.bookingForm.controls.from.setValue(formatDate(new Date(this.eventData.from), 'HH:mm', 'en-US'));
      this.bookingForm.controls.to.setValue(formatDate(new Date(this.eventData.to), 'HH:mm', 'en-US'));
      this.bookingForm.controls.date.setValue(new Date(this.eventData.date));
      this.calPrice()
    }
    if(this.bookingForm.value.bookingType == 'onsite' && this.eventData.bookingType == 'onsite'){
      this.bookingForm.controls.address.setValue(this.eventData.address);
      this.bookingForm.controls.mandal.setValue(this.eventData.mandal);
      this.bookingForm.controls.district.setValue(this.eventData.district);
      this.bookingForm.controls.state.setValue(this.eventData.state);
      this.bookingForm.controls.pincode.setValue(this.eventData.pincode);
    }
  }

  addAddress(){
    if(this.bookingForm.value.bookingType == 'onsite'){
      this.bookingForm.addControl('address', new FormControl('', Validators.required));
      this.bookingForm.addControl('mandal', new FormControl('', Validators.required));
      this.bookingForm.addControl('district', new FormControl('', Validators.required));
      this.bookingForm.addControl('state', new FormControl('Telangana', Validators.required));
      this.bookingForm.addControl('pincode', new FormControl('', Validators.required));
    }
    else{
      this.bookingForm.removeControl('address');
      this.bookingForm.removeControl('mandal');
      this.bookingForm.removeControl('district');
      this.bookingForm.removeControl('state');
      this.bookingForm.removeControl('pincode');
    }
    if(this.bookingForm.value?.type == 'hourly'){
      this.calPrice()
    }
    else if(this.bookingForm.value?.type == 'fullDay'){
      if(this.bookingForm.value.bookingType == 'onsite'){
        this.price = this.eventData.pricing.fullDay
        this.bookingForm.controls.price.setValue(this.price);
      }
      else{
        this.price = this.eventData.pricing.oFullDay
        this.bookingForm.controls.price.setValue(this.price);
      }
    }
    else if(this.bookingForm.value?.type == 'event'){
      if(this.bookingForm.value.bookingType == 'onsite'){
        this.price = this.eventData.pricing.event
        this.bookingForm.controls.price.setValue(this.price);
      }
      else{
        this.price = this.eventData.pricing.oEvent
        this.bookingForm.controls.price.setValue(this.price);
      }
    }
    if(this.bookingForm.value.type == 'hourly' && this.eventData.type == 'hourly'){
      this.bookingForm.controls.from.setValue(formatDate(new Date(this.eventData.from), 'HH:mm', 'en-US'));
      this.bookingForm.controls.to.setValue(formatDate(new Date(this.eventData.to), 'HH:mm', 'en-US'));
      this.bookingForm.controls.date.setValue(new Date(this.eventData.date));
      this.calPrice()
    }
    if(this.bookingForm.value.bookingType == 'onsite' && this.eventData.bookingType == 'onsite'){
      this.bookingForm.controls.address.setValue(this.eventData.address);
      this.bookingForm.controls.mandal.setValue(this.eventData.mandal);
      this.bookingForm.controls.district.setValue(this.eventData.district);
      this.bookingForm.controls.state.setValue(this.eventData.state);
      this.bookingForm.controls.pincode.setValue(this.eventData.pincode);
    }
  }

  onRowValueChanged(event:any) {
    // const existingRow = this.modifiedRows.find((row:any) => row.uniqueId === event.data.uniqueId);
    // if (!existingRow) {
    //   this.modifiedRows.push(event.data);
    // }
    // console.log(this.modifiedRows)
  }

}
