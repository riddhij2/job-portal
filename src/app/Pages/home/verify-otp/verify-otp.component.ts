import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Route, Router, RouterLink } from '@angular/router';
import { SendOTPRequest } from '../../../Models/SendOTP/send-otprequest';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
declare var Swal: any;
@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf, FormsModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOTPComponent {
  otpForm!: FormGroup;
  message: string | null = null;
  MobileNo = '';
  designationId = 0;
  groupName = '';
  zoneId = 0;
  groupId = 0;
  SendOtpmodel = new SendOTPRequest;

  constructor(private fb: FormBuilder, private router: Router, private jobservice: JobApplyService) {
    this.designationId = Number(JSON.parse(sessionStorage.getItem('designationId') || '0'));
    this.zoneId = Number(JSON.parse(sessionStorage.getItem('zoneId') || '0'));
    this.groupId = Number(JSON.parse(sessionStorage.getItem('groupId') || '0'));
    let groupName = sessionStorage.getItem('groupName');
    this.groupName = groupName ? JSON.parse(groupName) : '';
    let MobileNo = sessionStorage.getItem('MobileNo');
    this.MobileNo = MobileNo ? JSON.parse(MobileNo) : '';
    if (this.designationId == 0 && this.groupName == '' && this.zoneId == 0) {
      this.router.navigate(['/JobApply']);
    }
    else if (this.MobileNo == '') {
      this.router.navigate(['/SendOTP']);
    }
    else {
      this.otpForm = this.fb.group({
        otp: ['', [Validators.required, Validators.maxLength(6), Validators.pattern(/^[0-9]{6}$/)]]
      });
    }
  }

  onSubmit(): void {
    if (this.otpForm.valid) {
      this.SendOtpmodel = {
        mobileNo: this.MobileNo,
        zonId: this.zoneId,
        designationId: this.designationId,
        groupDivisionId: this.groupId,
        otp: this.otpForm.get('otp')?.value
      };
      this.jobservice.VerifyOTP(this.SendOtpmodel).subscribe(
        (result: any) => {
          if (result.status == "Message sent successfully") {
            this.router.navigate(['/JobApplication'])
          }
        },
        (error: any) => {
          Swal.fire({
            text: error.error.status,
            icon: "error"
          });
        });
    }
  }
}
