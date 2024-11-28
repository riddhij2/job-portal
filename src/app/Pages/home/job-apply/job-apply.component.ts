import { JsonPipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DesignationItem, LocationItem } from '../../../Models/JobApplication/language-labels';
import { JobPosting } from '../../../Models/JobPosting/job-posting';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
declare var Swal: any;


@Component({
  selector: 'app-job-apply',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, KeyValuePipe, JsonPipe, FormsModule],
  templateUrl: './job-apply.component.html',
  styleUrl: './job-apply.component.css'
})
export class JobApplyComponent {
  groupId = 0;
  designationShow = false;
  ITOilShow = false;
  GroupDivisionList: any;
  DesignationList: DesignationItem[] = [];
  LocationList: LocationItem[] = [];
  jobPostings: JobPosting[] = [];
  constructor(private fb: FormBuilder, private jobapplyservice: JobApplyService, private router: Router, private cdr: ChangeDetectorRef) {
    sessionStorage.clear();
    this.GetGroupdivisions();
  }

  GetGroupdivisions() {
    this.jobapplyservice.GetGroupdivisions().subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.GroupDivisionList = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }

  showOptions(groupId: number, groupname: string) {
    this.groupId = groupId;
    if (groupId == 3 || groupId == 4) {
      this.GetDesignation(this.groupId);
      this.GetLocation(this.groupId);
      this.ITOilShow = false;
      this.designationShow = true;
    }
    else {
      this.OpenVacancies(this.groupId);
      this.designationShow = false;
      this.ITOilShow = true;
    }
  }
  GetLocation(groupId: number) {
    this.jobapplyservice.GetLocation(groupId).subscribe(
      (result: any) => {
        this.LocationList = result || []; 
        this.DesignationList.forEach((designation: DesignationItem) => {
          designation.selectedLocation = this.LocationList.length > 0 ? this.LocationList[0].locationId : 0;
        });
        this.cdr.detectChanges();
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
  OpenVacancies(groupId: number) {
    this.jobapplyservice.OpenVacancies(groupId).subscribe(
      (result: any) => {
        this.jobPostings = result;
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  redirectToSendOTP(designationId: number, groupName: string, selectedLocationId: number) {
    debugger;
    if (!selectedLocationId || selectedLocationId === 0) {
      return;
    }
    sessionStorage.setItem('groupId', JSON.stringify(this.groupId));
    sessionStorage.setItem('designationId', JSON.stringify(designationId));
    sessionStorage.setItem('groupName', JSON.stringify(groupName));
    sessionStorage.setItem('zoneId', JSON.stringify(selectedLocationId));
    this.router.navigate(['/SendOTP']);
  }
  redirectToSendOTPIO(designationId: number, groupName: string) {
    debugger;
    sessionStorage.setItem('groupId', JSON.stringify(this.groupId));
    sessionStorage.setItem('designationId', JSON.stringify(designationId));
    sessionStorage.setItem('groupName', JSON.stringify(groupName));
    sessionStorage.setItem('zoneId', JSON.stringify(0));
    this.router.navigate(['/SendOTP']);
  }
}
