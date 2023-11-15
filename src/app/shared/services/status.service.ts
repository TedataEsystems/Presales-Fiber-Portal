
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigureService } from './configure.service';

@Injectable({
  providedIn: 'root'
})
export class statusService {

private apiUrl:string ;
private headers = new HttpHeaders();


  constructor(private config:ConfigureService , private http : HttpClient)
  {
    this.apiUrl = config.ApiUrl() + 'status';
    this.headers = this.headers.set('Authorization',"Bearer "+ this.config.UserToken());
  }
  public getAllAction() : Observable<any>
  {
    this.headers = this.headers.set('Authorization',"Bearer "+ this.config.UserToken());
    return this.http.get<any>(`${this.apiUrl}/getActionStatus`, {headers:this.headers});
  }
  public getPreSalesActions() : Observable<any>
  {
    this.headers = this.headers.set('Authorization',"Bearer "+ this.config.UserToken());
    return this.http.get<any>(`${this.apiUrl}/getPreSalesActions`, {headers:this.headers});
  }
  public getEsptActions() : Observable<any>
  {
    this.headers = this.headers.set('Authorization',"Bearer "+ this.config.UserToken());
    return this.http.get<any>(`${this.apiUrl}/getEsptActions`, {headers:this.headers});
  }

public getAll() : Observable<any>
{
  this.headers = this.headers.set('Authorization',"Bearer "+ this.config.UserToken());
  return this.http.get<any>(`${this.apiUrl}`, {headers:this.headers});
}
public getchart() : Observable<any>
{
  this.headers = this.headers.set('Authorization',"Bearer "+ this.config.UserToken());
  return this.http.get<any>(`${this.apiUrl}/GetFlowchartsData`, {headers:this.headers});
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
  return this.http.post<any>(this.apiUrl + '/updatestatus' , model , {headers : this.headers});
}


public Remove(Val:number)
  {
    return this.http.get<any>(this.apiUrl + "/removeStatus/" + Val,{headers: this.headers});

  }


  public checkValueExist(value:any,id:any){

    return this.http.get<any>(this.apiUrl + `/IsStatusRepeated/${value}/${id}`,{headers: this.headers});
  }

  public checkOrderExist(value:any,id:any){

    return this.http.get<any>(this.apiUrl + `/IsStatusOrderRepeated/${value}/${id}`,{headers: this.headers});
  }

}
