import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseurl: string = this.configService.ApiBaseURL;

  constructor(private http: HttpClient, private configService: ConfigService) {}

  postRequest(data: any): Observable<any> {
    const path = data.path;
    const payload = data.payload;
    return this.http.post<any[]>(this.baseurl + path, payload);
  }

  getRequest(): Observable<any> {
    return this.http.get<any[]>(this.baseurl + '');
  }
}
