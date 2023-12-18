import { Component } from "@angular/core";

import { AgRendererComponent } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "status-component",
  template: `
  <a href="tel:{{data.phoneNo}}" [pTooltip]="data.phoneNo" tooltipPosition="top">
  <button class="btn btn-success btn-rounded btn-icon icon">
  <i class="mdi mdi-phone edit"></i>
  </button>
  </a> &nbsp;
  <a href="mailto:{{data.email}}" [pTooltip]="data.email" tooltipPosition="top">
  <button class="btn btn-info btn-rounded btn-icon icon">
  <i class="mdi mdi-email edit"></i>
  </button>
  </a>
  `,
  styleUrls: ['./pending-withdraws.component.css'],
})
export class pendingRenderer implements AgRendererComponent {
  data: any;
  
  agInit(params: ICellRendererParams): void {
    this.data = params.data;
  }

  refresh(params: ICellRendererParams) {
    return true;
  }
}
