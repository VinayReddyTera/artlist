import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { Router } from '@angular/router';
import { genreRenderer } from './genreRenderer';
import { editRenderer } from './editRenderer';
import { pricingRenderer } from './pricingRenderer';
import { FormBuilder, FormControl, Validators} from '@angular/forms';
import { EncryptionService } from '../services/encryption.service';

declare const $:any;

@Component({
  selector: 'app-skill-data',
  templateUrl: './skill-data.component.html',
  styleUrls: ['./skill-data.component.css']
})
export class SkillDataComponent implements OnInit{

  constructor(private apiService : ApiService,private fb: FormBuilder,
    private spinner : NgxSpinnerService,private router:Router,private encrypt: EncryptionService) { }
  
  errorMessage : any;
  usersRowData:any = [];
  usersColumnDefs = [
    {
      field: "name",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Skill Name",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "experience",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Experience",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value} years`
    },
    {
      field: "validated",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Validated",
      cellRenderer: (params:any)=> {
        if(params.value == null){
          return 'N/A'
        }
        else{
          if(params.value == 'a'){
            let link = `<span class="badge badge-soft-success" style="font-size:13px">Approved</span>`;
            return link
          }
          else if(params.value == 'r'){
            let link = `<span class="badge badge-soft-danger" style="font-size:13px">Rejected</span>`;
            return link
          }
          else if(params.value == 'nv'){
            let link = `<span class="badge badge-soft-warning" style="font-size:13px">Not Validated</span>`;
            return link
          }
          else{
            return 'N/A'
          }
        }
      }
    },
    {
      field: "feedback",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Feedback",
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
          if(params.value == 'active'){
            let link = `<span class="badge badge-soft-success" style="font-size:13px">${params.value}</span>`;
            return link
          }
          else{
            let link = `<span class="badge badge-soft-danger" style="font-size:13px">${params.value}</span>`;
            return link
          }
        }
      }
    },
    {
      field: "action",
      headerName: "Pricing",
      cellRenderer: pricingRenderer,
      cellRendererParams: { onStatusChange: this.viewPricing.bind(this) }
    },
    {
      field: "portfolio",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Portfolio",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value.toString()}`
    },
    {
      field: "action",
      headerName: "View Genre",
      cellRenderer: genreRenderer,
      cellRendererParams: { onStatusChange: this.viewGenre.bind(this) }
    },
    {
      field: "action",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Edit",
      cellRenderer: editRenderer
    }
  ];
  genreColumnDefs = [
    {
      field: "name",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Skill Name",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "experience",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Experience",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value} years`
    },
    {
      field: "validated",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Validated",
      cellRenderer: (params:any)=> {
        if(params.value == null){
          return 'N/A'
        }
        else{
          if(params.value == 'a'){
            let link = `<span class="badge badge-soft-success" style="font-size:13px">Approved</span>`;
            return link
          }
          else if(params.value == 'r'){
            let link = `<span class="badge badge-soft-danger" style="font-size:13px">Rejected</span>`;
            return link
          }
          else if(params.value == 'nv'){
            let link = `<span class="badge badge-soft-warning" style="font-size:13px">Not Validated</span>`;
            return link
          }
          else{
            return 'N/A'
          }
        }
      }
    },
    {
      field: "feedback",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Feedback",
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
          if(params.value == 'active'){
            let link = `<span class="badge badge-soft-success" style="font-size:13px">${params.value}</span>`;
            return link
          }
          else{
            let link = `<span class="badge badge-soft-danger" style="font-size:13px">${params.value}</span>`;
            return link
          }
        }
      }
    },
    {
      field: "portfolio",
      filter: "agDateColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Portfolio",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : `${params.value.toString()}`
    }
  ];
  genreRowData:any;
  defaultColDef : ColDef = {
    sortable:true,filter:true,resizable:true
  }
  pagination:any = true;
  gridApi:any;
  gridApi1:any;
  pricing:any;
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
  skillData:any;
  dataView:any;

  ngOnInit(): void {
    this.spinner.show()
    this.apiService.getArtistSkill().subscribe(
      (res : any)=>{
        if(res.status == 200){
          this.usersRowData = res.data;
          this.skillData = res.data;
          console.log(res.data)
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
      (err)=>{
        this.errorMessage = err.error.message
      }
    ).add(()=>{
      this.spinner.hide();
      if(this.skillData.length > 0){
        this.totalRecords = this.skillData.length;
        this.displayData = this.skillData.slice(0,10);
      }
    })

    this.filterForm = this.fb.group({
      name:[''],
      status:[''],
      validated : [''],
      experience:[''],
      rating : ['']
    })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onGridReady1(params: GridReadyEvent) {
    this.gridApi1 = params.api;
  }

  filter(){
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  filter1(){
    this.gridApi1.setQuickFilter(
      (document.getElementById('filter-text-box1') as HTMLInputElement).value
    );
  }

  refresh(){
    this.ngOnInit();
  }

  viewGenre(data:any){
    console.log(data)
    $('#viewGenreModal').modal('show');
    this.genreRowData = data
  }

  viewPricing(data:any){
    console.log(data)
    this.pricing = data
    $('#viewPricing').modal('show');
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
      this.displayData = this.skillData.slice(this.first,this.first+this.rows)
    }
  }

  clear(){
    this.filterForm.reset();
    this.displayData = this.skillData.slice(0,10);
    this.filteredData = [];
    this.filterApplied = false;
    this.errorMessage = null;
  }
  
  filterCard(){
  console.log(this.filterForm.value);
  if((this.filterForm.value?.validated).toLowerCase() == 'approved'){
    this.filterForm.controls.validated.setValue('a');
  }
  else if((this.filterForm.value?.validated).toLowerCase() == 'rejected'){
    this.filterForm.controls.validated.setValue('r');
  }
  else if(((this.filterForm.value?.validated).toLowerCase() == 'not validated') || (this.filterForm.value.validated).toLowerCase() == 'notvalidated'){
    this.filterForm.controls.validated.setValue('nv');
  }
  this.filterApplied = true
  this.filteredData = this.skillData.filter((item:any) => {
    // Function to check if a string contains a substring
    const containsSubstring = (str:any, substr:any) => str.toLowerCase().includes(substr.toLowerCase());

    // Filter by status
    if (this.filterForm.value.status && !containsSubstring(item.status, this.filterForm.value.status)) {
      return false;
    }

    // Filter by validation
    if (this.filterForm.value.validated && !containsSubstring(item.validated, this.filterForm.value.validated)) {
      return false;
    }

    // Filter by skillName
    if (
      this.filterForm.value.name &&
      !(
        containsSubstring(item.name, this.filterForm.value.name) ||
        item.genre.some((genre:any) => containsSubstring(genre.name, this.filterForm.value.name))
      )
    ) {
      return false;
    }

    // Filter by experience
    if (this.filterForm.value.experience && item.experience < parseInt(this.filterForm.value.experience)) {
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
  this.displayData = this.filteredData.slice(0,10);
  console.log(this.filteredData)
  if(this.filteredData.length == 0){
    this.errorMessage = 'No Data Available with above filter!'
  }
  else{
    this.errorMessage = null
  }
  }

  edit(data:any){
    let encryptData = this.encrypt.enCrypt(JSON.stringify(data));
    localStorage.setItem('editSkill',encryptData);
    let link = '/add-skill/'+this.encrypt.enCrypt('edit');
    this.router.navigateByUrl(link)
  }

  openDataView(data:any){
    this.dataView = data;
    $(`#dataView`).modal('show');
  }

}
