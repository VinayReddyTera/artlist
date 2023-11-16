import { Component } from "@angular/core";
import { AgRendererComponent } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "status-component",
  template: `
  <button class="btn btn-success btn-rounded btn-icon icon" (click)="changeStatus('approve')">
  <i class="mdi mdi-check edit"></i>
  </button>&nbsp;
  <button class="btn btn-danger btn-rounded btn-icon icon" (click)="changeStatus('reject')">
  <i class="mdi mdi-close edit"></i>
  </button>&nbsp;
  <button class="btn btn-info btn-rounded btn-icon icon" (click)="changeStatus('reschedule')">
  <i class="mdi mdi-calendar-clock edit"></i>
  </button>
  `,
  styleUrls: ['./new-requests.component.css'],
})
export class approverRenderer implements AgRendererComponent {
  data: any;
  params:any;
  
  agInit(params: ICellRendererParams): void {
    this.data = params.data;
    this.params = params
  }

  refresh(params: ICellRendererParams) {
    return true;
  }

  changeStatus(status:any) {
    this.params.onStatusChange(this.data,status);
  }
}
