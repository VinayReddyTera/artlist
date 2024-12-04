import { Component, OnInit, Output, EventEmitter, Inject,ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT, ViewportScroller } from '@angular/common';
import { EncryptionService } from 'src/app/pages/services/encryption.service';
import { ApiService } from 'src/app/pages/services/api.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

export class TopbarComponent implements OnInit {

  element:any;
  name : any;
  role:any;
  constructor(@Inject(DOCUMENT) private document: any, private router: Router,private decrypt:EncryptionService,private viewScroller: ViewportScroller,private apiService : ApiService,private el: ElementRef, private renderer: Renderer2) {
  }
  openMobileMenu: any;
  notificationData:any;
  loading:boolean = false;
  @Output() mobileMenuButtonClicked = new EventEmitter();
  count = 0;
  incrementCount : number = 0;
  maxLimit : number = 2;

  ngOnInit() {
    let data = JSON.parse(this.decrypt.deCrypt(localStorage.getItem('data')));
    this.name = data.name;
    this.role = data.role;
    this.openMobileMenu = false;
    this.element = document.documentElement;
  }

  adjustFontSize(delta: number) {
    if (delta < 0 && this.incrementCount <= 0) {
      console.log('Decrement not allowed before any increment');
      return;
    }

    // Prevent more than allowed increments or decrements
    if (delta > 0 && this.incrementCount >= this.maxLimit) {
      console.log('Maximum increment limit reached');
      return;
    } else if (delta < 0 && this.incrementCount <= 0) {
      console.log('No decrements allowed if increment count is 0');
      return;
    }
    let elements:any = document.querySelectorAll('body *'); // get all elements within the body
    for(let element of elements){
      let htmlElement = element as HTMLElement; // Explicitly cast Element to HTMLElement
      let currentFontSize = window.getComputedStyle(htmlElement).fontSize;
      let currentSize = `${parseFloat(currentFontSize) + delta}px`
      if(this.count){
        htmlElement.style.cssText += `font-size: ${currentSize} !important;`;
      }
      else{
        htmlElement.style.cssText += `font-size: ${currentFontSize} !important;`; 
      }
    }
    if(this.count == 0){
      this.count = 1;
      this.adjustFontSize(delta)
    }
    else{
    // Update the increment counter (and allow decrement based on current count)
    if (delta > 0) {
      this.incrementCount++; // Increment the count
    } else if (delta < 0 && this.incrementCount > 0) {
      this.incrementCount--; // Decrease the count only if allowed
    }
    }
  }

  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/account/login']);
  }

  openProfile(data:any){
    if(this.role == 'artist'){
      if(data == 'wallet'){
        let encrypt = this.decrypt.enCrypt('wallet');
        this.router.navigateByUrl(`/artist-profile?data=${encrypt}`)
      }
      else this.router.navigateByUrl('/artist-profile')
    }
    else if(this.role == 'user' || this.role == 'tag'|| this.role == 'admin'){
      if(data == 'wallet'){
        let encrypt = this.decrypt.enCrypt('wallet');
        this.router.navigateByUrl(`/user-profile?data=${encrypt}`);
      }
      else this.router.navigateByUrl('/user-profile')
    }
  }

  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  fetchNotificationData(){
    this.loading = true;
    this.apiService.fetchNotificationData().subscribe(
      (res:any)=>{
        if(res.status == 200){
          console.log(res.data)
          this.notificationData = res.data
        }
        else if(res.status == 204){
          // let msgData = {
          //   severity : "error",
          //   summary : 'Error',
          //   detail : res.data,
          //   life : 5000
          // }
          // this.apiService.sendMessage(msgData);
        }
      },
      (err:any)=>{
        console.log(err)
      }
    ).add(()=>{
      this.loading = false;
    })
  }

  openDashboard(){
    if(/dashboard/.test(this.router.url)){
      const element = document.getElementById("todayEvents");
      if (element) {
        this.viewScroller.scrollToAnchor("todayEvents");
      }
    }
    else{
      this.router.navigateByUrl('dashboard/todayEvents')
    }
  }
}
