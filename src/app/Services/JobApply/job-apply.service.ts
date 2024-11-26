import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SendOTPRequest } from '../../Models/SendOTP/send-otprequest';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class JobApplyService {

  constructor(private http: GlobalService) { }

  GetGroupdivisions(): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetGroupdivisions';
    return this.http.post(url, null);
  }
  GetDesignation(groupDivisionId: Number): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetDesignation';
    const body = { groupDivisionId };
    return this.http.postWithoutResponse(url, body);
  }
  GetLocation(groupDivisionId: Number): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetLocation';
    const body = { groupDivisionId };
    return this.http.postWithoutResponse(url, body);
  }
  SendWhatsappOTP(model: SendOTPRequest): Observable<any> {
    let url: string = environment.apiUrl + 'Master/SendWhatsappOTP';
    return this.http.post(url, model);
  }
  VerifyOTP(model: SendOTPRequest): Observable<any> {
    let url: string = environment.apiUrl + 'Master/VerifyOTP';
    return this.http.postWithoutResponse(url, model);
  }

}
