import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigureService } from './configure.service';
import { Observable } from 'rxjs';
import { SectorDto } from 'src/app/Models/sectorDTO';

@Injectable({
  providedIn: 'root'
})
export class SectorService {
  private apiUrl:string ;
  private headers = new HttpHeaders();


    constructor(private config:ConfigureService , private http : HttpClient)
    {
      this.apiUrl = config.ApiUrl();

    }

    getAllSectors(pagesize :number=0,pagenumber:number=0,statusId:number,searchvalue:string="",sortcolumn:string="id",servicetype:number,sortcolumndir:string='ASC',attributeName:string):Observable<any>{

      this.headers = this.headers.set('Authorization',"Bearer "+ this.config.UserToken());
      let url=`${this.apiUrl}Sector/GetAllSector?pagesize=${pagesize}&pagenumber=${pagenumber}&statusId=${statusId}&searchvalue=${searchvalue}&sortcolumn=${sortcolumn}&servicetype=${servicetype}&sortcolumndir=${sortcolumndir}&attributeName=${attributeName}`
      return this.http.get<any>(url,{headers:this.headers})
    }
    addSector(model:SectorDto):Observable<any>{
      this.headers = this.headers.set('Authorization',"Bearer "+ this.config.UserToken());
      return this.http.post<any>(`${this.apiUrl}Sector/AddSector`,model,{headers:this.headers})
    }
    updateSector(model:SectorDto):Observable<any>{
      this.headers = this.headers.set('Authorization',"Bearer "+ this.config.UserToken());
      return this.http.post<any>(`${this.apiUrl}Sector/UpdateSector`,model,{headers:this.headers})
    }
    deleteSector(id:number):Observable<any>{
      this.headers = this.headers.set('Authorization',"Bearer "+ this.config.UserToken());
      return this.http.get<any>(`${this.apiUrl}Sector/RemoveSector/${id}`,{headers:this.headers})
    }

    getSectors():Observable<any>{
      this.headers = this.headers.set('Authorization',"Bearer "+ this.config.UserToken());
      return this.http.get<any>(`${this.apiUrl}Sector/getSectors`,{headers:this.headers})
    }
}
