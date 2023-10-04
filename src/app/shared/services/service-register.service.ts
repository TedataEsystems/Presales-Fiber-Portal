import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { registerDetail } from 'src/app/Models/ServiceRegister';
import { ConfigureService } from './configure.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceRegisterService {
private apiUrl:string ;
private commentUrl:string ;
private headers = new HttpHeaders();
private subject = new Subject<any>();
  constructor(private config:ConfigureService , private http : HttpClient)
  {
    this.commentUrl = config.ApiUrl() + 'RequestComments';
    this.apiUrl = config.ApiUrl() + 'RegisterDetail';
    this.headers = this.headers.set('Authorization',"Bearer "+ this.config.UserToken());
  }


public getAll() : Observable<any>
{
  this.headers = this.headers.set('Authorization',"Bearer "+ this.config.UserToken());
  return this.http.get<any>(this.apiUrl , {headers:this.headers});
}


public getByOption(attribute:any,pageSize:number,pageNum:number ,search:string="",sortColumn:string="id",sortDir:string='ASC',statusId:number=0)
 {
   this.headers =this.headers.set('Authorization',"Bearer "+ this.config.UserToken()); 
     var urlval=`${this.apiUrl}?statusId=${statusId}&servicetype=${attribute}&pagesize=${pageSize}&pagenumber=${pageNum}&sortcolumn=${sortColumn}&sortcolumndir=${sortDir}&searchvalue=${search}`;
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
public getAllComments(parm : any) : Observable<any>
{
  this.headers = this.headers.set('Authorization',"Bearer "+ this.config.UserToken());
  return this.http.get<any>(this.commentUrl +'/GetAllComments/' + parm , {headers:this.headers});
}
public AddComment(model : any)
{
  return this.http.post<any>(this.commentUrl , model , {headers : this.headers});
}

public Update(model : any) 
{
  return this.http.post<any>(this.apiUrl + '/updateregisterDetail' , model , {headers : this.headers});  
}




public Remove(Val:number)
  { 
    return this.http.get<any>(this.apiUrl + "/removeRegisterDetail/" + Val,{headers: this.headers});
    
  }

  sendMessage(message: any) {
      this.subject.next(message);
  }

  clearMessages() {
      this.subject.next();
  }

  onMessage(): Observable<any> {
      return this.subject.asObservable();
  }


}
