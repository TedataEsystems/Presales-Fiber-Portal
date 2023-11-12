import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigureService } from './configure.service';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {

private apiUrl:string ;
private headers = new HttpHeaders();
  constructor(private config:ConfigureService , private http : HttpClient)
  {
    this.apiUrl = config.ApiUrl() + 'FileManager';
    this.headers = this.headers.set('Authorization',"Bearer "+ this.config.UserToken());
  }

public getAll(attribute:any) : Observable<any>
{
  this.headers = this.headers.set('Authorization',"Bearer "+ this.config.UserToken());
  return this.http.get<any>(`${this.apiUrl}/${attribute} `, {headers:this.headers});
}

public getById(id : any)
{
  console.log('id',id)
  return this.http.get(`${this.apiUrl}/getFile/${id}`,
  {responseType: 'blob',headers: this.headers});
}

public addfile(Val:FormData,id:number)
  {
    return this.http.post<any>(`${this.apiUrl}/AddFromFile/${id}`,Val,{headers: this.headers});
  }
  public AddEsptFeedbackFile(Val:FormData,id:number)
  {
    debugger;
    console.log('formdata:',Val )
    return this.http.post<any>(`${this.apiUrl}/AddEsptFeedbackFile/${id}`,Val,{headers: this.headers});
  }

public Remove(id : any)
{
//  this.http.get<any>(this.apiUrl + '/rr' +id , {headers : this.headers});
}
}
