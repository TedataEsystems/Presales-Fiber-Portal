import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(private router: Router
)
{

 }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    var teamval=localStorage.getItem("teamName");

    if(teamval?.toLocaleLowerCase() == "presalesfiber_presale" || teamval?.toLocaleLowerCase() == "admin_all"){
      return true;

    }
    else {
      this.router.navigate(['/fiber'], { queryParams: { returnUrl: state.url } });
      return false;
    }





  }

}
