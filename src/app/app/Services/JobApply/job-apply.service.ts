import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AddGroupDivision } from '../../Models/Masters/add-group-division';
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
  GetProject(groupDivisionId: Number): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetProject';
    const body = { groupDivisionId };
    return this.http.postWithoutResponse(url, body);
  }
  SendWhatsappOTP(model: SendOTPRequest): Observable<any> {
    let url: string = environment.apiUrl + 'Master/SendWhatsappOTP';
    return this.http.post(url, model);
  }
  ReSendWhatsappOTP(model: SendOTPRequest): Observable<any> {
    let url: string = environment.apiUrl + 'Master/ReSendWhatsappOTP';
    return this.http.post(url, model);
  }
  VerifyOTP(model: SendOTPRequest): Observable<any> {
    let url: string = environment.apiUrl + 'Master/VerifyOTP';
    return this.http.postWithoutResponse(url, model);
  }
  OpenVacancies(groupDivisionId: Number): Observable<any> {
    let url: string = environment.apiUrl + 'JobPosting/OpenVacancies';
    const body = { groupDivisionId };
    return this.http.postWithoutResponse(url, body);
  }
  GetAllGroupdivisions(): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetAllGroupdivisions';
    return this.http.post(url, null);
  }
  GetAllLocations(): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetAllLocation';
    return this.http.post(url, null);
  }
  GetAllDesignations(): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetAllDesignation';
    return this.http.post(url, null);
  }
  GetAllProjects(): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetAllProject';
    return this.http.post(url, null);
  }
  GetGroupdivisionById(model: AddGroupDivision): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetGroupdivisionById';
    return this.http.post(url, model);
  }
  AddGroupDivision(model: AddGroupDivision): Observable<any> {
    let url: string = environment.apiUrl + 'Master/AddGroupDivision';
    return this.http.post(url, model);
  }
}
