import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeAuthGuard implements CanActivate {
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
