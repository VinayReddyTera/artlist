import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authservice : ApiService, private router : Router){
  }

  redirect : any = 
    {
      'admin' : '/all-artists',
      'artist' : '/artist-dashboard',
      'user' : '/user-dashboard',
      'tag' : '/artist-approve'
    }

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let userRole : any = this.authservice.getRole();
    let roles = ['admin','user','artist','tag'];
    if(!roles.includes(userRole)){
      localStorage.clear()
    }
    if(this.authservice.isLoggedIn() == true){
      if (route.routeConfig?.path === 'login' || route.routeConfig?.path === 'reset-password' || route.routeConfig?.path === 'signup/:type' || route.routeConfig?.path === 'reset-password/:token') {
        this.router.navigateByUrl('/dashboard')
        return false;
      } else {
        let role : any = this.authservice.getRole();
        // console.log(route.data['role'])
        // console.log(role)
        if(role == 'artist' || role == 'user' || role == 'admin' || role == 'tag'){
          if(role == 'artist'){
            if(route.routeConfig?.path === 'artist-profile' || route.routeConfig?.path === 'artist-dashboard' || route.routeConfig?.path === 'artist-history' || route.routeConfig?.path === 'skill-data' || route.routeConfig?.path === 'new-requests' || route.routeConfig?.path === 'artist-approve' || route.routeConfig?.path === 'add-skill' || route.routeConfig?.path === 'add-skill/:type' || route.routeConfig?.path === 'commissions'){
              return true
            }
            else{
              console.log(`redirecting to ${this.redirect[role]}`)
              this.router.navigateByUrl(this.redirect[role])
            }
            return false
          }
          else if(role == 'user'){
            if(route.routeConfig?.path === 'user-profile' || route.routeConfig?.path === 'user-dashboard' || route.routeConfig?.path === 'user-history' || route.routeConfig?.path === 'all-artists' || route.routeConfig?.path === 'artist-data'){
              return true
            }
            else{
              console.log(`redirecting to ${this.redirect[role]}`)
              this.router.navigateByUrl(this.redirect[role])
            }
            return false
          }
          else if(role == 'tag'){
            if(route.routeConfig?.path === 'artist-approve' || route.routeConfig?.path === 'user-profile' || route.routeConfig?.path === 'tag-history' || route.routeConfig?.path === 'artist-validation'){
              return true
            }
            else{
              console.log(`redirecting to ${this.redirect[role]}`)
              this.router.navigateByUrl(this.redirect[role])
            }
            return false
          }
          else if(role == 'admin'){
            if(route.routeConfig?.path === 'all-artists' || route.routeConfig?.path === 'user-profile' || route.routeConfig?.path === 'add-approver' || route.routeConfig?.path === 'add-approver/:type' || route.routeConfig?.path === 'all-approvers' || route.routeConfig?.path === 'commissions'){
              return true
            }
            else{
              console.log(`redirecting to ${this.redirect[role]}`)
              this.router.navigateByUrl(this.redirect[role])
            }
            return false
          }
          else{
            return true    
          }
        }
        if(role){
          console.log(`redirecting to ${this.redirect[role]}`)
          this.router.navigateByUrl(this.redirect[role])
        }
        return false
      }
    }
    else {
      if (route.routeConfig?.path === 'login' || route.routeConfig?.path === 'reset-password' || route.routeConfig?.path === 'signup/:type' || route.routeConfig?.path === 'reset-password/:token') {
        return true;
      } else {
        this.router.navigateByUrl('/account/login')
        return false;
      }
    }
  }
  
}