 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigureService } from './configure.service';

@Injectable({
  providedIn: 'root'
})
export class ServicespeedService {

private apiUrl:string ;
private headers = new HttpHeaders();


  constructor(private config:ConfigureService , private http : HttpClient)
  {
    this.apiUrl = config.ApiUrl() + 'ServiceSpeed';
    this.headers = this.headers.set('Authorization',"Bearer "+ this.config.UserToken());
  }


public getAll(attribute:any) : Observable<any>
{
  this.headers = this.headers.set('Authorization',"Bearer "+ this.config.UserToken());
  return this.http.get<any>(`${this.apiUrl}?servicetype=${attribute} `, {headers:this.headers});
}


public getByOption(attribute:any,pageSize:number=0,pageNum:number=0 ,search:string="",sortColumn:string="id",sortDir:string='ASC')
 {
   this.headers =this.headers.set('Authorization',"Bearer "+ this.config.UserToken()); 
     var urlval=`${this.apiUrl}?pagesize=${pageSize}&pagenumber=${pageNum}&sortcolumn=${sortColumn}&sortcolumndir=${sortDir}&searchvalue=${search}&servicetype=${attribute}`;
     return this.http.get<any>(urlval,{headers: this.headers});
 }


public getById(id : any)
{
  return this.http.get<any>(this.apiUrl + '/' + id , {headers : this.headers})
}


public Add(model : any)
{
  return this.http.post<any>(this.apiUrl , model , {headers : this.headers});
}


public Update(model : any) 
{
  return this.http.post<any>(this.apiUrl + '/updateserviceSpeed' , model , {headers : this.headers});  
}


public Remove(Val:number)
  { 
    return this.http.get<any>(this.apiUrl + "/removeservicespeed/" + Val,{headers: this.headers});
    
  }


}
