import { Component } from "@angular/core";

import { AgRendererComponent } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "status-component",
  template: `
<span *ngIf="date; else elseBlock">{{date | date : 'shortTime'}}</span>
<ng-template #elseBlock>
  <span>N/A</span>
</ng-template>
  `,
  styleUrls: ['./user-history.component.css'],
})
export class userHistoryTimeRenderer implements AgRendererComponent {
  date: any;
  
  agInit(params: ICellRendererParams): void {
    if(params.value){
      this.date = params.value;
    }
  }

  refresh(params: ICellRendererParams) {
    return true;
  }
}
