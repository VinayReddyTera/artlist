import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormControl, Validators, FormArray, AbstractControl, FormGroup  } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from '../services/encryption.service';

declare const $ : any;

@Component({
  selector: 'app-add-skill',
  templateUrl: './add-skill.component.html',
  styleUrls: ['./add-skill.component.css']
})
export class AddSkillComponent implements OnInit {
  successMessage: any;
  errorMessage: any;
  skillForm: any;
  isCreating:any = true;
  isUpdating:any = false;
  role:any;
  updateData : any;
  showTable:boolean = false;
  disableDelete:Boolean = false;
  skillList : any;

  constructor(private apiService: ApiService, private fb: FormBuilder,private route:ActivatedRoute,
    private encryptionService: EncryptionService,private router : Router) {}

  ngOnInit(): void {
    this.skillList = environment.skillList;
    this.skillForm = this.fb.group({
      name: ['', [Validators.required]],
      status : ['active',[Validators.required]],
      validated : ['nv',[Validators.required]],
      experience: ['', [Validators.required,Validators.min(0.1),Validators.max(150)]],
      portfolio : ['',[Validators.required]],
      genre: this.fb.array([]),
      pricing : this.fb.group({
        hourly: ['', [Validators.required,Validators.min(0.1)]],
        event: ['', [Validators.required,Validators.min(0.1)]],
        fullDay: ['', [Validators.required,Validators.min(0.1)]],
        oHourly: ['', [Validators.required,Validators.min(0.1)]],
        oEvent: ['', [Validators.required,Validators.min(0.1)]],
        oFullDay: ['', [Validators.required,Validators.min(0.1)]],
      }),
    });

    if(localStorage.getItem('editSkill')){
      if(this.encryptionService.deCrypt(this.route.snapshot.paramMap.get('type')) == 'edit'){
        this.isCreating = false;
        this.isUpdating = true;
        this.updateData = JSON.parse(this.encryptionService.deCrypt(localStorage.getItem('editSkill')));
        this.edit();
      }
      else{
        localStorage.removeItem('editSkill')
      }
    }

    $(document).ready(()=> {
      $('.select2').select2({width: '100%'});
      if(this.isUpdating){
        $('.select2').val(this.updateData.name).trigger('change');
      }
    });
    $('.select2').on('change',(e:any)=>{
      let index = e.target.id;
      let skillName : any = (<HTMLSelectElement>document.getElementById(index))?.value;
      (<FormArray>this.skillForm.get('name'))?.setValue(skillName);
    });
    
  }

  addGenreFormGroup() {
    return this.fb.group({
      name: ['', [Validators.required]],
      experience : ['',[Validators.required,Validators.min(0.1),Validators.max(150)]],
      portfolio : ['',[Validators.required]],
      status : ['active',[Validators.required]],
      validated : ['nv',[Validators.required]]
    });
  }

  addGenreButtonClick(): void {
    if(this.skillForm.value.genre.length == 0){
      this.showTable = true
    }
    (<FormArray>this.skillForm.get('genre')).push(
      this.addGenreFormGroup()
    );
  }

  delete(index: any) {
    (<FormArray>this.skillForm.get('genre')).removeAt(index);
    if (this.skillForm.value.genre.length == 0) {
      this.showTable = false
    }
  }

  submit() {
    console.log(this.skillForm.getRawValue())
    if(this.skillForm.valid){
      this.apiService.initiateLoading(true)
      if(this.isCreating){
        this.apiService.addSkill(this.skillForm.getRawValue()).subscribe(
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
        let newData = this.skillForm.getRawValue()
        if(newData.validated == 'r'){
          if(newData.experience != this.updateData.experience){
            newData.validated = 'nv'
            newData.feedback = 'N/A'
          }
          else if(JSON.stringify(newData.portfolio.slice().sort()) != JSON.stringify(this.updateData.portfolio.slice().sort())){
            newData.validated = 'nv'
            newData.feedback = 'N/A'
          }
        }
        const genreMap = new Map();
        this.updateData.genre.forEach((genreItem:any) => {
          genreMap.set(genreItem.name, genreItem);
        });
        if(newData.genre.length>0){
          for(let i of newData.genre){
            if(i.validated == 'r'){
              const existingItem = genreMap.get(i.name);
              if(existingItem){
                if(i.experience != existingItem.experience){
                  i.validated = 'nv'
                  i.feedback = 'N/A'
                }
                else if(JSON.stringify(i.portfolio.slice().sort()) != JSON.stringify(existingItem.portfolio.slice().sort())){
                  i.validated = 'nv'
                  i.feedback = 'N/A'
                }
                else if(i.name != existingItem.name){
                  i.validated = 'nv'
                  i.feedback = 'N/A'
                }
              }
            }
          }
        }
        console.log(newData)
        this.apiService.updateArtistSkill(newData).subscribe(
          (res:any)=>{
            if(res.status == 200){
              let msgData = {
                severity : "success",
                summary : 'Success',
                detail : res.data,
                life : 5000
              }
              this.apiService.sendMessage(msgData);
              localStorage.removeItem('editSkill');
              this.router.navigateByUrl('skill-data')
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
    }
    else{
      let basic = this.skillForm.controls;
      let skill = basic.pricing.controls;
      const controls = [basic, skill];
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

  edit(){
    console.log(this.updateData)
    this.skillForm.patchValue({
      name: this.updateData.name,
      status : this.updateData.status,
      validated : this.updateData.validated,
      experience: this.updateData.experience,
      portfolio: this.updateData.portfolio,
      pricing : {
        hourly: this.updateData.pricing.hourly,
        fullDay: this.updateData.pricing.fullDay,
        event: this.updateData.pricing.event,
        oHourly: this.updateData.pricing.oHourly,
        oFullDay: this.updateData.pricing.oFullDay,
        oEvent: this.updateData.pricing.oEvent
      }
    });
    if(this.updateData.feedback){
      this.skillForm.addControl('feedback', new FormControl(this.updateData.feedback, Validators.required));
    }
    setTimeout(()=>{
      if(this.updateData.status == 'active'){
        (<HTMLInputElement>document.getElementById('activeMain')).checked = true;
      }
      else{
        (<HTMLInputElement>document.getElementById('activeMain')).checked = false;
      }
    },100)

    // Set 'required' validator for all fields
    Object.keys(this.skillForm.controls).forEach((key) => {
      if(key != 'genre'){
        this.skillForm.get(key).setValidators(Validators.required);
        this.skillForm.get(key).updateValueAndValidity();
      }
    });

    this.skillForm.get('experience').setValidators([Validators.required, Validators.min(0.1), Validators.max(150)]);
    this.skillForm.get('experience').updateValueAndValidity();

    // Also set 'required' validator for nested 'pricing' group
    const pricingGroup = this.skillForm.get('pricing');
    Object.keys(pricingGroup.controls).forEach((key) => {
      pricingGroup.get(key).setValidators([Validators.required,Validators.min(0.1)]);
      pricingGroup.get(key).updateValueAndValidity();
    });

    document.getElementById('skillName')?.setAttribute('disabled','true')
    this.showTable = true;
    if(this.updateData.genre.length > 0){
      const genreFormArray = this.skillForm.get('genre') as FormArray;
      genreFormArray.clear();
      this.updateData.genre.forEach((i:any) => {
        if(i.feedback){
          genreFormArray.push(
            this.fb.group({
              name: [{value:i.name,disabled:(i.validated == 'a')},[Validators.required]],
              experience : [{value:i.experience,disabled:false},[Validators.required,Validators.min(0.1),Validators.max(150)]],
              status : [{value:i.status,disabled:(i.validated == 'a')},[Validators.required]],
              portfolio : [{value:i.portfolio,disabled:false},[Validators.required]],
              validated : [{value:i.validated,disabled:false},[Validators.required]],
              feedback : [{value:i.feedback,disabled:false},[Validators.required]]
            })
          );
        }
        else{
          genreFormArray.push(
            this.fb.group({
              name: [{value:i.name,disabled:(i.validated == 'a')},[Validators.required]],
              experience : [{value:i.experience,disabled:false},[Validators.required,Validators.min(0.1),Validators.max(150)]],
              status : [{value:i.status,disabled:(i.validated == 'a')},[Validators.required]],
              portfolio : [{value:i.portfolio,disabled:false},[Validators.required]],
              validated : [{value:i.validated,disabled:false},[Validators.required]]
            })
          );
        }
      });
      setTimeout(()=>{
        for(let i in this.updateData.genre){
          if(this.updateData.genre[i].status == 'active'){
            (<HTMLInputElement>document.getElementById('genreSwitch'+i)).checked = true;
          }
          else{
            (<HTMLInputElement>document.getElementById('genreSwitch'+i)).checked = false;
          }
        }
      },100)
    }
    else{
      this.showTable = false
    }
  }

  changeActive(){
    if(this.skillForm.getRawValue().status == 'active'){
      this.skillForm.get('status').setValue('inactive');
    }
    else{
      this.skillForm.get('status').setValue('active');
    }
  }

  changeGenreActive(i:any){
    if(this.skillForm.getRawValue().genre[i].status == 'active'){
      (<FormArray>this.skillForm.get('genre')).at(i).get('status')?.setValue('inactive');
    }
    else{
      (<FormArray>this.skillForm.get('genre')).at(i).get('status')?.setValue('active');
    }
  }

}
