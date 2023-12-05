import { Component, OnInit, ViewChild} from '@angular/core';
import { ApiService } from '../services/api.service';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { contactRenderer } from './contactRenderer';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from '../services/encryption.service';
import { FormBuilder, Validators } from '@angular/forms';
import { dateRenderer } from '../dateRenderer';
import { userHistoryTimeRenderer } from '../user-history/userHistoryTimeRenderer';
import { slotRenderer } from '../user-history/slotRenderer';

declare const $ : any;

@Component({
  selector: 'app-artist-dashboard',
  templateUrl: './artist-dashboard.component.html',
  styleUrls: ['./artist-dashboard.component.css']
})
export class ArtistDashboardComponent implements OnInit{

  userStatistics = {
    inProgress : 0,
    completed : 0,
    rejected : 0
  }

  name : any;
  @ViewChild('content') content:any;
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
  defaultColDef : ColDef = {
    sortable:true,filter:true,resizable:true
  }
  pagination:any = true;
  completed:any = 0;
  upcoming:any = 0;
  inaugForm:any;
  wishForm:any;

  constructor(private activeRoute : ActivatedRoute,private fb: FormBuilder,private apiService : ApiService,
    private router:Router,private decrypt:EncryptionService) {}

  ngOnInit() {
    this.inaugForm = this.fb.group({
      status: [''],
      price: ['', [Validators.required]]
    })
    this.wishForm = this.fb.group({
      status: [''],
      price: ['', [Validators.required]]
    })
    this.userData = JSON.parse(this.decrypt.deCrypt(localStorage.getItem('data')));
    console.log(this.userData)
    this.name = this.userData.name;
    this.role = this.userData.role;
    this.profileStatus = this.userData.profileStatus;
    // if(this.profileStatus == "Incomplete"){
    //   $('#profileComplete').modal('show')
    // }
    if(this.activeRoute.snapshot.params['redirected'] == 'success'){
      localStorage.setItem('microsoftInt','true')
    }
    
    this.apiService.initiateLoading(true)
    this.apiService.fetchArtistDashboardData().subscribe(
      (res:any)=>{
        if(res.status == 200){
          this.inaugForm.controls['price'].setValue(res.data.inaugPrice)
          this.inaugForm.controls['status'].setValue(res.data.inaug)
          this.wishForm.controls['price'].setValue(res.data.wishesPrice)
          this.wishForm.controls['status'].setValue(res.data.wishes)
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
      this.apiService.initiateLoading(false)
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

  updateInaug(){
    console.log(this.inaugForm.value)
    if(this.inaugForm.valid){
      this.apiService.initiateLoading(true);
      this.apiService.updateinaug(this.inaugForm.value).subscribe(
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
    else{
      const controls = this.inaugForm.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
              controls[name].markAsDirty()
          }
      }
    }
  }

  updateWishes(){
    if(this.wishForm.valid){
      this.apiService.initiateLoading(true);
      this.apiService.updatewishes(this.wishForm.value).subscribe(
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
    else{
      const controls = this.wishForm.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
              controls[name].markAsDirty()
          }
      }
    }
  }

}
