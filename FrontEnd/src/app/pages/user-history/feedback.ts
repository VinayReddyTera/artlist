import { Component } from "@angular/core";

import { AgRendererComponent } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "status-component",
  template: `
  <button class="btn btn-info btn-rounded btn-icon icon">
  <i class="mdi mdi-circle-edit-outline edit"></i>
  </button>
  `,
  styleUrls: ['./user-history.component.css'],
})
export class feedbackRenderer implements AgRendererComponent {
  params: any;
  data:any;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.data = params.data;
  }

  refresh(params: ICellRendererParams) {
    return true;
  }

  changeStatus() {
    this.params.onStatusChange(this.data);
  }

}
