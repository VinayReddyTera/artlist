import { Component, OnInit, ViewChild} from '@angular/core';
import { ApiService } from '../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from '../services/encryption.service';

declare const $ : any;

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {

  userStatistics = {
    inProgress : 0,
    cleared : 0,
    rejected : 0
  }

  name : any;
  @ViewChild('content') content:any;
  userData:any;
  errorMessage : any;
  resumeCount = 0;
  jdCount = 0;
  interviewerCount = 0;
  interviewerData : any;
  todayInterviews:any = [];
  upComingInterviews:any = [];
  pastInterviews:any = [];
  tooltipOptions = {
    fitContent : true
  }
  date: Date = new Date();
  profileStatus:any;

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
  
  doughnutChartLabels: string[] = [ 'Inprogress', 'Cleared', 'Rejected' ];
  doughnutChartDatasets: any = [
      { data: [ this.userStatistics.inProgress,this.userStatistics.cleared, this.userStatistics.rejected ] }
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
        filterParams: { suppressAndOrCondition: true },
        headerName: "Candidate Name",
        cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
      },
      {
        field: "intName",
        filter: "agTextColumnFilter",
        filterParams: { suppressAndOrCondition: true },
        headerName: "Interviewer Name",
        cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
      },
      {
        field: "level",
        filter: "agTextColumnFilter",
        filterParams: { suppressAndOrCondition: true },
        headerName: "Level",
        cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value,
        width : 100
      },
      {
        field: "role",
        filter: "agTextColumnFilter",
        filterParams: { suppressAndOrCondition: true },
        headerName: "Role",
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
            let link = `<span class="${params.data.class}">${params.value}</span>`;
            return link
          }
        },
        width : 100
      },
      {
        field: "feedback",
        filter: "agTextColumnFilter",
        filterParams: { suppressAndOrCondition: true },
        headerName: "Feedback",
        cellRenderer: (params:any)=> (params.value == null || params.value == "") ? "Not given yet" : params.value
      }
    ];
    defaultColDef : ColDef = {
      sortable:true,filter:true,resizable:true
    }
    pagination:any = true;
    calendarConnected :any;
    googleConnected :any;
    openings:any = 0;
    onboarded:any = 0;

  constructor(private activeRoute : ActivatedRoute,private apiService : ApiService,
    private spinner : NgxSpinnerService,private router:Router,private decrypt:EncryptionService) {}

  ngOnInit() {
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
          this.interviewerCount = res.data.interviewerCount;
          this.jdCount = res.data.jdCount;
          this.resumeCount = res.data.resumeCount;
          this.todayInterviews = res.data.todayInterviews;
          this.pastInterviews = res.data.pastInterviews;
          this.upComingInterviews = res.data.upComingInterviews;
          this.openings = res.data.openings;
          this.onboarded = res.data.onboarded;
          this.lineChartData = {
            labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL","AUG","SEP","OCT","NOV","DEC"],
            datasets: [
              {
                data: res.data.graphData,
                label: 'No. of resumes parsed',
                fill: true,
                tension: 0.5,
                borderColor: 'black',
                backgroundColor: 'rgba(255,255,0,0.28)'
              }
            ]
          };
          this.statData[0].value = res.data.jdCount;
          this.statData[1].value = res.data.resumeCount;
          this.statData[2].value = res.data.interviewerCount;
          this.doughnutChartDatasets = [
            { 
              data: [ this.userStatistics?.inProgress,this.userStatistics?.cleared,
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

}

