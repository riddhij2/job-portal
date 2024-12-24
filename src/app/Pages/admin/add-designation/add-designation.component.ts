import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
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
  GroupDivisionList: any;
  constructor(private fb: FormBuilder, private jobapplyservice: JobApplyService) {
    this.DesignationForm = this.fb.group({
      designationName: ['', Validators.required],
      designationCode: ['', Validators.required],
      groupDivisionId: [0, Validators.required],
      active: [true],
    });
    this.GetGroupdivisions();
  }
  ngOnInit(): void {
    const existingData = this.getEditData();
    if (existingData) {
      this.isEditMode = true;
      this.DesignationForm.patchValue(existingData);
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
  onSubmit(): void {
    this.submitted = true;
    if (this.DesignationForm.invalid) {
      return;
    }
    const formData = this.DesignationForm.value;
    if (this.isEditMode) {
      console.log('Updating Designation Master:', formData);
    } else {
      console.log('Adding Designation Master:', formData);
    }
  }
}
