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
    if((this.decrypt.deCrypt(localStorage.getItem('client-token')) == environment.secretKey)){
      return true
    }
    else{
      return false
    }
  }

  changeUserInterest(data : any):Observable<any>{
    return this.http.post(environment.domain+"/changeUserInterest",data)
  }

  fetchDashboardData(data : any):Observable<any>{
    return this.http.post(environment.domain+"/fetchDashboardData",data)
  }

  remind(data : any):Observable<any>{
    return this.http.post(environment.domain+"/remind",data)
  }

  saveAnswer(data : any):Observable<any>{
    return this.http.post(environment.domain+"/saveAnswers",data)
  }

  getAnswer(data : any):Observable<any>{
    return this.http.post(environment.domain+"/getJDAnswers",data)
  }

  saveDate(data : any):Observable<any>{
    return this.http.post(environment.domain+"/saveDate",data)
  }

  updateUser(data : any):Observable<any>{
    return this.http.post(environment.domain+"/updateUser",data)
  }

  sendMail(payload:any):Observable<any>{
    return this.http.post(environment.domain+"/sendMail",payload)
  }

  generateOtp(payload:any):Observable<any>{
    return this.http.post(environment.domain+"/generateOtp",payload)
  }

  verifyPasscode(payload:any):Observable<any>{
    return this.http.post(environment.domain+"/verifyPasscode",payload)
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

  fetchAvailableSlots(payload:any):Observable<any>{
    return this.http.post(environment.domain+"/fetchAvailableSlots",payload)
  }

  giveFeedback(payload:any):Observable<any>{
    return this.http.post(environment.domain+"/giveFeedback",payload)
  }

  connectMicrosoft(payload:any):Observable<any>{
    return this.http.post(environment.domain+"/mslogin",payload)
  }

  delCalIntegration(payload:any):Observable<any>{
    return this.http.post(environment.domain+"/delCalIntegration",payload)
  }

  connectGoogle(payload:any):Observable<any>{
    return this.http.post(environment.domain+"/mslogin",payload)
  }

  delGoogleCalIntegration(payload:any):Observable<any>{
    return this.http.post(environment.domain+"/delCalIntegration",payload)
  }

  reschedule(payload:any):Observable<any>{
    return this.http.post(environment.domain+"/rescheduleInterview",payload)
  }

}
