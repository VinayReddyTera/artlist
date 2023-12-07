import { Component } from "@angular/core";
import { AgRendererComponent } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "status-component",
  template: `
  <button [disabled]="!(data.rescheduledBy === 'user' || data.status === 'pending' || data.status === 'r' || data.status === 'a')" class="btn btn-success btn-rounded btn-icon icon" pTooltip="approve" tooltipPosition="top" (click)="changeStatus('approve')">
  <i class="mdi mdi-check edit"></i>
  </button>&nbsp;
  <button [disabled]="!(data.rescheduledBy === 'user' || data.status === 'pending' || data.status === 'r' || data.status === 'a')" class="btn btn-danger btn-rounded btn-icon icon" pTooltip="reject" tooltipPosition="top" (click)="changeStatus('reject')">
  <i class="mdi mdi-close edit"></i>
  </button>&nbsp;
  <button [disabled]="!(data.rescheduledBy === 'user' || data.status === 'pending' || data.status === 'r' || data.status === 'a')" class="btn btn-info btn-rounded btn-icon icon" pTooltip="reschedule" tooltipPosition="top" (click)="changeStatus('reschedule')">
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
    this.params = params;
  }

  refresh(params: ICellRendererParams) {
    return true;
  }

  changeStatus(status:any) {
    this.params.onStatusChange(this.data,status);
  }
}
