import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Applicationlist } from '../../Models/ApplicationList/applicationlist-request';
import { SendOTPRequest } from '../../Models/SendOTP/send-otprequest';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicantListService {

  constructor(private http: GlobalService) { }

  GetDataDashboardLinked(model: Applicationlist): Observable<any> {
    let url: string = environment.apiUrl + 'Report/GetDataDashboardLinked';
    return this.http.post(url, model);
  }
  GetSearchDataPhotoSmart(model: Applicationlist): Observable<any> {
    let url: string = environment.apiUrl + 'Report/GetSearchDataPhotoSmart';
    return this.http.post(url, model);
  }
  GetDataForVerify(model: Applicationlist): Observable<any> {
    let url: string = environment.apiUrl + 'Report/GetDataForVerify';
    return this.http.post(url, model);
  }
}
