
import { Injectable } from '@angular/core';
import {Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigureService {
//Apiurl:string = "https://localhost:44339/api/";//
  //  Apiurl:string = "http://172.29.29.80:6060/api/";

  Apiurl=`${environment.Apiurl}`
//
public pIn:number=0;
  constructor(  private router: Router)
   {   }

   ApiUrl()

    {
       return this.Apiurl;
    }

   UserName()
   {
       return localStorage.getItem("usernam");
   }
   UserTeam()
   {
       return localStorage.getItem("teamName");
   }
   UserToken()
   {
       return localStorage.getItem("tokNum");
   }

   IsAuthentecated()
   {
     if(!this.UserToken() || !this.UserName() || !this.UserTeam() )
     {
      this.router.navigateByUrl('/login');
     }
   }

   Logout()
   {

    localStorage.removeItem("teamName");
    localStorage.removeItem("tokNum");
    localStorage.removeItem("usernam");
   }



}
