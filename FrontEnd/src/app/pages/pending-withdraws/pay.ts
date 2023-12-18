import { Component } from "@angular/core";
import { AgRendererComponent } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "status-component",
  template: `
  <button class="btn btn-success btn-rounded btn-icon icon" (click)="changeStatus()" pTooltip="pay" tooltipPosition="top">
  <i class="mdi mdi-contactless-payment edit"></i>
  </button>
  `,
  styleUrls: ['./pending-withdraws.component.css'],
})
export class withdrawPayRenderer implements AgRendererComponent{

  params:any;
  data:any;

  agInit(params: ICellRendererParams): void {
    this.data = params.data
    this.params = params
  }

  refresh(params: ICellRendererParams) {
    return true;
  }

  changeStatus() {
    this.params.onStatusChange(this.data);
  }

}
