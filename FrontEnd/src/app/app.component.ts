import { Component , OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from './pages/services/api.service';
import { EncryptionService } from './pages/services/encryption.service';

declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {

  feedbackForm:any;
  showFeedback:boolean = false;
  title:any;

  constructor(private apiService : ApiService,private fb: FormBuilder,private decrypt:EncryptionService){}

  ngOnInit() {
    let data;
    if(localStorage.getItem('data')){
      data = JSON.parse(this.decrypt.deCrypt(localStorage.getItem('data')))
    }
    this.feedbackForm = this.fb.group({
      name: [data?.name, [Validators.required]],
      email: [data?.email, [Validators.required]],
      type: ['', [Validators.required]],
      feedback: ['', [Validators.required]]
  })

  this.apiService.givefeedback.subscribe((data) => {
    if(data){
      this.feedbackForm.get('type').setValue(data.type);
      this.title = data.title
      this.showFeedback = true;
      console.log(this.feedbackForm.value)
    }
  });

  }

  submit(){
    console.log(this.feedbackForm.value)
    if(this.feedbackForm.valid){
      this.apiService.initiateLoading(true)
      this.apiService.giveFeedback(this.feedbackForm.value).subscribe(
        (res:any)=>{
          if(res.status == 200){
            let msgData = {
              severity : "success",
              summary : 'Success',
              detail : res.data,
              life : 5000
            }
            this.apiService.sendMessage(msgData);
            this.showFeedback = false;
            $('#feedback').modal('hide')
          }
          else if(res.status == 204){
            let msgData = {
              severity : "error",
              summary : "Error",
              detail : res.data,
              life : 5000
            }
            this.apiService.sendMessage(msgData);
          }
        },
        (err:any)=>{
          console.log(err)
        }
      ).add(()=>{
              this.apiService.initiateLoading(false)
      })
    }
    else{
      let basic = this.feedbackForm.controls;
      for (let i in basic) {
        if (basic[i].invalid) {
          basic[i].markAsDirty();
        }
      }
    }
  }

  feedback(){
    $('#feedback').modal('show')
  }

}
