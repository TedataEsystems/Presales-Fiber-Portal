 
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { contactTeam } from '../../Models/TeamContact';
import { ConfigureService } from './configure.service';


@Injectable({
  providedIn: 'root'
})
export class TeamcontactService {
 //private apiURL:string="http://172.29.29.8:2021/api/picklist";
 private apiURL:string;
 private apiURLt:string;
  private headers = new HttpHeaders();
   constructor(private httpClient: HttpClient,
    private config:ConfigureService) {
     this.apiURL= this.config.ApiUrl() + "teamcontact";
     this.apiURLt= this.config.ApiUrl() + "team";
     this.headers =this.headers.set('Authorization',"Bearer "+ this.config.UserToken()); 
     }
  public getcontacts(){
    
    this.headers =this.headers.set('Authorization',"Bearer "+ this.config.UserToken()); 
    return this.httpClient.get<any>(`${this.apiURL}`,{headers: this.headers});
  }
  public getteams(){
    
    this.headers =this.headers.set('Authorization',"Bearer "+ this.config.UserToken()); 
    return this.httpClient.get<any>(`${this.apiURLt}`,{headers: this.headers});
  }
  public getcontactOption(attribute:any,pageSize:number,pageNum:number ,search:string="",sortColumn:string="id",sortDir:string='ASC')
{
  this.headers =this.headers.set('Authorization',"Bearer "+ this.config.UserToken()); 

    var urlval=`${this.apiURL}?pagesize=${pageSize}&pagenumber=${pageNum}&sortcolumn=${sortColumn}&sortcolumndir=${sortDir}&searchvalue=${search}&attributeName=${attribute}`;
    return this.httpClient.get<any>(urlval,{headers: this.headers});
}
contactattr(attribute:any)
{   
  this.headers =this.headers.set('Authorization',"Bearer "+ this.config.UserToken()); 

    var urlval=`${this.apiURL}?attributeName=${attribute}`;
    return this.httpClient.get<any>(urlval,{headers: this.headers});
}
  public getcontactid(id:any){
    return this.httpClient.get<any>(`${this.apiURL}/id`,{headers: this.headers});
  }
  public addcontact(Val:contactTeam){
    return this.httpClient.post<any>(`${this.apiURL}`,Val,{headers: this.headers});
  }
  public editcontact(Val:contactTeam){
    
    return this.httpClient.post<any>(`${this.apiURL}/UpdateTeamContact`,Val,{headers: this.headers});
  } 
  public delcontact(Val:number)
  { 
   // return this.httpClient.delete<simResposeData>(this.apiURL + "/" + Val,{headers: this.headers});
    return this.httpClient.get<any>(this.apiURL + "/RemoveTeamContact/" + Val,{headers: this.headers});
    
  }
}

