import { Component, OnInit, ViewChild} from '@angular/core';
import { ApiService } from '../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from '../services/encryption.service';
import { dateRenderer } from '../dateRenderer';
import { userHistoryTimeRenderer } from '../user-history/userHistoryTimeRenderer';
import { slotRenderer } from '../user-history/slotRenderer';
import { contactRenderer } from '../artist-dashboard/contactRenderer';
import { feedbackRenderer } from '../user-history/feedback';
import { FormBuilder, Validators} from '@angular/forms';

declare const $ : any;

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit{

  userStatistics = {
    inProgress : 0,
    completed : 0,
    rejected : 0
  }

  name : any;
  @ViewChild('content') content:any;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  userData:any;
  errorMessage : any;
  todayEvents:any = [];
  upComingEvents:any = [];
  pastEvents:any = [];
  tooltipOptions = {
    fitContent : true
  }
  date: Date = new Date();
  profileStatus:any;
  modifiedRows:any=[];

  statData: any = [{
    "icon": "bx bx-copy-alt",
    "title": "Job Descriptions",
    "value": 0,
    "link": "/jd-details"
  }, {
    "icon": "bx bx-archive-in",
    "title": "Total Resumes",
    "value": 0,
    "link": "/pastResumes"
  }, {
    "icon": "bx bx-user",
    "title": "Interviewers",
    "value": 0,
    "link": "/interviewers"
  }];

  lineChartData: any;
  lineChartOptions: any = {
    responsive: true
  };
  lineChartLegend = true;
  
  doughnutChartLabels: string[] = [ 'Inprogress', 'Completed', 'Rejected' ];
  doughnutChartDatasets: any = [
      { data: [ this.userStatistics.inProgress,this.userStatistics.completed, this.userStatistics.rejected ] }
    ];

  doughnutChartOptions: any = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true
    },
  };

  role:any;

  gridApi: any;
  gridApi1: any;
  gridApi2: any;

  dashboardColumnDefs = [
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
      cellRenderer: contactRenderer,
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
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "mandal",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Mandal",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "district",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "District",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "state",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "State",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "pincode",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Pincode",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "paid",
      filter: "agDateColumnFilter",
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
    }
  ];
  pastdashboardColumnDefs = [
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
      cellRenderer: contactRenderer,
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
        if(new Date(params.data.date)<new Date() && params.data.status != 'c'){
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
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "mandal",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Mandal",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "district",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "District",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "state",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "State",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "pincode",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Pincode",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "paid",
      filter: "agDateColumnFilter",
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
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Give Feedback",
      cellRenderer: feedbackRenderer,
      cellRendererParams: { onStatusChange: this.viewFeedback.bind(this) }
    }
  ];
    defaultColDef : ColDef = {
      sortable:true,filter:true,resizable:true
    }
    pagination:any = true;
    completed:any = 0;
    upcoming:any = 0;
    feedbackForm:any;

  constructor(private activeRoute : ActivatedRoute,private apiService : ApiService,private fb: FormBuilder,
    private spinner : NgxSpinnerService,private router:Router,private decrypt:EncryptionService) {}

  ngOnInit() {
    this.feedbackForm = this.fb.group({
      feedback:['',[Validators.required]],
      rating:['',[Validators.required]],
      name:['',[Validators.required]],
      artistId:['',[Validators.required]],
      id:['',[Validators.required]]
    })
    this.userData = JSON.parse(this.decrypt.deCrypt(localStorage.getItem('data')));
    this.name = this.userData.name;
    this.profileStatus = this.userData.profileStatus
    if(this.profileStatus == "Incomplete"){
      // $('#profileComplete').modal('show')
    }
    if(this.activeRoute.snapshot.params['redirected'] == 'success'){
      localStorage.setItem('microsoftInt','true')
    }
    
    this.spinner.show();
    this.apiService.fetchUserDashboardData().subscribe(
      (res:any)=>{
        if(res.status == 200){
          console.log(res.data)
          this.userStatistics = res.data.userStatistics;
          this.todayEvents = res.data.todayEvents;
          this.pastEvents = res.data.pastEvents;
          this.upComingEvents = res.data.upComingEvents;
          this.completed = res.data.userStatistics.completed;
          this.upcoming = res.data.userStatistics.inProgress;
          this.lineChartData = {
            labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL","AUG","SEP","OCT","NOV","DEC"],
            datasets: [
              {
                data: res.data.graphData,
                label: 'No. of times hired',
                fill: true,
                tension: 0.5,
                borderColor: 'black',
                backgroundColor: 'rgba(255,255,0,0.28)'
              }
            ]
          };
          this.doughnutChartDatasets = [
            { 
              data: [ this.userStatistics?.inProgress,this.userStatistics?.completed,
                 this.userStatistics?.rejected ],
                 backgroundColor: [
                  '#556ee6',
                  '#36c391',
                  '#f46a6a'
                ],
                borderColor: [
                  'rgba(177, 148, 250, .2)',
                  'rgba(132, 217, 210, .2)',
                  'rgba(254, 112, 150, .2)'
                ]
                }
          ];
        }
        else if(res.status == 204){
          if(res.data == 'Session Expired'){
            localStorage.clear();
            this.router.navigateByUrl('/account/login')
          }
          else{
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
      this.spinner.hide();
    })
  }

  getDisplayText(): string {
    return this.profileStatus == 'Incomplete' ? 'Complete Profile' : 'View Profile';
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onGridReady1(params: GridReadyEvent) {
    this.gridApi1 = params.api;
  }

  onGridReady2(params: GridReadyEvent) {
    this.gridApi2 = params.api;
  }

  filter(index :any){
    if(index == '0'){
      this.gridApi.setQuickFilter(
        (document.getElementById('filter-text-box') as HTMLInputElement).value
      );
    }
    else if(index == '1'){
      this.gridApi1.setQuickFilter(
        (document.getElementById('filter-text-box1') as HTMLInputElement).value
      );
    }
    else if(index == '2'){
      this.gridApi2.setQuickFilter(
        (document.getElementById('filter-text-box2') as HTMLInputElement).value
      );
    }
  }

  viewFeedback(data:any){
    if(new Date(data.date)<new Date() && (data.status == 'completed' || data.status == 'c')){
      this.feedbackForm.controls.id.setValue(data.id);
      this.feedbackForm.controls.name.setValue(data.name);
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
          $('#giveFeedback').modal('hide')
          let msgData = {
            severity : "success",
            summary : 'Success',
            detail : res.data,
            life : 5000
          }
        this.apiService.sendMessage(msgData);
        this.ngOnInit()
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

  onRowValueChanged(event:any) {
    // console.log(event)
    if(event.value == 'Discard Editing'){
      event.node.setDataValue(event.colDef.field, event.oldValue);
    }
    const existingRow = this.modifiedRows.find((row:any) => row.id === event.data.id);
    let status = ''
    if(event.data.status == 'completed'){
      status = 'c'
    }
    else status = event.data.status;
    let obj = {
      id : event.data.id,
      status : status
    }
    if (!existingRow) {
      this.modifiedRows.push(obj)
    }
    else{
      for(let i of this.modifiedRows){
        if(i.id == event.data.id){
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
      let msgData = {
        severity : "error",
        summary : 'Error',
        detail : 'Edit atleast one row',
        life : 5000
      }
      this.apiService.sendMessage(msgData);
    }
  }

  verifyPhone(){

  }

  verifyEmail(){
    this.apiService.initiateLoading(true);
    this.apiService.sendVerifyEmail().subscribe(
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
        this.errorMessage = res.data;
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

  navigate(){
  if(this.profileStatus == 'Incomplete'){
    let encrypt = this.decrypt.enCrypt('verify')
    this.router.navigateByUrl(`/user-profile?data=${encrypt}`)
  }
  else this.router.navigateByUrl('/user-profile')
  }

}