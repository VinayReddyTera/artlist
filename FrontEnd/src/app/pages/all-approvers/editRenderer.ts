import { Component } from "@angular/core";
import { AgRendererComponent } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";
import { EncryptionService } from "../services/encryption.service";

@Component({
  selector: "status-component",
  template: `
  <a (click)="navigate()">
  <button class="btn btn-info btn-rounded btn-icon icon">
  <i class="mdi mdi-circle-edit-outline edit"></i>
  </button>
  </a>
  `,
  styleUrls: ['./all-approvers.component.css'],
})
export class editRenderer1 implements AgRendererComponent{

constructor(private encryptionService: EncryptionService){}

params:any;
link:any;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams) {
    return true;
  }

  navigate(){
    let encryptData = this.encryptionService.enCrypt(JSON.stringify(this.params.data));
    localStorage.setItem('editApprover',encryptData);
    window.open(`${window.location.origin}/add-approver/${this.encryptionService.enCrypt('edit')}`)
  }

}
