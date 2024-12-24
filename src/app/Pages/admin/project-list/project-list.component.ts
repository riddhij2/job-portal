import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AdminComponent } from '../admin.component';
import { FormBuilder, FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../include/pagination/pagination.component';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
import { ProjectList } from '../../../Models/JobPosting/job-posting';

declare var Swal: any;
@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [NgFor, CommonModule, NgIf, RouterModule, RouterLink, AdminComponent, FormsModule, PaginationComponent],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent {
  groupname: string = 'Masters';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  allProjectList: any;
  ProjectList: ProjectList[] = [];
  paginatedgroupProjectList: ProjectList[] = [];

  constructor(private fb: FormBuilder, private jobapplyservice: JobApplyService, private router: Router) {
    this.GetAllProjects();
  } 

  GetAllProjects() {
      this.jobapplyservice.GetAllProjects().subscribe(
        (result: any) => {
          if (result.status == 200) {
            this.allProjectList = result.body;
            this.totalItems = this.allProjectList.length;
            this.calculateTotalPages();
            this.updatePagination();
          }
        },
        (error: any) => {
          Swal.fire({
            text: error.message,
            icon: "error"
          });
        });
    }
  
    calculateTotalPages() {
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    }
  
    updatePagination() {
      const startIndex = (this.currentPage - 1) * Number(this.itemsPerPage);
      const endIndex = startIndex + Number(this.itemsPerPage);
      this.paginatedgroupProjectList = this.ProjectList.slice(startIndex, endIndex);
    }
  
    onPageChange(newPage: number) {
      this.currentPage = newPage;
      this.updatePagination();
    }
  
    onPagesizeChange(newPageSize: number) {
      this.itemsPerPage = newPageSize;
      this.currentPage = 1;
      this.calculateTotalPages();
      this.updatePagination();
    }
}
