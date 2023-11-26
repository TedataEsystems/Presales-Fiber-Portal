import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigureService } from './configure.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesUserService {

  private apiUrl:string ;
  private headers = new HttpHeaders();


    constructor(private config:ConfigureService , private http : HttpClient)
    {
      this.apiUrl = config.ApiUrl();

    }

    getSalesUser():Observable<any>{

      this.headers = this.headers.set('Authorization',"Bearer "+ this.config.UserToken());
      let url=`${this.apiUrl}SalesUser/getSalesUser`
      return this.http.get<any>(url,{headers:this.headers})
    }
}
