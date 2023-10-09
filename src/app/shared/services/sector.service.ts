import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigureService } from './configure.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SectorService {
  private apiUrl:string ;
  private headers = new HttpHeaders();


    constructor(private config:ConfigureService , private http : HttpClient)
    {
      this.apiUrl = config.ApiUrl() + 'status';

    }

    getAllSectors():Observable<any>{
      this.headers = this.headers.set('Authorization',"Bearer "+ this.config.UserToken());
      return this.http.get<any>(`${this.apiUrl}Sector/GetAllSector`,{headers:this.headers})
    }

    getSectors():Observable<any>{
     
      return this.http.get<any>(`${this.apiUrl}Sector/getSectors`)
    }
}
