import { Routes } from '@angular/router';
import { AddVacanciesComponent } from './Pages/admin/add-vacancies/add-vacancies.component';
import { AdminDashboardComponent } from './Pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './Pages/admin/admin.component';
import { ApplicantListComponent } from './Pages/admin/applicant-list/applicant-list.component';
import { DashboardComponent } from './Pages/home/dashboard/dashboard.component';
import { HomeComponent } from './Pages/home/home.component';
import { JobApplicationComponent } from './Pages/home/job-application/job-application.component';
import { JobApplyComponent } from './Pages/home/job-apply/job-apply.component';
import { SendOTPComponent } from './Pages/home/send-otp/send-otp.component';
import { TermsComponent } from './Pages/home/terms/terms.component';
import { VerifyOTPComponent } from './Pages/home/verify-otp/verify-otp.component';
import { LoginComponent } from './Pages/login/login.component';
import { AuthGuardService } from './Services/auth-guard/auth-guard.service';
import { VerifyEmployeeComponent } from './Pages/admin/verify-employee/verify-employee.component';
import { JobApplicationITOilComponent } from './Pages/home/job-application-itoil/job-application-itoil.component';
import { FinalJobApplicationDetailsComponent } from './Pages/home/final-job-application-details/final-job-application-details.component';


export const routes: Routes = [
  {
    path: '', component: HomeComponent, children: [
      { path: '', component: DashboardComponent },
      { path: 'JobApply', component: JobApplyComponent },
      { path: 'SendOTP', component: SendOTPComponent },
      { path: 'verifyotp', component: VerifyOTPComponent },
      { path: 'T&C', component: TermsComponent },
      { path: 'JobApplication', component: JobApplicationComponent },
      { path: 'JobApplicationIO', component: JobApplicationITOilComponent },
      { path: 'final-job-application-details', component: FinalJobApplicationDetailsComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin', component: AdminComponent, children: [
      { path: '', component: AdminDashboardComponent, canActivate: [AuthGuardService] },
      { path: 'applicant-list', component: ApplicantListComponent, canActivate: [AuthGuardService] },
      { path: 'add-vacancy', component: AddVacanciesComponent, canActivate: [AuthGuardService] },
      { path: 'verify-employee', component: VerifyEmployeeComponent, canActivate: [AuthGuardService] },
    ]
  }
];


