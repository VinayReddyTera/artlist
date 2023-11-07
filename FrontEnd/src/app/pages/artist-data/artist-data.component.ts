import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EncryptionService } from '../services/encryption.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-artist-data',
  templateUrl: './artist-data.component.html',
  styleUrls: ['./artist-data.component.css']
})
export class ArtistDataComponent implements OnInit{

  constructor(private router:Router,private decrypt: EncryptionService,
    private apiservice:ApiService,private fb: FormBuilder){}

  artistData:any;
  apiCalled:boolean=false;
  bookingForm:any;
  showFrom:boolean=false;
  availableData: any = {
    "hourly": [
      {
        "date": "2023-11-08T09:25:52.910Z",
        "availableSlots": [
          "full day available"
        ],
        "availability": [
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1
        ]
      },
      {
        "date": "2023-11-09T09:25:52.910Z",
        "availableSlots": [
          "full day available"
        ],
        "availability": [
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1
        ]
      },
      {
        "date": "2023-11-10T09:25:52.910Z",
        "availableSlots": [
          "full day available"
        ],
        "availability": [
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1
        ]
      },
      {
        "date": "2023-11-11T09:25:52.910Z",
        "availableSlots": [
          "full day available"
        ],
        "availability": [
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1
        ]
      },
      {
        "date": "2023-11-13T09:25:52.910Z",
        "availableSlots": [
          "full day available"
        ],
        "availability": [
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1
        ]
      },
      {
        "date": "2023-11-14T09:25:52.910Z",
        "availableSlots": [
          "full day available"
        ],
        "availability": [
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1
        ]
      },
      {
        "date": "2023-11-15T09:25:52.910Z",
        "availableSlots": [
          "full day available"
        ],
        "availability": [
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1
        ]
      },
      {
        "date": "2023-11-16T09:25:52.910Z",
        "availableSlots": [
          "full day available"
        ],
        "availability": [
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1
        ]
      },
      {
        "date": "2023-11-17T09:25:52.910Z",
        "availableSlots": [
          "full day available"
        ],
        "availability": [
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1
        ]
      },
      {
        "date": "2023-11-18T09:25:52.910Z",
        "availableSlots": [
          "full day available"
        ],
        "availability": [
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1
        ]
      }
    ],
    "fullDay": [
      "2023-11-08T09:25:52.910Z",
      "2023-11-09T09:25:52.910Z",
      "2023-11-10T09:25:52.910Z",
      "2023-11-11T09:25:52.910Z",
      "2023-11-13T09:25:52.910Z",
      "2023-11-14T09:25:52.910Z",
      "2023-11-15T09:25:52.910Z",
      "2023-11-16T09:25:52.910Z",
      "2023-11-17T09:25:52.910Z",
      "2023-11-18T09:25:52.910Z"
    ],
    "event": [
      {
        "date": "2023-11-08T09:25:52.910Z",
        "slots": [
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "date": "2023-11-09T09:25:52.910Z",
        "slots": [
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "date": "2023-11-10T09:25:52.910Z",
        "slots": [
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "date": "2023-11-11T09:25:52.910Z",
        "slots": [
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "date": "2023-11-13T09:25:52.910Z",
        "slots": [
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "date": "2023-11-14T09:25:52.910Z",
        "slots": [
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "date": "2023-11-15T09:25:52.910Z",
        "slots": [
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "date": "2023-11-16T09:25:52.910Z",
        "slots": [
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "date": "2023-11-17T09:25:52.910Z",
        "slots": [
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "date": "2023-11-18T09:25:52.910Z",
        "slots": [
          1,
          2,
          3,
          4,
          5
        ]
      }
    ]
  };
  price:any;
  checkAvailability : boolean = false;

  ngOnInit(): void {
    if(localStorage.getItem('artistData')){
      this.artistData = JSON.parse(this.decrypt.deCrypt(localStorage.getItem('artistData')));
    }
    else{
      this.router.navigateByUrl('all-artists')
    }
    console.log(this.artistData)
    this.bookingForm = this.fb.group({
      type:['',[Validators.required]],
      date:['',[Validators.required]]
    })
  }

  // convenience getter for easy access to form fields
  get f() { return this.bookingForm.controls; }

  fetchAvailable(){
    // if(!this.apiCalled){
    //   this.apiservice.initiateLoading(true);
    //   this.apiservice.fetchAvailable({'id':this.artistData.id}).subscribe(
    //     (res:any)=>{
    //       if(res.status == 200){
    //         this.availableData = res.data
    //         console.log(this.availableData)
    //         this.apiCalled = true;
    //       }
    //       else if(res.status == 204){
    //         let msgData = {
    //           severity : "error",
    //           summary : 'Error',
    //           detail : res.data,
    //           life : 5000
    //         }
    //         this.apiservice.sendMessage(msgData);
    //       }
    //     },
    //     (err:any)=>{
    //       console.log(err)
    //     }
    //   ).add(()=>{
    //     this.apiservice.initiateLoading(false);
    //   })
    // }
    console.log(this.availableData)
  }

  bookNow(){
    if(this.bookingForm.valid && this.bookingForm.value.type == 'hourly'){
      const start = this.bookingForm.value.from.split(':')[0];
      const end = this.bookingForm.value.to.split(':')[0];
      let availability:any;
      for(let i of this.availableData.hourly){
        if(new Date(this.bookingForm.value.date).toDateString() == new Date(i.date).toDateString()){
          availability = i.availability;
          break;
        }
      }
      for(let i=start;i<end;i++){
        if(availability[i] == 0){
          let msgData = {
            severity : "error",
            summary : 'Error',
            detail : 'Slot already booked',
            life : 5000
          }
          this.apiservice.sendMessage(msgData);
          this.bookingForm.controls.from.setValue('');
          this.bookingForm.controls.to.setValue('');
          break;
        }
      }
    }
    console.log(this.bookingForm.valid,this.bookingForm.value)
    if(this.bookingForm.valid){
      if(this.bookingForm.value.type == 'hourly'){
        let from = this.format(this.bookingForm.value.from,this.bookingForm.value.date);
        let to = this.format(this.bookingForm.value.to,this.bookingForm.value.date);
        this.bookingForm.controls.from.setValue(from);
        this.bookingForm.controls.to.setValue(to);
        this.bookingForm.controls.date.setValue(new Date(this.bookingForm.value.date));
      }
      console.log(this.bookingForm.value)
      this.apiservice.initiateLoading(true);
      this.apiservice.login(this.bookingForm.value).subscribe(
      (res : any)=>{
        console.log(res)
        if(res.status == 200){
        }
        else if(res.status == 204){
        let msgData = {
              severity : "error",
              summary : 'Error',
              detail : res.data,
              life : 5000
            }
            this.apiservice.sendMessage(msgData);
        }
      },
      (err:any)=>{
        console.log(err);
      }
    ).add(()=>{
      this.apiservice.initiateLoading(false)
    })
  }
  else{
    const controls = this.bookingForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            controls[name].markAsDirty()
        }
    }
  }
  }

  addField(){
    this.bookingForm.controls.date.setValue('');
    if(this.bookingForm.value.type == 'hourly'){
      this.price = '0'
      this.bookingForm.addControl('from', new FormControl('', Validators.required));
      this.bookingForm.addControl('to', new FormControl('', Validators.required));
      this.showFrom = true;
    }
    else{
      this.bookingForm.removeControl('from');
      this.bookingForm.removeControl('to');
      this.showFrom = false;
    }
    if(this.bookingForm.value.type == 'event'){
      this.price = this.artistData.skill.pricing.event
      this.bookingForm.addControl('slot', new FormControl('', Validators.required));
    }
    else{
      this.bookingForm.removeControl('slot');
    }
    if(this.bookingForm.value.type == 'fullDay'){
      this.price = this.artistData.skill.pricing.fullDay
    }
  }

  buttonFullDay(date:any,event:any){
    this.bookingForm.controls.date.setValue(date);
    for(let i in this.availableData.fullDay){
      let id = 'btn' + i
      document.getElementById(id)?.classList.remove('btn-clicked');
    }
    document.getElementById(event.target.id)?.classList.add('btn-clicked');
  }

  buttonEvent(i:any,date:any,event:any){
    this.bookingForm.controls.date.setValue(date);
    this.bookingForm.controls.slot.setValue(i+1);
    for(let i in this.availableData.event){
      for(let j in this.availableData.event[i].slots){
        let id = 'btn' + i + j
        document.getElementById(id)?.classList.remove('btn-clicked');
      }
    }
    document.getElementById(event.target.id)?.classList.add('btn-clicked');
  }

  format(timeString:any,dateString:any){
    const [hours, minutes] = timeString.split(':').map(Number);
    const [year, month, day] = dateString.split('-').map(Number);
    const combinedDate = new Date(year, month - 1, day, hours, minutes);
    return combinedDate;
  }

  calPrice(){
    if(this.bookingForm.value.from && this.bookingForm.value.to){
      let minutes = this.calTimeDiff(this.bookingForm.value.from,this.bookingForm.value.to);
      this.price = this.artistData.skill.pricing.hourly*(minutes/60)
    }
  }

  calTimeDiff(start:any,end:any){
    // Split the time strings into hours and minutes
    const fromTimeParts = start.split(':');
    const toTimeParts = end.split(':');

    // Convert the time parts to integers
    const fromHours = parseInt(fromTimeParts[0], 10);
    const fromMinutes = parseInt(fromTimeParts[1], 10);
    const toHours = parseInt(toTimeParts[0], 10);
    const toMinutes = parseInt(toTimeParts[1], 10);

    // Calculate the time difference in minutes
    const totalMinutesFrom = fromHours * 60 + fromMinutes;
    const totalMinutesTo = toHours * 60 + toMinutes;
    const timeDifferenceMinutes = totalMinutesTo - totalMinutesFrom;
    return timeDifferenceMinutes
  }

}
