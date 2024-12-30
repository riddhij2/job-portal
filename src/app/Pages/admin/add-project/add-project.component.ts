import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
import { AddProject } from '../../../Models/Masters/add-group-division';
import { ActivatedRoute, Router } from '@angular/router';
declare var Swal: any;
@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [NgClass, NgIf, FormsModule, ReactiveFormsModule, NgFor],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent {
  ProjectForm: FormGroup;
  isEditMode: boolean = false;
  submitted: boolean = false;
  addProject = new AddProject;
  GroupDivisionList: any;
  projectId: number = 0;

  constructor(private fb: FormBuilder, private jobapplyservice: JobApplyService, private route: ActivatedRoute, private router: Router) {
    const routeProjectId = this.route.snapshot.params['id'];
    if (routeProjectId) {
      this.projectId = Number(routeProjectId);
      this.AddProjects(this.projectId);
      this.isEditMode = true;
    }

    this.ProjectForm = this.fb.group({
      projectId:[0],
      projectName: ['', Validators.required],
      groupDivisionId: [0, Validators.required],
      active: [1],
      
    });
    this.GetGroupdivisions();

    
  }
  ngOnInit(): void {
    const existingData = this.getEditData();
    if (existingData) {
      this.isEditMode = true;
      this.ProjectForm.patchValue(existingData);
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
  AddProjects(projectId: number) {
    this.addProject = {
      projectId: projectId,
      groupDivisionId: 0,
      projectName: '',
      active: 1
    }
    this.jobapplyservice.AddProject(this.addProject).subscribe(
      (result: any) => {
        if (result.status == 200) {
          const existingData = result.body;
          this.addProject.projectId = existingData.projectId;
          this.addProject.groupDivisionId = existingData.divisionId;
          this.addProject.projectName = existingData.projectName;
          this.addProject.active = existingData.active;
          this.isEditMode = true;
          this.ProjectForm.patchValue(this.addProject);
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
     if (this.ProjectForm.invalid) {
       return;
     }
     const formData = this.ProjectForm.value;
     this.jobapplyservice.AddProject(formData).subscribe(
       (result: any) => {
         if (result.status === 200) {
           Swal.fire({
             text: 'Project saved successfully!',
             icon: 'success',
             confirmButtonText: 'OK'
           }).then((result: { isConfirmed: any; }) => {
             if (result.isConfirmed) {
               if (this.isEditMode == true)
                 this.router.navigate(['/admin/project-list']);
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
