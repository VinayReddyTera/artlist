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
  genreData:any=[];

  ngOnInit(): void {
    if(localStorage.getItem('approveSkill')){
      this.updateData = JSON.parse(this.encryptionService.deCrypt(localStorage.getItem('approveSkill')));
      console.log(this.updateData)
    }
    else{
      localStorage.removeItem('approveSkill')
      this.router.navigateByUrl('artist-approve')
    }

    this.skillForm = this.fb.group({
      genre : this.fb.array([])
    })

    if(this.updateData.skill.validated == 'nv'){
      this.skillForm.addControl('status', new FormControl('', Validators.required));
      this.skillForm.addControl('id', new FormControl(this.updateData.skill._id, Validators.required));
      this.skillForm.addControl('name', new FormControl(this.updateData.skill.name, Validators.required));
      this.skillForm.addControl('feedback', new FormControl({value:'',disabled:true}));
    }
    if(this.updateData.skill.genre.length>0){
      const genreFormArray = this.skillForm.get('genre') as FormArray;
      genreFormArray.clear();
      this.updateData.skill.genre.forEach((i:any) => {
        if(i.validated == 'nv'){
          this.genreData.push(i)
          genreFormArray.push(
            this.fb.group({
              status: ['',[Validators.required]],
              id: [i._id,[Validators.required]],
              name: [i.name,[Validators.required]],
              feedback: [{value:'',disabled:true}]
            })
          );
        }
      });
    }
  }

  submit(){
    console.log(this.skillForm.value);
    if(this.skillForm.valid){
      this.apiService.initiateLoading(true)
      this.apiService.approveSkill(this.skillForm.value).subscribe(
        (res:any)=>{
          console.log(res)
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
        this.apiService.initiateLoading(false);
        this.skillForm.reset()
        setTimeout(()=>{
          localStorage.removeItem('approveSkill')
          this.router.navigateByUrl('artist-approve')
        },5000)
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

  statusChange(){
    if(this.skillForm.getRawValue().status == 'r'){
      this.skillForm.get('feedback')?.enable();
      this.skillForm.get('feedback')?.setValidators([Validators.required]);
      this.skillForm.get('feedback')?.updateValueAndValidity();
    }
    else{
      this.skillForm.get('feedback')?.disable();
      this.skillForm.get('feedback')?.setValue(null);
    }
    for(let i in this.skillForm.getRawValue().genre){
      if(this.skillForm.getRawValue().genre[i].status == 'r'){
        (<FormArray>this.skillForm.get('genre')).at(Number(i)).get('feedback')?.enable();
        (<FormArray>this.skillForm.get('genre')).at(Number(i)).get('feedback')?.setValidators([Validators.required]);
        (<FormArray>this.skillForm.get('genre')).at(Number(i)).get('feedback')?.updateValueAndValidity();
      }
      else{
        (<FormArray>this.skillForm.get('genre')).at(Number(i)).get('feedback')?.disable();
        (<FormArray>this.skillForm.get('genre')).at(Number(i)).get('feedback')?.setValue(null);
      }
    }
  }
}
