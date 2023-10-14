import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/pages/services/api.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  providers : [MessageService]
})
export class MessageComponent implements OnInit {

  constructor(private messageService: MessageService,private apiservice:ApiService) { }

  ngOnInit(): void {
    this.apiservice.message.subscribe((message:any) => {
      if(message){
        this.showmsg(message)
      }
    });
  }

  showmsg(data : any){
    this.messageService.add({severity:data.severity, summary: data.summary,detail : data.detail ,life:data.life});
  }

}
