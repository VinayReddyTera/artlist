import { Component } from "@angular/core";

import { AgRendererComponent } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "status-component",
  template: `
<span *ngIf="slot; else elseBlock">{{slot | event}}</span>
<ng-template #elseBlock>
  <span>N/A</span>
</ng-template>
  `,
  styleUrls: ['./user-history.component.css'],
})
export class slotRenderer implements AgRendererComponent {
  slot: any;
  
  agInit(params: ICellRendererParams): void {
    if(params.value){
      this.slot = params.value;
    }
  }

  refresh(params: ICellRendererParams) {
    return true;
  }
}
