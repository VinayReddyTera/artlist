import { Component } from "@angular/core";

import { AgRendererComponent } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "status-component",
  template: `
  <div style="position:relative;">
  <span>{{data.interviewDate | date : 'medium'}}</span>
  <div *ngIf="data.onGoing" class="ring-container">
  <div class="ringring"></div>
  <div class="circle"></div>
</div>
<div *ngIf="data.past" class="ring-container">
  <div class="circle" style="background-color: #AED6F1;"></div>
</div>
<div *ngIf="data.future" class="ring-container">
  <div class="circle" style="background-color: #B19CD9;"></div>
</div>
  </div>
  `,
  styleUrls: ['./artist-dashboard.component.css'],
})
export class timeRenderer implements AgRendererComponent {
  data: any;
  
  agInit(params: ICellRendererParams): void {
    this.data = params.data;
  }

  refresh(params: ICellRendererParams) {
    return true;
  }
}
