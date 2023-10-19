import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient,private decrypt:EncryptionService) { }

  private messageSource = new Subject<any>();
  message = this.messageSource.asObservable();

  private loading = new Subject<any>();
  loader = this.loading.asObservable();

  private feedback = new Subject<any>();
  givefeedback = this.feedback.asObservable();

  sendMessage(message: any) {
    this.messageSource.next(message);
  }

  initiateLoading(loader:any){
    this.loading.next(loader)
  }

  initiatefeedback(feedback: any) {
    this.feedback.next(feedback);
  }

  login(data : any):Observable<any>{
    return this.http.post(environment.domain+"/login",data)
  }

  isLoggedIn(){
    return this.getToken()
  }

  getRole(){
    if(localStorage.getItem('data')){
      let data:any = JSON.parse(this.decrypt.deCrypt(localStorage.getItem('data')));
      return data.role
    }
    else{
      return ''
    }
  }

  getToken() {
    if(localStorage.getItem('client-token')){
      let data = JSON.parse(this.decrypt.deCrypt(localStorage.getItem('client-token')))
      if((data.key == environment.secretKey) && (data.time>new Date())){
        return true
      }
      else{
        return false
      }
    }
    else{
      return false
    }
  }

  fetchDashboardData(data : any):Observable<any>{
    return this.http.post(environment.domain+"/fetchDashboardData",data)
  }

  register(payload:any):Observable<any>{
    return this.http.post(environment.domain+"/register",payload)
  }

  forgotPassword(payload:any):Observable<any>{
    return this.http.post(environment.domain+"/forgotPassword",payload)
  }

  resetPassword(payload:any):Observable<any>{
    return this.http.post(environment.domain+"/resetPassword",payload)
  }

  giveFeedback(payload:any):Observable<any>{
    return this.http.post(environment.domain+"/giveFeedback",payload)
  }

  changePassword(payload:any):Observable<any>{
    return this.http.post(environment.domain+"/changePassword",payload)
  }

  updateProfile(payload:any):Observable<any>{
    return this.http.post(environment.domain+"/updateProfile",payload)
  }

  sendVerifyEmail(payload:any):Observable<any>{
    return this.http.post(environment.domain+"/sendVerifyEmail",payload)
  }

  addSkill(payload:any):Observable<any>{
    return this.http.post(environment.domain+"/addSkill",payload)
  }

}
