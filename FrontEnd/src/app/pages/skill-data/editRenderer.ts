import { Component } from "@angular/core";
import { AgRendererComponent } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "status-component",
  template: `
  <a routerLink='{{link}}' target="_blank">
  <button class="btn btn-info btn-rounded btn-icon icon">
  <i class="mdi mdi-circle-edit-outline edit"></i>
  </button>
  </a>
  `,
  styleUrls: ['./skill-data.component.css'],
})
export class editRenderer implements AgRendererComponent{

link:any;

  agInit(params: ICellRendererParams): void {
    this.link = "/uploadJd/" + 'ok'
  }

  refresh(params: ICellRendererParams) {
    return true;
  }

}
