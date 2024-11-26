import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { AdminComponent } from '../admin.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Bank, District, LanguageLabels, State, SubDivision } from '../../../Models/JobApplication/language-labels';
import { JobApplicationService } from '../../../Services/JobApplication/job-application.service';
import { Applicationlist, ApplicationlistRequest } from '../../../Models/ApplicationList/applicationlist-request';
import { ApplicantListService } from '../../../Services/ApplicantList/applicant-list.service';
import { SafeUrlPipe } from '../../../safe-url.pipe';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
declare var Swal: any;

@Component({
  selector: 'app-verify-employee',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule,CommonModule, NgIf, RouterModule, RouterLink,  AdminComponent, FormsModule, SafeUrlPipe],
  templateUrl: './verify-employee.component.html',
  styleUrl: './verify-employee.component.css'
})
export class VerifyEmployeeComponent {
  applicantData: ApplicationlistRequest = new ApplicationlistRequest();
  banks: Bank[] = [];
  labels = new LanguageLabels();
  applicantReq = new Applicationlist;
  verifyEmployeeForm: FormGroup;
  selectedBankName: string = '';
  // resumepath = 'https://jobs.datagroup.in//Documents/Vivek%20kumar%20updated%20Resume.pdf';
  safeResumeUrl!: SafeResourceUrl;
  safeQualificationUrl!: SafeResourceUrl;
  safepassportPhotopathUrl!: SafeResourceUrl;
  safebankDocumentpathUrl!: SafeResourceUrl;
  safepancardpathUrl!: SafeResourceUrl;
  safeadharpathUrl!: SafeResourceUrl;
  isVerificationTriggered: boolean = false;

  constructor(private sanitizer: DomSanitizer, private jobappservice: JobApplicationService, private applicantservice: ApplicantListService, private fb: FormBuilder){
    // this.resumepath = this.sanitizer.bypassSecurityTrustResourceUrl(
    //   'https://jobs.datagroup.in//Documents/Vivek%20kumar%20updated%20Resume.pdf'
    // );
    this.verifyEmployeeForm = this.fb.group({
      bankId: [0],  
      bankAccountNo: [""],
      panNo: [""],
      adharNo: [""],
      ifscCode: [""],
    });
  }

  ngOnInit(): void {
    this.fetchApplicationData(this.applicantReq);
    this.GetBankName();
  }

  fetchApplicationData(model: Applicationlist): void{
    this.applicantservice.GetDataForVerify(model).subscribe(
      (data) => {
        if (data.body.length > 0) {
          this.applicantData = data.body[0];
          this.verifyEmployeeForm.patchValue({
            adharNo: this.applicantData.adharNo,
            panNo: this.applicantData.panNo,
            bankAccountNo: this.applicantData.bankAccountNo,
            ifscCode: this.applicantData.ifscCode,
            bankId: this.applicantData.bankId
          });
          if (this.applicantData.resumeFilepath) {
            this.safeResumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.applicantData.resumeFilepath
            );
          }
          if(this.applicantData.qualificationpath){
            this.safeQualificationUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.applicantData.qualificationpath
            )
          }
          if(this.applicantData.adharpath){
            this.safeadharpathUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.applicantData.adharpath
            )
          }
          if(this.applicantData.pancardpath){
            this.safepancardpathUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.applicantData.pancardpath
            )
          }
          if(this.applicantData.bankDocumentpath){
            this.safebankDocumentpathUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.applicantData.bankDocumentpath
            )
          }
          if(this.applicantData.passportPhotopath){
            this.safepassportPhotopathUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.applicantData.passportPhotopath
            )
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
        }
        this.isVerificationTriggered = false;
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
    this.isVerificationTriggered = false;
  }

// Check if the file is an image
isImage(filePath: string): boolean {
  const ext = filePath.split('.').pop()?.toLowerCase();
  return ext === 'jpg' || ext === 'jpeg' || ext === 'png';
}

  onSubmit(){
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
 

  onRejectNext() {
    Swal.fire({
      title: 'Remarks',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'OK',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result: { isConfirmed: any; value: any; }) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `Review sent successfully`,
          text: `Your review: ${result.value}`, 
          icon: 'success'
        });
      }
    });
  }

  onVerify() {
    this.applicantData.adharNo = this.applicantReq.adharNo;
    this.applicantData.panNo = this.applicantReq.panNo;
    this.applicantData.bankAccountNo = this.applicantReq.bankAccountNo;
    this.applicantData.bankId = this.applicantReq.bankId;
    this.applicantData.ifscCode = this.applicantReq.ifscCode;
    this.applicantData.applicantId = this.applicantReq.applicantId;
    this.fetchApplicationData(this.applicantReq);
    Swal.fire({
      text: 'Employee verified successfully!',
      icon: 'success'
    });
  }

}
