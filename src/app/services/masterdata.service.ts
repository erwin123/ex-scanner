import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders,HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MasterdataService {
  private url = "https://api-absen.experd.com/api";  // URL to web api
  //private url = "http://localhost:3002/api";  // URL to web api
  private _headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private httpClient: HttpClient){ }

  getDate():Observable<any>{
    let myurl = this.url + '/tglpeserta';
    return this.httpClient.get<any>(myurl, { headers: this._headers }).pipe(map(res => {
      return res;
    }));
  }

  getTime():Observable<any>{
    let myurl = this.url + '/jampeserta';
    return this.httpClient.get<any>(myurl, { headers: this._headers }).pipe(map(res => {
      return res;
    }));
  }

  getLokasi():Observable<any>{
    let myurl = this.url + '/lokasipeserta';
    return this.httpClient.get<any>(myurl, { headers: this._headers }).pipe(map(res => {
      return res;
    }));
  }

  getArea(location:string):Observable<any>{
    let myurl = this.url + '/areapeserta';
    return this.httpClient.get<any>(myurl + "/"+location, { headers: this._headers }).pipe(map(res => {
      return res;
    }));
  }

}
