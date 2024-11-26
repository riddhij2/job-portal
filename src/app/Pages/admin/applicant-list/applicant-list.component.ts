import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { Applicationlist, ApplicationlistRequest } from '../../../Models/ApplicationList/applicationlist-request';
import { Bank, DesignationItem, LocationItem, SubDivision } from '../../../Models/JobApplication/language-labels';
import { ApplicantListService } from '../../../Services/ApplicantList/applicant-list.service';
import { JobApplicationService } from '../../../Services/JobApplication/job-application.service';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
import { AdminComponent } from '../admin.component';
declare var Swal: any;
declare var $: any;
@Component({
  selector: 'app-applicant-list',
  standalone: true,
  imports: [NgFor, CommonModule, NgIf, RouterModule, RouterLink, AdminComponent, FormsModule, DatePipe],
  templateUrl: './applicant-list.component.html',
  styleUrl: './applicant-list.component.css'
})
export class ApplicantListComponent {
  groupname: string = '';
  groupid: number = 0;
  statusid: number = 0;
  type: string = '';
  DesignationList: DesignationItem[] = [];
  LocationList: LocationItem[] = [];
  subDivisions: SubDivision[] = [];
  formData ={
    zone: '',
    designation: '',
    fromDate: '',
    subDivision: '',
    status: '',
    toDate: '',
    searchQuery: ''
  };
  StatusList: Bank[] = [];
  applicantList: ApplicationlistRequest[] = [];
  applicantReq = new Applicationlist;
  designations: { id: number, name: string }[] = [];  
  locations: { [key: string]: { id: number, name: string }[] } = {};
  constructor(private fb: FormBuilder, private router: Router, private jobapplyservice: JobApplyService, private route: ActivatedRoute, private jobappservice: JobApplicationService, private applicantservice: ApplicantListService) {
  
  }

  ngOnInit(): void {
    debugger;
    const sessionData = sessionStorage.getItem('groupParams');
    if (sessionData) {
      const parsedData = JSON.parse(sessionData);
      this.groupname = parsedData.groupname;
      this.groupid = parsedData.groupid;
      this.statusid = parsedData.status;
      this.type = parsedData.type;
      this.GetDataDashboardLinked();
    }
    this.showOptions(this.groupid);
  }

  showOptions(groupId: number) {
    this.groupid = groupId;
    this.GetDesignation(this.groupid);
    this.GetLocation(this.groupid);
    this.GetStatusMaster();
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
  GetStatusMaster() {
    this.jobappservice.GetStatusMaster().subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.StatusList = result.body;
        }
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

  GetDataDashboardLinked() {
    this.applicantReq.groupDivisionId = this.groupid;
    this.applicantReq.statusId = this.statusid;
    this.applicantReq.type = this.type;
    this.applicantservice.GetDataDashboardLinked(this.applicantReq).subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.applicantList = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  GetSearchDataPhotoSmart() {
    this.applicantReq.groupDivisionId = this.groupid;
    this.applicantReq.statusId = this.statusid;
    this.applicantReq.type = this.type;
    this.applicantReq.zoneId = Number(this.formData.zone);
    this.applicantReq.designationId = Number(this.formData.designation);
    this.applicantReq.fromDate = this.formData.fromDate;
    this.applicantReq.toDate = this.formData.toDate;
    this.applicantReq.subdivisionId = Number(this.formData.subDivision);
    this.applicantReq.statusId = Number(this.formData.status);
    this.applicantservice.GetSearchDataPhotoSmart(this.applicantReq).subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.applicantList = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  onSubmit() {
    this.GetSearchDataPhotoSmart();
  }

  ngAfterViewInit(): void {
    // Initialize Bootstrap Datepicker
    $('#datepicker').datepicker({
      format: 'dd/mm/yyyy', // Set the date format to dd/mm/yyyy
      autoclose: true, // Close the picker automatically after selection
      todayHighlight: true, // Highlight today's date
    })
    .on('changeDate', (e: any) => {
      // Update the form control value
      const selectedDate = e.format('dd/mm/yyyy');
      this.formData.fromDate = selectedDate;
      
    });

    $('#datepicker1').datepicker({
      format: 'dd/mm/yyyy', // Set the date format to dd/mm/yyyy
      autoclose: true, // Close the picker automatically after selection
      todayHighlight: true, // Highlight today's date
    })
    .on('changeDate', (e: any) => {
      // Update the form control value
      const selectedDate = e.format('dd/mm/yyyy');
     
      this.formData.toDate = selectedDate;
    });
  }
}
