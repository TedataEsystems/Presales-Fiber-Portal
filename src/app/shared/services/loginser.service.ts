
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {ConfigureService} from'src/app/shared/services/configure.service';

import { from } from 'rxjs';
import { Login } from 'src/app/Models/Logincls';
@Injectable({
  providedIn: 'root'
})
export class LoginserService {

  apiURL: string ="";
  constructor(private httpClient: HttpClient, private config: ConfigureService) {
    this.apiURL= this.config.ApiUrl() + "UserAccount";
   }
  public getLogin(model: Login)
  {
    return this.httpClient.post<any>(this.apiURL,model);
  }
}