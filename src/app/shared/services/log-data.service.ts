import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {ConfigureService} from'src/app/shared/services/configure.service';

@Injectable({
  providedIn: 'root'
})
export class LogDataService {

  private apiURL:string;
  private headers = new HttpHeaders();
   constructor(private httpClient: HttpClient,
    private config:ConfigureService) {
     this.apiURL= this.config.ApiUrl() + "LogData";
     this.headers =this.headers.set('Authorization',"Bearer "+ this.config.UserToken()); 
     }
  public getLogs(){
     
    this.headers =this.headers.set('Authorization',"Bearer "+ this.config.UserToken()); 
    return this.httpClient.get<any>(`${this.apiURL}`,{headers: this.headers});
  }
  public getLogOption(pageSize:number,pageNum:number ,search:string="",sortColumn:string="id",sortDir:string='ASC')
{
  this.headers =this.headers.set('Authorization',"Bearer "+ this.config.UserToken()); 

    var urlval=`${this.apiURL}?pagesize=${pageSize}&pagenumber=${pageNum}&sortcolumn=${sortColumn}&sortcolumndir=${sortDir}&searchvalue=${search}`;
    return this.httpClient.get<any>(urlval,{headers: this.headers});
}
 
  public getLog(id:any){
    return this.httpClient.get<any>(`${this.apiURL}/id`,{headers: this.headers});
  }
 
}
