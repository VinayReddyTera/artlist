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
    return this.http.post(environment.domain+"login",data)
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

  fetchArtistDashboardData():Observable<any>{
    return this.http.get(environment.domain+"fetchArtistDashboardData")
  }

  fetchUserDashboardData():Observable<any>{
    return this.http.get(environment.domain+"fetchArtistDashboardData")
  }

  register(payload:any):Observable<any>{
    return this.http.post(environment.domain+"register",payload)
  }

  forgotPassword(payload:any):Observable<any>{
    return this.http.post(environment.domain+"forgotPassword",payload)
  }

  resetPassword(payload:any):Observable<any>{
    return this.http.post(environment.domain+"resetPassword",payload)
  }

  giveFeedback(payload:any):Observable<any>{
    return this.http.post(environment.domain+"giveFeedback",payload)
  }

  changePassword(payload:any):Observable<any>{
    return this.http.post(environment.domain+"changePassword",payload)
  }

  updateProfile(payload:any):Observable<any>{
    return this.http.post(environment.domain+"updateProfile",payload)
  }

  sendVerifyEmail():Observable<any>{
    return this.http.get(environment.domain+"sendVerifyEmail")
  }

  addSkill(payload:any):Observable<any>{
    return this.http.post(environment.domain+"addSkill",payload)
  }

  getArtistSkill():Observable<any>{
    return this.http.get(environment.domain+"getArtistSkill")
  }

  updateArtistSkill(payload:any):Observable<any>{
    return this.http.post(environment.domain+"updateArtistSkill",payload)
  }

  addApprover(payload:any):Observable<any>{
    return this.http.post(environment.domain+"addApprover",payload)
  }

  allApprovers():Observable<any>{
    return this.http.get(environment.domain+"allApprovers")
  }

  editApprover(payload:any):Observable<any>{
    return this.http.post(environment.domain+"editApprover",payload)
  }

  pendingArtists():Observable<any>{
    return this.http.get(environment.domain+"pendingArtists")
  }

  approveSkill(payload:any):Observable<any>{
    return this.http.post(environment.domain+"approveSkill",payload)
  }

  getArtistHistory():Observable<any>{
    return this.http.get(environment.domain+"getArtistHistory")
  }

  getAvailable():Observable<any>{
    return this.http.get(environment.domain+"getAvailable")
  }

  updateAvailable(payload:any):Observable<any>{
    return this.http.post(environment.domain+"updateAvailable",payload)
  }

  updateinaug(payload:any):Observable<any>{
    return this.http.post(environment.domain+"updateinaug",payload)
  }

  updatewishes(payload:any):Observable<any>{
    return this.http.post(environment.domain+"updatewishes",payload)
  }

  getArtists():Observable<any>{
    return this.http.get(environment.domain+"getArtists")
  }

  fetchAvailable(payload:any):Observable<any>{
    return this.http.post(environment.domain+"fetchAvailable",payload)
  }

}
