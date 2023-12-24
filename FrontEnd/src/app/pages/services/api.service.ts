import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,Subject,throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { EncryptionService } from './encryption.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient,private decrypt:EncryptionService,private router:Router) { }

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
    return this.http.get(environment.domain+"fetchArtistDashboardData").pipe(catchError(this.handleError.bind(this)))
  }

  fetchUserDashboardData():Observable<any>{
    return this.http.get(environment.domain+"fetchUserDashboardData").pipe(catchError(this.handleError.bind(this)))
  }

  register(payload:any):Observable<any>{
    return this.http.post(environment.domain+"register",payload).pipe(catchError(this.handleError.bind(this)))
  }

  forgotPassword(payload:any):Observable<any>{
    return this.http.post(environment.domain+"forgotPassword",payload).pipe(catchError(this.handleError.bind(this)))
  }

  resetPassword(payload:any):Observable<any>{
    return this.http.post(environment.domain+"resetPassword",payload).pipe(catchError(this.handleError.bind(this)))
  }

  giveFeedback(payload:any):Observable<any>{
    return this.http.post(environment.domain+"giveFeedback",payload).pipe(catchError(this.handleError.bind(this)))
  }

  changePassword(payload:any):Observable<any>{
    return this.http.post(environment.domain+"changePassword",payload).pipe(catchError(this.handleError.bind(this)))
  }

  updateProfile(payload:any):Observable<any>{
    return this.http.post(environment.domain+"updateProfile",payload).pipe(catchError(this.handleError.bind(this)))
  }

  sendVerifyEmail():Observable<any>{
    return this.http.get(environment.domain+"sendVerifyEmail").pipe(catchError(this.handleError.bind(this)))
  }

  addSkill(payload:any):Observable<any>{
    return this.http.post(environment.domain+"addSkill",payload).pipe(catchError(this.handleError.bind(this)))
  }

  getArtistSkill():Observable<any>{
    return this.http.get(environment.domain+"getArtistSkill").pipe(catchError(this.handleError.bind(this)))
  }

  updateArtistSkill(payload:any):Observable<any>{
    return this.http.post(environment.domain+"updateArtistSkill",payload).pipe(catchError(this.handleError.bind(this)))
  }

  addApprover(payload:any):Observable<any>{
    return this.http.post(environment.domain+"addApprover",payload).pipe(catchError(this.handleError.bind(this)))
  }

  allApprovers():Observable<any>{
    return this.http.get(environment.domain+"allApprovers").pipe(catchError(this.handleError.bind(this)))
  }

  editApprover(payload:any):Observable<any>{
    return this.http.post(environment.domain+"editApprover",payload).pipe(catchError(this.handleError.bind(this)))
  }

  pendingArtists():Observable<any>{
    return this.http.get(environment.domain+"pendingArtists").pipe(catchError(this.handleError.bind(this)))
  }

  approveSkill(payload:any):Observable<any>{
    return this.http.post(environment.domain+"approveSkill",payload).pipe(catchError(this.handleError.bind(this)))
  }

  getArtistHistory():Observable<any>{
    return this.http.get(environment.domain+"getArtistHistory").pipe(catchError(this.handleError.bind(this)))
  }

  getAvailable():Observable<any>{
    return this.http.get(environment.domain+"getAvailable").pipe(catchError(this.handleError.bind(this)))
  }

  updateAvailable(payload:any):Observable<any>{
    return this.http.post(environment.domain+"updateAvailable",payload).pipe(catchError(this.handleError.bind(this)))
  }

  updateinaug(payload:any):Observable<any>{
    return this.http.post(environment.domain+"updateinaug",payload).pipe(catchError(this.handleError.bind(this)))
  }

  updatewishes(payload:any):Observable<any>{
    return this.http.post(environment.domain+"updatewishes",payload).pipe(catchError(this.handleError.bind(this)))
  }

  getArtists():Observable<any>{
    return this.http.get(environment.domain+"getArtists").pipe(catchError(this.handleError.bind(this)))
  }

  fetchAvailable(payload:any):Observable<any>{
    return this.http.post(environment.domain+"fetchAvailable",payload).pipe(catchError(this.handleError.bind(this)))
  }

  bookArtist(payload:any):Observable<any>{
    return this.http.post(environment.domain+"bookArtist",payload).pipe(catchError(this.handleError.bind(this)));
  }

  updateBooking(payload:any):Observable<any>{
    return this.http.post(environment.domain+"updateBooking",payload).pipe(catchError(this.handleError.bind(this)));
  }

  fetchHistory():Observable<any>{
    return this.http.get(environment.domain+"fetchHistory").pipe(catchError(this.handleError.bind(this)))
  }

  fetchUnpaidCommissions():Observable<any>{
    return this.http.get(environment.domain+"fetchUnpaidCommissions").pipe(catchError(this.handleError.bind(this)))
  }

  giveArtistFeedback(payload:any):Observable<any>{
    return this.http.post(environment.domain+"giveArtistFeedback",payload).pipe(catchError(this.handleError.bind(this)));
  }

  fetchNewRequests():Observable<any>{
    return this.http.get(environment.domain+"fetchNewRequests").pipe(catchError(this.handleError.bind(this)))
  }

  updateEvent(payload:any):Observable<any>{
    return this.http.post(environment.domain+"updateEvent",payload).pipe(catchError(this.handleError.bind(this)))
  }

  updatePay(payload:any):Observable<any>{
    return this.http.post(environment.domain+"updatePay",payload).pipe(catchError(this.handleError.bind(this)))
  }

  fetchNotificationData():Observable<any>{
    return this.http.get(environment.domain+"fetchNotificationData").pipe(catchError(this.handleError.bind(this)))
  }

  payArtCommission(payload:any):Observable<any>{
    return this.http.post(environment.domain+"payArtCommission",payload).pipe(catchError(this.handleError.bind(this)))
  }

  fetchAllUnpaidCommissions():Observable<any>{
    return this.http.get(environment.domain+"fetchAllUnpaidCommissions").pipe(catchError(this.handleError.bind(this)))
  }

  fetchBalance():Observable<any>{
    return this.http.get(environment.domain+"fetchBalance").pipe(catchError(this.handleError.bind(this)))
  }

  withdrawBalance(payload:any):Observable<any>{
    return this.http.post(environment.domain+"withdrawBalance",payload).pipe(catchError(this.handleError.bind(this)))
  }

  requestRefund(payload:any):Observable<any>{
    return this.http.post(environment.domain+"requestRefund",payload).pipe(catchError(this.handleError.bind(this)))
  }

  fetchAllRefunds():Observable<any>{
    return this.http.get(environment.domain+"fetchAllRefunds").pipe(catchError(this.handleError.bind(this)))
  }

  payRefund(payload:any):Observable<any>{
    return this.http.post(environment.domain+"payRefund",payload).pipe(catchError(this.handleError.bind(this)))
  }

  fetchWithdraws():Observable<any>{
    return this.http.get(environment.domain+"fetchWithdraws").pipe(catchError(this.handleError.bind(this)))
  }

  fetchPendingWithdraws():Observable<any>{
    return this.http.get(environment.domain+"fetchPendingWithdraws").pipe(catchError(this.handleError.bind(this)))
  }

  payBalance(payload:any):Observable<any>{
    return this.http.post(environment.domain+"payBalance",payload).pipe(catchError(this.handleError.bind(this)))
  }

  fetchWalletWithdraws():Observable<any>{
    return this.http.get(environment.domain+"fetchWalletWithdraws").pipe(catchError(this.handleError.bind(this)))
  }

  bookWishes(payload:any):Observable<any>{
    return this.http.post(environment.domain+"bookWishes",payload).pipe(catchError(this.handleError.bind(this)))
  }

  bookInaug(payload:any):Observable<any>{
    return this.http.post(environment.domain+"bookInaug",payload).pipe(catchError(this.handleError.bind(this)))
  }

  private handleError(err: any): Observable<never> {
    if (err.error.status === 204) {
      localStorage.clear();
      this.router.navigateByUrl('account/login');
    }
    return throwError(err.statusText);
  }

}
