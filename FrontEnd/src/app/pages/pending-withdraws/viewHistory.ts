import { Component } from "@angular/core";
import { AgRendererComponent } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "status-component",
  template: `
  <button [disabled]="!data.group" class="btn btn-info btn-rounded btn-icon icon" (click)="changeStatus()">
  <i class="mdi mdi-eye edit" aria-hidden="true">
  </i>
  </button>
  `,
  styleUrls: ['./pending-withdraws.component.css'],
})
export class historyRenderer implements AgRendererComponent{

  params:any;
  data:any;

  agInit(params: ICellRendererParams): void {
    this.data = params.data
    this.params = params;
  }

  refresh(params: ICellRendererParams) {
    return true;
  }

  changeStatus() {
    this.params.onStatusChange(this.data);
  }

}
