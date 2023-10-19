import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormControl, Validators, FormArray, AbstractControl, FormGroup  } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment.prod';
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
  showTable:boolean = false;
  skillList : String[] = [
    "Director",
    "Producer",
    "Screenwriter",
    "Cinematographer/Director of Photography (DP)",
    "Actor/Actress",
    "Editor",
    "Costume Designer",
    "Makeup and Hair Stylists",
    "Production Designer/Art Director",
    "Location Manager",
    "Sound Engineer",
    "Composer",
    "Music Director",
    "Choreographer",
    "Dancer",
    "Stunt Coordinator",
    "Special Effects Supervisor",
    "Visual Effects (VFX) Artists",
    "Dialect Coach",
    "Production Manager",
    "Casting Director",
    "Script Supervisor",
    "Gaffer",
    "Key Grip",
    "Assistant Director (1st AD, 2nd AD)",
    "Production Assistant (PA)",
    "Set Decorator",
    "Wardrobe Supervisor",
    "Animal Wrangler",
    "DIT (Digital Imaging Technician)",
    "Colorist",
    "Grip",
    "Best Boy",
    "Boom Operator",
    "Caterer/Craft Service",
    "Legal and Clearance Team",
    "Publicist",
    "Singer",
    "Musician",
    "Sound Recordist",
    "Sound designer",
    "Lighting Designer",
    "Prop Master",
    "Storyboard Artist",
    "Location Scout",
    "Dance Instructor",
    "Fight Choreographer",
    "SFX Makeup Artist",
    "Foley Artist",
    "ADR Supervisor",
    "Post-Production Supervisor",
    "Public Relations Manager",
    "Film Editor",
    "Line producer",
    "Marketing Director",
    "Set Builder",
    "Cinematographer's Assistant",
    "Background performers",
]

  constructor(private apiService: ApiService, private fb: FormBuilder,
    private spinner : NgxSpinnerService,private route:ActivatedRoute,
    private encryptionService: EncryptionService,private router : Router) {}

  ngOnInit(): void {

    $(document).ready(function() {
      $('.select2').select2({width: '100%'});
    });
    $('.select2').on('change',(e:any)=>{
      let index = e.target.id;
      let skillName : any = (<HTMLSelectElement>document.getElementById(index))?.value;
      (<FormArray>this.skillForm.get('name'))?.setValue(skillName);
    })

    this.skillForm = this.fb.group({
      name: ['', [Validators.required]],
      status : ['active',[Validators.required]],
      validated : [false,[Validators.required]],
      experience: ['', [Validators.required]],
      portfolio : ['',[Validators.required]],
      genre: this.fb.array([]),
      pricing : this.fb.group({
        hourly: ['', [Validators.required]],
        event: ['', [Validators.required]],
        fullDay: ['', [Validators.required]],
      }),
    });
    
  }

  validateEmail(c:FormControl): { emailError: { message: string; }; } | null{
    const emailRegex = environment.emailRegex
    return emailRegex.test(c.value)? null : {
      emailError : {
        message : 'Invalid email format!'
      }
    }
  }

  validatePhone(c:FormControl): { phoneError: { message: string; }; } | null{
    const phoneRegex = environment.phoneNoRegex
    return phoneRegex.test(c.value)? null : {
      phoneError : {
        message : 'Invalid Mobile No format!'
      }
    }
  }

  addGenreFormGroup() {
    return this.fb.group({
      name: ['', [Validators.required]],
      experience : ['',[Validators.required]],
      portfolio : ['',[Validators.required]],
      status : ['active',[Validators.required]],
      validated : [false,[Validators.required]]
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
    console.log(this.skillForm.value);
    if(this.skillForm.valid){
      this.apiService.initiateLoading(true)
      this.apiService.addSkill(this.skillForm.value).subscribe(
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

  edit(data:any){
    console.log(data)
  }

}
