import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { AdminComponent } from '../admin.component';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Bank, Company, DesignationItem, District, LanguageLabels, LocationItem, State, SubDivision } from '../../../Models/JobApplication/language-labels';
import { JobApplicationService } from '../../../Services/JobApplication/job-application.service';
import { Applicationlist, ApplicationlistRequest, EmployeeDetail } from '../../../Models/ApplicationList/applicationlist-request';
import { ApplicantListService } from '../../../Services/ApplicantList/applicant-list.service';
import { SafeUrlPipe } from '../../../safe-url.pipe';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { UserSession } from '../../../Models/UserSession/user-session';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';

declare var Swal: any;

@Component({
  selector: 'app-verify-employee',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, CommonModule, NgIf, RouterModule, RouterLink, AdminComponent, FormsModule, SafeUrlPipe, DatePipe],
  templateUrl: './verify-employee.component.html',
  styleUrl: './verify-employee.component.css'
})
export class VerifyEmployeeComponent {
  applicantData: ApplicationlistRequest = new ApplicationlistRequest();
  banks: Bank[] = [];
  Company: Company[] = [];
  labels = new LanguageLabels();
  DesignationList: DesignationItem[] = [];
  LocationList: LocationItem[] = [];
  subDivisions: SubDivision[] = [];
  applicantReq = new Applicationlist;
  verifyEmployeeForm: FormGroup;
  selectedBankName: string = '';
  safeResumeUrl!: SafeResourceUrl;
  safeQualificationUrl!: SafeResourceUrl;
  safepassportPhotopathUrl!: SafeResourceUrl;
  safebankDocumentpathUrl!: SafeResourceUrl;
  safepancardpathUrl!: SafeResourceUrl;
  safeadharpathUrl!: SafeResourceUrl;
  isVerificationTriggered: boolean = false;
  usession = new UserSession;
  applicantId = 0;

  constructor(private sanitizer: DomSanitizer, private jobappservice: JobApplicationService, private applicantservice: ApplicantListService,
    private fb: FormBuilder, private router: Router, private jobapplyservice: JobApplyService, private route: ActivatedRoute) {
    if (this.route.snapshot.params['id'] != null && this.route.snapshot.params['id'] != '' && this.route.snapshot.params['id'] != 'undefined') {
      this.applicantId = Number(this.route.snapshot.params['id']);
    }
    this.verifyEmployeeForm = this.fb.group({
      bankId: [0, Validators.required],
      companyId: [0, Validators.required],
      designationId: [0, Validators.required],
      subdivisionId: [0, Validators.required],
      zoneId: [0, Validators.required],
      bankAccountNo: [""],
      panNo: [""],
      adharNo: [""],
      ifscCode: [""],
      remark: ["", Validators.required],
      loginEmail: [""],
    });
    this.usession = JSON.parse((sessionStorage.getItem('session') || '{}'));
  }

  ngOnInit(): void {
    if (this.applicantId === 0)
      this.fetchApplicationData(this.applicantReq);
    else
      this.fetchApplicationDataById(this.applicantId);
    this.GetBankName();
    this.GetCompanyName();
  }
  OnZoneChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.GetSubDivision(selectElement.value);
  }
  fetchApplicationData(model: Applicationlist): void {
    this.applicantservice.GetDataForVerify(model).subscribe(
      (data) => {
        if (data.status == 200) {
          if (data.body.length > 0) {
            this.applicantData = data.body[0];
            this.GetDesignation(this.applicantData.groupDivisionId);
            this.GetLocation(this.applicantData.groupDivisionId);
            this.GetSubDivision(this.applicantData.zoneId.toString());
            this.verifyEmployeeForm.patchValue({
              adharNo: this.applicantData.adharNo,
              panNo: this.applicantData.panNo,
              bankAccountNo: this.applicantData.bankAccountNo,
              ifscCode: this.applicantData.ifscCode,
              bankId: this.applicantData.bankId,
              companyId: model.companyId,
              designationId: this.applicantData.designationId,
              zoneId: this.applicantData.zoneId,
              subdivisionId: this.applicantData.revenueId,
              remark: ''
            });

            if (this.applicantData.qualificationpath) {
              this.safeQualificationUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                this.applicantData.qualificationpath
              )
            }
            if (this.applicantData.adharpath) {
              this.safeadharpathUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                this.applicantData.adharpath
              )
            }
            if (this.applicantData.pancardpath) {
              this.safepancardpathUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                this.applicantData.pancardpath
              )
            }
            if (this.applicantData.bankDocumentpath) {
              this.safebankDocumentpathUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                this.applicantData.bankDocumentpath
              )
            }
            if (this.applicantData.passportPhotopath) {
              this.safepassportPhotopathUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                this.applicantData.passportPhotopath
              )
            }
            if (this.applicantData.resumeFilepath) {
              this.safeResumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                this.applicantData.resumeFilepath
              );
            }
            if (this.isVerificationTriggered) {
              Swal.fire({
                text: 'Employee verified successfully!',
                icon: 'success'
              });
            }
          }
          else {
            this.applicantData = new ApplicationlistRequest;
            Swal.fire({
              text: 'All Employees verified successfully!',
              icon: 'success'
            });
            this.router.navigate(['/admin']);
          }
          this.isVerificationTriggered = false;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
    this.isVerificationTriggered = false;
  }
  fetchApplicationDataById(applicantId: number) {
    const model = new EmployeeDetail();
    model.applicantId = applicantId;
    //this.GetState();
    this.applicantservice.GetDataApplicantOther(model).subscribe(
      (data) => {
        if (data.status == 200 && data.body.length > 0) {
          this.applicantData = data.body[0];
          this.GetDesignation(this.applicantData.groupDivisionId);
          this.GetLocation(this.applicantData.groupDivisionId);
          this.GetSubDivision(this.applicantData.zoneId.toString());
          this.verifyEmployeeForm.patchValue({
            adharNo: this.applicantData.adharNo,
            panNo: this.applicantData.panNo,
            bankAccountNo: this.applicantData.bankAccountNo,
            ifscCode: this.applicantData.ifscCode,
            bankId: this.applicantData.bankId,
            companyId: 0,
            designationId: this.applicantData.designationId,
            zoneId: this.applicantData.zoneId,
            subdivisionId: this.applicantData.revenueId,
            remark: ''
          });

          if (this.applicantData.qualificationpath) {
            this.safeQualificationUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.applicantData.qualificationpath
            )
          }
          if (this.applicantData.adharpath) {
            this.safeadharpathUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.applicantData.adharpath
            )
          }
          if (this.applicantData.pancardpath) {
            this.safepancardpathUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.applicantData.pancardpath
            )
          }
          if (this.applicantData.bankDocumentpath) {
            this.safebankDocumentpathUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.applicantData.bankDocumentpath
            )
          }
          if (this.applicantData.passportPhotopath) {
            this.safepassportPhotopathUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.applicantData.passportPhotopath
            )
          }
          if (this.applicantData.resumeFilepath) {
            this.safeResumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.applicantData.resumeFilepath
            );
          }
          if (this.isVerificationTriggered) {
            Swal.fire({
              text: 'Employee verified successfully!',
              icon: 'success'
            });
          }
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      }
    );
  }
  isImage(filePath: string | undefined | null): boolean {
    if (!filePath) {
      return false;
    }
    const ext = filePath.split('.').pop()?.toLowerCase();
    return ext === 'jpg' || ext === 'jpeg' || ext === 'png';
  }

  onSubmit() {
  }

  GetBankName() {
    this.jobappservice.GetBankName().subscribe(
      (result: any) => {
        if (result != null) {
          this.banks = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  GetCompanyName() {
    this.jobappservice.GetCompany().subscribe(
      (result: any) => {
        if (result != null) {
          this.Company = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }

  onEditApplicant() {
    this.applicantReq.adharNo = this.verifyEmployeeForm.get('adharNo')?.value;
    this.applicantReq.panNo = this.verifyEmployeeForm.get('panNo')?.value;
    this.applicantReq.bankAccountNo = this.verifyEmployeeForm.get('bankAccountNo')?.value;
    this.applicantReq.bankId = this.verifyEmployeeForm.get('bankId')?.value;
    this.applicantReq.ifscCode = this.verifyEmployeeForm.get('ifscCode')?.value;
    this.applicantReq.designationId = this.verifyEmployeeForm.get('designationId')?.value;
    this.applicantReq.zoneId = this.verifyEmployeeForm.get('zoneId')?.value;
    this.applicantReq.subdivisionId = this.verifyEmployeeForm.get('subdivisionId')?.value;
    this.applicantReq.applicantId = this.applicantData.applicantId;
    this.applicantReq.loginEmail = this.usession.emailAddress;
    this.applicantservice.UpdateApplicantDetail(this.applicantReq).subscribe(
      (data) => {
        if (data.status == 200) {
          Swal.fire({
            text: 'Employee data saved successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result: { isConfirmed: any; }) => {
            if (result.isConfirmed) {
              this.router.navigate(['/admin/applicant-list']);
            }
          });
        }
      });
  }
  onRejectNext() {
    this.applicantReq.adharNo = this.verifyEmployeeForm.get('adharNo')?.value;
    this.applicantReq.panNo = this.verifyEmployeeForm.get('panNo')?.value;
    this.applicantReq.bankAccountNo = this.verifyEmployeeForm.get('bankAccountNo')?.value;
    this.applicantReq.bankId = this.verifyEmployeeForm.get('bankId')?.value;
    this.applicantReq.ifscCode = this.verifyEmployeeForm.get('ifscCode')?.value;
    this.applicantReq.companyId = Number(this.verifyEmployeeForm.get('companyId')?.value);
    this.applicantReq.remark = this.verifyEmployeeForm.get('remark')?.value;
    this.applicantReq.applicantId = this.applicantData.applicantId;
    this.applicantReq.loginEmail = this.usession.emailAddress;
    this.applicantReq.status = 'Rejected';
    this.fetchApplicationData(this.applicantReq);
    Swal.fire({
      text: 'Employee rejected successfully!',
      icon: 'success'
    });
  }
  getFormattedAge(): string {
    const age = this.applicantData?.age || "0:0";
    const [years, months] = age.split(':').map(Number);
    return `${years} years and ${months} months`;
  }
  onVerify() {
    this.applicantReq.adharNo = this.verifyEmployeeForm.get('adharNo')?.value;
    this.applicantReq.panNo = this.verifyEmployeeForm.get('panNo')?.value;
    this.applicantReq.bankAccountNo = this.verifyEmployeeForm.get('bankAccountNo')?.value;
    this.applicantReq.bankId = this.verifyEmployeeForm.get('bankId')?.value;
    this.applicantReq.ifscCode = this.verifyEmployeeForm.get('ifscCode')?.value;
    this.applicantReq.companyId = Number(this.verifyEmployeeForm.get('companyId')?.value);
    this.applicantReq.remark = this.verifyEmployeeForm.get('remark')?.value;
    this.applicantReq.designationId = this.verifyEmployeeForm.get('designationId')?.value;
    this.applicantReq.zoneId = this.verifyEmployeeForm.get('zoneId')?.value;
    this.applicantReq.subdivisionId = this.verifyEmployeeForm.get('subdivisionId')?.value;
    this.applicantReq.applicantId = this.applicantData.applicantId;
    this.applicantReq.loginEmail = this.usession.emailAddress;
    this.applicantReq.status = 'Verified';
    this.fetchApplicationData(this.applicantReq);
    Swal.fire({
      text: 'Employee verified successfully!',
      icon: 'success'
    });
  }
  GetLocation(groupId: number) {
    this.jobapplyservice.GetLocation(groupId).subscribe(
      (result: any) => {
        this.LocationList = result;
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  GetDesignation(groupId: number) {
    this.jobapplyservice.GetDesignation(groupId).subscribe(
      (result: any) => {
        this.DesignationList = result;
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  GetSubDivision(zoneId: string) {
    this.jobappservice.GetSubDivision(Number(zoneId)).subscribe(
      (result: any) => {
        if (result != null) {
          this.subDivisions = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
}
