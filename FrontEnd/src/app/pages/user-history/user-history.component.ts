import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { contactDetailsRenderer } from '../all-approvers/contactRenderer';
import { dateRenderer } from '../dateRenderer';
import { ApiService } from '../services/api.service';
import { feedbackRenderer } from './feedback';
import { slotRenderer } from './slotRenderer';
import { userHistoryTimeRenderer } from './userHistoryTimeRenderer';
import { FormBuilder, FormControl, Validators} from '@angular/forms';
import { formatDate } from '@angular/common';
import { UserApproverRenderer } from './userApproverRenderer';
import { left } from '@popperjs/core';
import { refundRenderer } from './refundRenderer';

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
  dynamicOptions:any;
  usersColumnDefs = [
    {
      field: "candName",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Artist Name",
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
      },
      width:130
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
      filterParams: { maxNumConditions: 1 },
      headerName: "Give/View Feedback",
      cellRenderer: feedbackRenderer,
      cellRendererParams: { onStatusChange: this.viewFeedback.bind(this) }
    },
    {
      field: "action",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Action",
      cellRenderer: UserApproverRenderer,
      width:200,
      cellRendererParams: { onStatusChange: this.viewStatus.bind(this) }
    },
    {
      field: "action",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Request Refund",
      cellRenderer: refundRenderer,
      width:200,
      cellRendererParams: { onStatusChange: this.openRefund.bind(this) }
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
  arrear:any = 0;
  rejectionForm:any;
  payNow:boolean = true;
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
  refundForm:any;
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
  disableRefund:boolean=true;
  isStatusEditable:boolean = false;
  statusForm:any;
  payRequest:google.payments.api.PaymentDataRequest={
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['AMEX', 'VISA', 'MASTERCARD']
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'example',
            gatewayMerchantId: 'exampleGatewayMerchantId'
          }
        }
      }
    ],
    merchantInfo: {
      merchantId: '12345678901234567890',
      merchantName: 'Demo Merchant'
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPriceLabel: 'Total',
      totalPrice: '1.00',
      currencyCode: 'INR',
      countryCode: 'IN'
    },
    callbackIntents : ['PAYMENT_AUTHORIZATION']
  };

  ngOnInit(): void {
    this.feedbackForm = this.fb.group({
      feedback:['',[Validators.required]],
      rating:['',[Validators.required]],
      name:[''],
      artistId:['',[Validators.required]],
      type:['',[Validators.required]],
      id:['',[Validators.required]]
    })
    this.rejectionForm = this.fb.group({
      remarks:['',[Validators.required]]
    })
    this.statusForm = this.fb.group({
      status:['',[Validators.required]]
    })
    this.refundForm = this.fb.group({
      id:[''],
      bookingType:['',[Validators.required]],
      type:['',[Validators.required]],
      date:['',[Validators.required]],
      refundReason:['',[Validators.required]]
    })
    this.bookingForm = this.fb.group({
      bookingType:['',[Validators.required]],
      type:['',[Validators.required]],
      date:['',[Validators.required]],
      price:[''],
      commission:[''],
      paid:[true]
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
    });
    this.filterForm = this.fb.group({
      name:[''],
      date:[''],
      status : [''],
      skillName:[''],
      rating : ['']
    })

  this.apiService.initiateLoading(false)
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
    if(new Date(data.date)<new Date() && (data.status == 'completed' || data.status == 'c')){
      this.feedbackForm.controls.id.setValue(data._id);
      this.feedbackForm.controls.name.setValue(data.name);
      this.feedbackForm.controls.type.setValue(data.type);
      this.feedbackForm.controls.artistId.setValue(data.artistId);
      if(data.feedback){
        this.feedbackForm.controls.feedback.setValue(data.feedback);
      }
      else{
        this.feedbackForm.controls.feedback.setValue('');
      }
      if(data?.rating){
        this.feedbackForm.controls.rating.setValue(data.rating);
      }
      else{
        this.feedbackForm.controls.rating.setValue('');
      }
      $('#giveFeedback').modal('show')
    }
    else{
      $('#noFeedback').modal('show')
    }
  }

  submitFeedback(){
    console.log(this.feedbackForm.value)
    if(this.feedbackForm.valid){
      this.apiService.initiateLoading(true);
      this.apiService.giveArtistFeedback(this.feedbackForm.value).subscribe(
      (res : any)=>{
        console.log(res)
        if(res.status == 200){
          $('#giveFeedback').modal('hide');
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
    console.log('here')
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
    this.price = data.price;
    if(this.eventData.paid){
      this.payNow = false;
    }
    else this.payNow = true;
    if(status == 'reschedule'){
      this.bookingForm = this.fb.group({
        bookingType:[data.bookingType,[Validators.required]],
        type:[data.type,[Validators.required]],
        artistId:[data.artistId,[Validators.required]],
        price:[data.price,[Validators.required]],
        date:[new Date(data.date),[Validators.required]],
        name:[data.name,[Validators.required]],
        commission:[data.commission],
        paid:[true]
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
    let payload :any = [{
      id : this.eventData._id,
      artistName : this.eventData.candName,
      artistPhone : this.eventData.phoneNo,
      artistEmail : this.eventData.email,
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
      payload[0].status = 'r';
      if(this.rejectionForm.valid){
        payload[0].remarks = this.rejectionForm.value.remarks;
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
    this.submitStatus(payload)
  }

  submitStatus(payload:any){
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
      $(`#approve`).modal('hide');
      $(`#reject`).modal('hide');
      $(`#dataView`).modal('hide');
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
      if(this.bookingForm.value.paid){
        this.bookingForm.controls.commission.setValue(this.bookingForm.value.price*0.95);
      }
      else{
        this.bookingForm.controls.commission.setValue(-(this.bookingForm.value.price*0.05));
      }
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
        let payload:any = {
          id : this.eventData._id,
          data : this.bookingForm.value
        }
        if(this.arrear>0){
          payload.wallet = this.arrear;
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
    if(this.eventData.paid){
      this.arrear = this.eventData.price - this.price;
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
      this.price = 0;
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
        this.price = this.eventData.pricing.event;
        this.bookingForm.controls.price.setValue(this.price);
        this.bookingForm.addControl('slot', new FormControl('', Validators.required));
      }
      else{
        this.bookingForm.removeControl('slot');
      }
      if(this.bookingForm.value.type == 'fullDay'){
        this.price = this.eventData.pricing.fullDay;
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
    if(this.eventData.paid){
      this.arrear = this.eventData.price - this.price;
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
    if(this.eventData.paid){
      this.arrear = this.eventData.price - this.price;
    }
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
      artistName : event.data.candName,
      artistPhone : event.data.phoneNo,
      artistEmail : event.data.email,
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
      this.submitStatus(this.modifiedRows)
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

  updatePay(data:any){
    if(data == 'paynow'){
      this.bookingForm.controls.paid.setValue(true);
      this.payNow = true;
      this.bookingForm.addControl('paymentType', new FormControl('online'));
    }
    else{
      this.bookingForm.controls.paid.setValue(false);
      this.payNow = false;
      this.bookingForm.addControl('paymentType', new FormControl(null));
    }
  }

  openRefund(data:any){
    console.log(data)
    this.refundForm = this.fb.group({
      bookingType:[data.bookingType,[Validators.required]],
      type:[data.type,[Validators.required]],
      date:[new Date(data.date),[Validators.required]],
      name:[data.name,[Validators.required]],
      artistName:[data.candName,[Validators.required]],
      artistPhone:[data.phoneNo,[Validators.required]],
      artistEmail:[data.email,[Validators.required]],
      price:[data.price,[Validators.required]],
      refundReason:['',[Validators.required]],
      id : [data._id]
    })
    if(data.type == 'hourly'){
      this.showFrom = true;
      this.refundForm.addControl('from', new FormControl(formatDate(new Date(data.from), 'HH:mm', 'en-US'), Validators.required));
      this.refundForm.addControl('to', new FormControl(formatDate(new Date(data.to), 'HH:mm', 'en-US'), Validators.required));
    }
    else if(data.type == 'event'){
      this.refundForm.addControl('slot', new FormControl(data.slot, Validators.required));
    }
    if(data.bookingType == 'onsite'){
      this.refundForm.addControl('address', new FormControl(data.address, Validators.required));
      this.refundForm.addControl('mandal', new FormControl(data.mandal, Validators.required));
      this.refundForm.addControl('district', new FormControl(data.district, Validators.required));
      this.refundForm.addControl('state', new FormControl(data.state, Validators.required));
      this.refundForm.addControl('pincode', new FormControl(data.pincode, Validators.required));
    }
    console.log(this.refundForm.value)
    $(`#refund`).modal('show');
  }

  refund(){
    if(this.refundForm.valid){
      this.apiService.initiateLoading(true);
      this.apiService.requestRefund(this.refundForm.value).subscribe(
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
        $(`#refund`).modal('hide');
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
      const controls = this.refundForm.controls;
      for(const name in controls) {
        if(controls[name].invalid) {
            controls[name].markAsDirty()
        }
      }
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
    this.first = 0;
    this.rows = 10;
    this.totalRecords = this.historyData.length;
    this.startIndex = 1;
    this.endIndex = 5;
  }
  
  filterCard(){
  console.log(this.filterForm.value);
  if(this.filterForm.value?.status != null){
    if((this.filterForm.value?.status).toLowerCase() == 'completed'){
      this.filterForm.controls.status.setValue('c');
    }
    else if((this.filterForm.value?.status).toLowerCase() == 'accepted'){
      this.filterForm.controls.status.setValue('a');
    }
    else if((this.filterForm.value?.status).toLowerCase() == 'rejected'){
      this.filterForm.controls.status.setValue('r');
    }
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
      this.disableReschedule = true;
    }
    if((status == 'r' || status == 'a') && new Date(data.date)>=new Date()){
      this.disable = false
      this.disableReschedule = false;
    }
    if(data.type == 'Personal Wishes' || data.type == 'Inauguration'){
      this.disableReschedule = true;
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
      this.submitStatus(payload)
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

  onLoadPaymentData = (event: any): void => {
    console.log('load payment data', event.detail);
  };

  onError = (event: any): void => {
    console.error('error', event.error);
  };

  onPaymentDataAuthorized: google.payments.api.PaymentAuthorizedHandler = (paymentData:any) => {
    console.log('payment authorized', paymentData);

    return {
      transactionState: 'SUCCESS',
    };
  };

}
