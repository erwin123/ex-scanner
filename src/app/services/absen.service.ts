import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders,HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AbsenService {
  private url = "https://api-absen.experd.com/api";  // URL to web api
  //private url = "http://localhost:3002/api";  // URL to web api
  private _headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private httpClient: HttpClient){ }

  getPeserta(pesertacode:string):Observable<any>{
    let myurl = this.url + '/peserta/cr';
    return this.httpClient.post<any>(myurl, { peserta_code: pesertacode},{ headers: this._headers }).pipe(map(res => {
      return res;
    }));
  }

  getReportPesertaByPass(lokasi:string, area:string, tanggal:string, jam:string):Observable<any>{
    let myurl = this.url + '/pesertabypass';
    return this.httpClient.post<any>(myurl, { loc: lokasi, area:area, tgl:tanggal, jam:jam },{ headers: this._headers }).pipe(map(res => {
      return res;
    }));
  }

  getReportPeserta(lokasi:string, area:string, tanggal:string, jam:string):Observable<any>{
    let myurl = this.url + '/peserta/cr';
    return this.httpClient.post<any>(myurl, { peserta_lokasi_test: lokasi, peserta_area:area, peserta_tgl_test:tanggal,peserta_waktu_test:jam },{ headers: this._headers }).pipe(map(res => {
      return res;
    }));
  }

  updatePeserta(absenMasuk:string, byPass = 0, absenloktglwaktu="", pesertacode:string){
    let myurl = this.url + '/peserta';
    return this.httpClient.put<any>(myurl +"/" +pesertacode, { absen_masuk: absenMasuk, absen_bypass:byPass, absen_lok_tgl_waktu:absenloktglwaktu},{ headers: this._headers }).pipe(map(res => {
      return res;
    }));
  }
}
