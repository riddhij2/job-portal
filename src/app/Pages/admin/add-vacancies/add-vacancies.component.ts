import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
// import { BsDatepickerModule, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../../Services/Dashboard/dashboard.service';

@Component({
  selector: 'app-add-vacancies',
  standalone: true,
  imports: [NgFor, CommonModule, NgIf, RouterModule, RouterLink, FormsModule],
  templateUrl: './add-vacancies.component.html',
  styleUrl: './add-vacancies.component.css'
})
export class AddVacanciesComponent {
  fromDate: Date| undefined;
  toDate: Date| undefined
  constructor(private router: Router, private dashboardservice: DashboardService) {
    debugger;
  }
}
