import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
import { AddDesignation } from '../../../Models/Masters/add-group-division';
import { ActivatedRoute, Router } from '@angular/router';
declare var Swal: any;

@Component({
  selector: 'app-add-designation',
  standalone: true,
  imports: [NgClass, NgIf, FormsModule, ReactiveFormsModule, NgFor],
  templateUrl: './add-designation.component.html',
  styleUrl: './add-designation.component.css'
})
export class AddDesignationComponent {
  DesignationForm: FormGroup;
  isEditMode: boolean = false;
  submitted: boolean = false;
  addDesignation = new AddDesignation;
  GroupDivisionList: any;
  constructor(private fb: FormBuilder, private jobapplyservice: JobApplyService, private route: ActivatedRoute, private router: Router) {
    // if (this.route.snapshot.params['id'] != null && this.route.snapshot.params['id'] != '' && this.route.snapshot.params['id'] != 'undefined') {
    //   this.GetDesignationById(Number(this.route.snapshot.params['id']));
    //   this.isEditMode = true;
    // }
    this.DesignationForm = this.fb.group({
      designationId: [0],
      designationName: ['', Validators.required],
      designationCode: ['', Validators.required],
      groupDivisionId: ['', Validators.required],
      active: [1],
    });
  }
  ngOnInit(): void {
    this.GetGroupdivisions();
    // const existingData = this.getEditData();
    const designationId = this.route.snapshot.params['id'];
    console.log('designationId from Route:', this.route.snapshot.params);
  if (designationId) {
    this.GetDesignationById(Number(designationId));
    this.isEditMode = true;
  } else {
    this.isEditMode = false;
  }
  }
  getEditData() {
    return null;
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

  GetDesignationById(designationId: number) {
    this.addDesignation = {
      designationId: designationId,
      groupDivisionId: 0,
      designationName: '',
      designationCode: '',
      active: 1
    }
    this.jobapplyservice.GetDesignationById(this.addDesignation).subscribe(
      (result: any) => {
        if (result.status == 200) {
          const existingData = result.body;
          this.addDesignation.designationId = existingData.designationId;
          this.addDesignation.groupDivisionId = existingData.divisionId;
          this.addDesignation.designationName = existingData.designationName;
          this.addDesignation.designationCode = existingData.designationCode;
          this.addDesignation.active = existingData.active;
          this.isEditMode = true;
          this.DesignationForm.patchValue(this.addDesignation);
          if (!this.GroupDivisionList) {
            this.GetGroupdivisions();
          }
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.DesignationForm.invalid) {
      return;
    }
  
    const formData: AddDesignation = this.DesignationForm.value;
  
    this.jobapplyservice.AddDesignation(formData).subscribe(
      (result: any) => {
        if (result.status === 200) {
          Swal.fire({
            text: this.isEditMode ? 'Designation updated successfully!' : 'Designation added successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => this.router.navigate(['/admin/designation-list']));
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: 'error',
        });
      }
    );
  }
  
}
