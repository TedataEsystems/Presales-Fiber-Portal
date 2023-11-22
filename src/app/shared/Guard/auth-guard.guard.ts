import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(
    private router: Router
) { }

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser =  localStorage.getItem("usernam");
    if (currentUser) {
        return true;
    }

    this.router.navigate(['/loginuser'], { queryParams: { returnUrl: state.url } });
    return false;

  }

}
