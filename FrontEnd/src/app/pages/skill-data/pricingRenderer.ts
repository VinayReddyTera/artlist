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
  styleUrls: ['./skill-data.component.css'],
})
export class pricingRenderer implements AgRendererComponent{

  params:any;
  data:any;

  agInit(params: ICellRendererParams): void {
    this.data = params.data.pricing
    this.params = params
  }

  refresh(params: ICellRendererParams) {
    return true;
  }

  changeStatus() {
    this.params.onStatusChange(this.data);
  }

}
