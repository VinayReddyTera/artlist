import { HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TokenInterceptorService implements HttpInterceptor{

  constructor() { }

  intercept(req:any,next:any){
    let token:any = localStorage.getItem('token');
    if(!token){
      token = ''
    }
    let tokenizedReq = req.clone({
      setHeaders : {
        Authorization : token
      }
    })
    return next.handle(tokenizedReq)
  }
}