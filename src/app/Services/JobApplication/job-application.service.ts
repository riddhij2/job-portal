import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../environments/environment';
import { JobApplicationFormRequest } from '../../Models/JobApplication/job-application-form-request';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {

  constructor(private http: GlobalService) { }

  GetState(countryId: Number): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetState';
    const body = { countryId };
    return this.http.post(url, body);
  }
  GetCity(stateId: Number): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetCity';
    const body = { stateId };
    return this.http.post(url, body);
  }
  GetBankName(): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetBankName';
    return this.http.post(url, null);
  }
  GetStatusMaster(): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetStatusMaster';
    return this.http.post(url, null);
  }
  GetSubDivision(zoneId: number): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetSubDivision';
    const body = { zoneId };
    return this.http.post(url, body);
  }
  submitApplication(applicationData: JobApplicationFormRequest): Observable<any> {
    let url: string = environment.apiUrl + 'Master/SubmitApplication';
    const formData = new FormData();
    formData.append('MRID', applicationData.MRID || '');
    formData.append('FacebookId', applicationData.FacebookId || '');
    formData.append('Gender', applicationData.gender || '');
    formData.append('PinCode', applicationData.PinCode || '');
    formData.append('UANNo', applicationData.uanNo || '');
    formData.append('MobileNo', applicationData.mobileNo || '');
    formData.append('MaritalStatus', applicationData.maritalStatus || '');
    formData.append('PermanentAddress', applicationData.permanentAddress || '');
    formData.append('FatherName', applicationData.fatherName || '');
    formData.append('DistrictId', applicationData.districtId || '');
    formData.append('CStateId', applicationData.correspondenceState || '');
    formData.append('LinkdinId', applicationData.LinkdinId || '');
    formData.append('Name', applicationData.name || '');
    formData.append('StateId', applicationData.stateId || '');
    formData.append('CDistrictId', applicationData.correspondenceDistrict || '');
    formData.append('InstagramId', applicationData.InstagramId || '');
    formData.append('BankAccountNo', applicationData.bankAccountNo || '');
    formData.append('AdharNo', applicationData.adharNo || '');
    formData.append('EmailAddress', applicationData.emailAddress || '');
    formData.append('RevenueId', applicationData.revenueId || '');
    formData.append('DateOfBirth', applicationData.dateOfBirth || '');
    formData.append('CorrespondenceAddress', applicationData.correspondenceAddress || '');
    formData.append('IFSCCode', applicationData.ifscCode || '');
    formData.append('PANNo', applicationData.panNo || '');
    formData.append('FatherMobileNo', applicationData.fatherMobileNo || '');
    formData.append('TwiterId', applicationData.TwiterId || '');
    formData.append('BankId', applicationData.bankName || '');
    if (applicationData.panFile) formData.append('pancardfile', applicationData.panFile);
    if (applicationData.resumeFile) formData.append('Resumefile', applicationData.resumeFile);
    if (applicationData.qualificationFile) formData.append('Qualificationfile', applicationData.qualificationFile);
    if (applicationData.adharFile) formData.append('adharfile', applicationData.adharFile, applicationData.adharFile.name);
    if (applicationData.bankStatementFile) formData.append('Bankfile', applicationData.bankStatementFile);
    if (applicationData.passportPhoto) formData.append('PassportPhotofile', applicationData.passportPhoto);
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    return this.http.postWithFiles(url, formData);
  }
}
