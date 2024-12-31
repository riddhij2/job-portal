import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddGroupDivision } from '../../../Models/Masters/add-group-division';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
declare var Swal: any;
@Component({
  selector: 'app-add-group-division',
  standalone: true,
  imports: [NgClass, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './add-group-division.component.html',
  styleUrl: './add-group-division.component.css'
})
export class AddGroupDivisionComponent {
  groupDivisionForm: FormGroup;
  isEditMode: boolean = false;
  submitted: boolean = false;
  addGroupDivision = new AddGroupDivision;
  constructor(private fb: FormBuilder, private jobapplyservice: JobApplyService, private route: ActivatedRoute, private router: Router) {
    
    this.groupDivisionForm = this.fb.group({
      groupDivisionId: [0],
      name: ['', Validators.required],
      active: [1],
    });
  }
  ngOnInit(): void {
    const groupDivisionId = this.route.snapshot.params['id'];
      console.log('Group Division ID from Route:', this.route.snapshot.params);
  
      if (groupDivisionId) {
        this.GetGroupdivisionById(Number(groupDivisionId));
        this.isEditMode = true;
      } else {
        this.isEditMode = false;
      }
  }
  GetGroupdivisionById(groupDivisionId: number) {
    this.addGroupDivision = {
      groupDivisionId: groupDivisionId,
      name: '',
      active: 1
    }
    this.jobapplyservice.GetGroupdivisionById(this.addGroupDivision).subscribe(
      (result: any) => {
        if (result.status == 200) {
          const existingData = result.body;
          console.log("existingData", existingData)
          this.addGroupDivision.groupDivisionId = existingData.divisionId;
          this.addGroupDivision.name = existingData.name; 
          this.addGroupDivision.active = existingData.active;
          this.isEditMode = true;
          this.groupDivisionForm.patchValue(this.addGroupDivision);
          // this.groupDivisionForm.patchValue({
          //   divisionId: existingData.divisionId,
          //   name: existingData.name,
          //   active: existingData.active
          // });
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
    if (this.groupDivisionForm.invalid) {
      return;
    }
    const formData: AddGroupDivision = this.groupDivisionForm.value;
    this.jobapplyservice.AddGroupDivision(formData).subscribe(
      (result: any) => {
        if (result.status === 200) {
          Swal.fire({
            text: this.isEditMode ? 'Group division updated successfully!' : 'Group division added successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result: { isConfirmed: any; }) => {
            if (result.isConfirmed) {
              if (this.isEditMode == true)
                this.router.navigate(['/admin/group-division-list']);
              else
                window.location.reload();
            }
          });
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
