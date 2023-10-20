import { Component } from "@angular/core";
import { AgRendererComponent } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "status-component",
  template: `
  <span>{{data | date : 'mediumDate'}}</span>
  `,
  styleUrls: [],
})
export class dateRenderer implements AgRendererComponent{

  data:any;

  agInit(params: ICellRendererParams): void {
    this.data = params.value;
  }

  refresh(params: ICellRendererParams) {
    return true;
  }

}
