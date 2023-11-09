import { Component } from "@angular/core";

import { AgRendererComponent } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "status-component",
  template: `
  <i class="fa fa-eye eye" aria-hidden="true" 
  (click)="changeStatus()">
  </i>
  `,
  styleUrls: ['./artist-history.component.css'],
})
export class artistfeedbackRenderer implements AgRendererComponent {
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
