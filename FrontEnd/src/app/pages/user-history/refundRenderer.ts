import { Component } from "@angular/core";

import { AgRendererComponent } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "status-component",
  template: `
  <button [disabled]='disable' class="btn btn-success btn-rounded btn-icon icon" (click)="changeStatus()">
  <i class="mdi mdi-contactless-payment edit"></i>
  </button>
  `,
  styleUrls: ['./user-history.component.css'],
})
export class refundRenderer implements AgRendererComponent {
  params: any;
  data:any;
  disable:boolean=true;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.data = params.data;
    if((this.data.paid == true && this.data.status == 'artist not attended') || this.data.refundRequested){
        this.disable = false
    }
  }

  refresh(params: ICellRendererParams) {
    return true;
  }

  changeStatus() {
    this.params.onStatusChange(this.data);
  }

}
