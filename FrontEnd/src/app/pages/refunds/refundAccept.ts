import { Component } from "@angular/core";

import { AgRendererComponent } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "status-component",
  template: `
  <button class="btn btn-success btn-rounded btn-icon icon" pTooltip="accept" tooltipPosition="top" (click)="changeStatus('accept')">
  <i class="mdi mdi-check edit"></i>
  </button>&nbsp;
  <button class="btn btn-danger btn-rounded btn-icon icon" pTooltip="reject" tooltipPosition="top" (click)="changeStatus('reject')">
  <i class="mdi mdi-close edit"></i>
  </button>
  `,
  styleUrls: ['./refunds.component.css'],
})
export class refundAcceptRenderer implements AgRendererComponent {
  params: any;
  data:any;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.data = params.data;
  }

  refresh(params: ICellRendererParams) {
    return true;
  }

  changeStatus(status:any) {
    this.params.onStatusChange(this.data,status);
  }

}
