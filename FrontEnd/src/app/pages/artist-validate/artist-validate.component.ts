import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormControl, Validators, FormArray, AbstractControl, FormGroup  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from '../services/encryption.service';

@Component({
  selector: 'app-artist-validate',
  templateUrl: './artist-validate.component.html',
  styleUrls: ['./artist-validate.component.css']
})
export class ArtistValidateComponent implements OnInit{

  constructor(private apiService: ApiService, private fb: FormBuilder,private route:ActivatedRoute,
    private encryptionService: EncryptionService,private router : Router){}

  updateData:any;
  skillForm:any;

  ngOnInit(): void {
    if(localStorage.getItem('approveSkill')){
      this.updateData = JSON.parse(this.encryptionService.deCrypt(localStorage.getItem('approveSkill')));
      console.log(this.updateData)
    }

    this.skillForm = this.fb.group({
      genre : this.fb.array([])
    })

    if(this.updateData.skill.validated == 'nv'){
      this.skillForm.addControl('status', new FormControl('', Validators.required));
      this.skillForm.addControl('id', new FormControl(this.updateData.skill._id, Validators.required));
    }
    if(this.updateData.skill.genre.length>0){
      const genreFormArray = this.skillForm.get('genre') as FormArray;
      genreFormArray.clear();
      this.updateData.skill.genre.forEach((i:any) => {
        genreFormArray.push(
          this.fb.group({
            status: ['',[Validators.required]],
            id: [i._id,[Validators.required]]
          })
        );
      });
    }
  }

  submit(){
    console.log(this.skillForm.value);
    // if((<HTMLSelectElement>document.getElementById('mainSkill'))?.value == '0'){
    //   (<HTMLSelectElement>document.getElementById('mainSkill')).style.borderColor = '#f46a6a'
    // }
    console.log(this.skillForm.getRawValue())
    if(this.skillForm.valid){
      this.apiService.initiateLoading(true)
      this.apiService.approveSkill(this.skillForm.value).subscribe(
        (res:any)=>{
          if(res.status == 200){
            let msgData = {
              severity : "success",
              summary : 'Success',
              detail : res.data,
              life : 5000
            }
            this.apiService.sendMessage(msgData);
          }
          else if(res.status == 204){
            let msgData = {
              severity : "error",
              summary : 'Error',
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
      let basic = this.skillForm.controls;
      const controls = [basic];
      for (let i in controls) {
        for (const name in controls[i]) {
          if (controls[i][name].invalid) {
            controls[i][name].markAsDirty();
          }
        }
      }
      if(this.skillForm.value.genre.length >0){
        const arrayControls = [
          basic.genre.controls
        ];
        for (let i in arrayControls) {
          for (let j in arrayControls[i]) {
            for (const name in arrayControls[i][j].controls) {
              if (arrayControls[i][j].controls[name].invalid) {
                arrayControls[i][j].controls[name].markAsDirty();
              }
            }
          }
        }
      }
      let msgData = {
        severity : "error",
        summary : 'Error',
        detail : 'Required fields missing',
        life : 5000
      }
      this.apiService.sendMessage(msgData);
    }
  }
}
