import { CommonModule, DatePipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterLink } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { District, LanguageLabels, State } from '../../../Models/JobApplication/language-labels';
import { Experience, JobApplicationFormRequest, JobApplicationFormRequestIO, Resume } from '../../../Models/JobApplication/job-application-form-request';
import { JobApplicationService } from '../../../Services/JobApplication/job-application.service';
import { switchMap } from 'rxjs';

declare var Swal: any;
declare var $: any;


@Component({
  selector: 'app-job-application-itoil',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf, FormsModule, NgFor, TitleCasePipe, DatePipe, CommonModule, MatDatepickerModule, MatInputModule, MatNativeDateModule],
  templateUrl: './job-application-itoil.component.html',
  styleUrl: './job-application-itoil.component.css',
  providers: [DatePipe, MatDatepickerModule]
})
export class JobApplicationITOilComponent {
  jobApplicationForm: FormGroup = new FormGroup({});
  position: string = '';
  labels = new LanguageLabels();
  states: State[] = [];
  districtsForState: District[] = [];
  districtsForCorrespondenceState: District[] = [];
  language = "";
  MobileNo = '';
  applicationData: JobApplicationFormRequestIO = new JobApplicationFormRequestIO();
  resumeModel = new Resume;
  currentStep: number = 1;

  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2020, 0, 1);

  constructor(private fb: FormBuilder, private router: Router, private jobappservice: JobApplicationService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.MobileNo = JSON.parse(sessionStorage.getItem('MobileNo') || '')
    this.position = JSON.parse(sessionStorage.getItem('groupName') || '')
    const mobileNo = sessionStorage.getItem('MobileNo');
    this.MobileNo = mobileNo ? JSON.parse(mobileNo) : '';
    this.jobApplicationForm = this.fb.group({
      name: ['', Validators.required],
      KeySkills: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      mobileNo: [{ value: this.MobileNo, disabled: true }, Validators.required],
      permanentAddress: ['', Validators.required],
      stateId: ['', Validators.required],
      districtId: [{ value: '' }, Validators.required],
      PinCode: ['', Validators.required],
      resumeFile: ['', Validators.required],
      experiences: this.fb.array([this.createExperienceTab()])
    });
    this.GetState();
    this.jobApplicationForm.get('stateId')?.setValue(3);
    this.GetCity(3, 'permanent');
    this.jobApplicationForm.get('districtId')?.setValue(0);
    this.changeLabels('en');
  }
  onStateChange(event: any, type: string): void {
    const selectedStateId = +event.target.value;
    if (selectedStateId) {
      if (type === 'permanent') {
        this.jobApplicationForm.patchValue({
          permanentDistrict: ''
        });
        this.GetCity(selectedStateId, 'permanent');
        this.jobApplicationForm.get('districtId')?.enable();
      } else if (type === 'correspondence') {
        this.jobApplicationForm.patchValue({
          correspondenceDistrict: ''
        });
      }
    } else {
      if (type === 'permanent') {
        this.districtsForState = [];
      } else if (type === 'correspondence') {
        this.districtsForCorrespondenceState = [];
      }
    }
  }
  get f() {

    return this.jobApplicationForm.controls;
  }

  onSubmit(): void {
    debugger;
    if (this.jobApplicationForm.valid) {
      this.jobApplicationForm.get('mobileNo')?.enable();
      this.applicationData.name = this.jobApplicationForm.controls['name'].value;
      const dateOfBirth = this.jobApplicationForm.controls['dateOfBirth'].value;
      const [day, month, year] = dateOfBirth.split('/');
      const formattedDate = new Date(`${year}-${month}-${day}`);
      this.applicationData.dateOfBirth = this.datePipe.transform(formattedDate, 'dd/MM/yyyy') || '';
      this.applicationData.gender = this.jobApplicationForm.controls['gender'].value;
      this.applicationData.maritalStatus = this.jobApplicationForm.controls['maritalStatus'].value;
      this.applicationData.emailAddress = this.jobApplicationForm.controls['emailAddress'].value;
      this.applicationData.mobileNo = this.jobApplicationForm.controls['mobileNo'].value;
      this.applicationData.permanentAddress = this.jobApplicationForm.controls['permanentAddress'].value;
      this.applicationData.stateId = this.jobApplicationForm.controls['stateId'].value;
      this.applicationData.districtId = this.jobApplicationForm.controls['districtId'].value;
      this.applicationData.PinCode = this.jobApplicationForm.controls['PinCode'].value;
      this.applicationData.KeySkills = this.jobApplicationForm.controls['KeySkills'].value;
      const experiences: Experience[] = this.jobApplicationForm.value.experiences.map((exp: any) => ({
        companyName: exp.company,
        joiningDate: exp.fromDate,
        relievingDate: exp.toDate,
        hodName: exp.hodName,
        mobileNo: exp.hodmobileNo,
        emailAddress: exp.hodemailAddress,
        position: exp.position
      }));
      this.applicationData.ExpDtl = experiences;
      this.resumeModel.mobileNo = this.applicationData.mobileNo;
      this.jobappservice.submitApplicationIO(this.applicationData).pipe(
        switchMap((result: any) => {
          if (result.status == 200) {
            return this.jobappservice.SubmitResume(this.resumeModel);
          } else {
            throw new Error('Failed to submit application');
          }
        })
      ).subscribe(
        (response: any) => {
          Swal.fire({
            title: 'Success!',
            text: 'Your application has been submitted successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['']);
          });
        },
        (error: any) => {
          Swal.fire({
            text: error.error?.title || 'An error occurred',
            icon: 'error'
          });
        }
      );
    }
  }

  goToNext(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  goToPrevious(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }


  onFileChange(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['pdf'];
      const filename = file.name;
      const extension = filename.split('.').pop()?.toLowerCase();
      if (extension && !allowedTypes.includes(extension)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid file type!',
          text: 'Please upload a PDF file.',
          confirmButtonText: 'OK'
        });
        input.value = '';
      }
      else {

        this.resumeModel.resumeFile = file;

      }
    }
  }
  onLanguageChange(): void {
    this.changeLabels(this.language ? 'hn' : 'en');
  }
  changeLabels(language: string): void {
    if (language == 'en') {
      this.labels = {
        labelDivision: "Sub Division",
        labelName: "Name",
        labelFatherName: "Father's Name",
        labelDOB: "Date of Birth",
        labelGender: "Gender",
        labelMaritalStatus: "Marital Status",
        labelEmail: "Email Address",
        labelMobileNo: "Mobile No",
        labelPermanentAddress: "Permanent Address",
        labelPincode: "Pincode",
        labelState: "State",
        labelDistrict: "District",
        labelCorrespondenceAddress: "Correspondence Address",
        labelCPinCode: "Pincode",
        labelCStateId: "State",
        labelCDistrict: "District",
        labelcopyAddress: "Copy Permanent Address to Correspondence Address",
        labelFatherMobileNo: "Father's Mobile No",
        labelUANNo: "UAN Number",
        labelESINo: "ESI Number",
        labelPanNo: "PAN Number",
        labelBankName: "Bank Name",
        labelBankAccountNo: "Bank Account No",
        labelIFSCCode: "IFSC Code",
        labelAdharNo: "Aadhaar No",
        labelFacePhoto: "Upload Face Photo",
        labelResume: "Resume",
        labelBankStatement: "Upload Bank Statement / Passbook",
        labelQualification: "Qualification",
        labelPan: "Pan Card",
        labelAdhar: "Aadhar Card",
        labelMRID: "MRID",
        labelHodName: "HOD Name",
        labelHodEmail: "HOD Email Address",
        labelHodMobileNo: "HOD Mobile No",
        labelFromDate: "Starting Date",
        labelToDate: "Leaving Date",
        labelCompany: "Company Name",
        labelPosition: "Position",
        labelExperience: "Experience Details",
        labelKeySkills: "KeySkills",
      };
    } else if (language == 'hn') {
      this.labels = {
        labelDivision: "उप-विभाग",
        labelName: "नाम",
        labelFatherName: "पिता का नाम",
        labelDOB: "जन्म तिथि",
        labelGender: "लिंग",
        labelMaritalStatus: "वैवाहिक स्थिति",
        labelEmail: "ईमेल पता",
        labelMobileNo: "मोबाइल नंबर",
        labelPermanentAddress: "स्थायी पता",
        labelPincode: "पिनकोड",
        labelState: "राज्य",
        labelDistrict: "जिला",
        labelCorrespondenceAddress: "पत्राचार का पता",
        labelCPinCode: "पिनकोड",
        labelCStateId: "राज्य",
        labelCDistrict: "जिला",
        labelcopyAddress: "स्थायी पते को पत्राचार पते पर कॉपी करें",
        labelFatherMobileNo: "पिता का मोबाइल नंबर",
        labelUANNo: "UAN नंबर",
        labelESINo: "ESI नंबर",
        labelPanNo: "पैन नंबर",
        labelBankName: "बैंक का नाम",
        labelBankAccountNo: "बैंक खाता नंबर",
        labelIFSCCode: "IFSC कोड",
        labelAdharNo: "आधार नंबर",
        labelFacePhoto: "चेहरे का फोटो अपलोड करें",
        labelResume: "संक्षिप्त विवरण",
        labelBankStatement: "बैंक स्टेटमेंट/पासबुक अपलोड करें",
        labelQualification: "योग्यता",
        labelPan: "पैन कार्ड",
        labelAdhar: "आधार कार्ड",
        labelMRID: "MRID",
        labelHodName: "HOD नाम",
        labelHodEmail: "HOD ईमेल पता",
        labelHodMobileNo: "HOD मोबाइल नंबर",
        labelFromDate: "आरंभ तिथि",
        labelToDate: "छोड़ने की तारीख",
        labelCompany: "कंपनी नाम",
        labelPosition: "पद",
        labelExperience: "अनुभव विवरण",
        labelKeySkills: "प्रमुख कौशल",
      };
    }
  }
  GetState() {
    this.jobappservice.GetState(1).subscribe(
      (result: any) => {
        if (result != null) {
          this.states = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  GetCity(stateId: number, type: string) {
    this.jobappservice.GetCity(stateId).subscribe(
      (result: any) => {
        if (result != null) {
          if (type === 'permanent') {
            this.districtsForState = result.body;
          } else if (type === 'correspondence') {
            this.districtsForCorrespondenceState = result.body;
          }
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      }
    );
  }
  get experiences(): FormArray {
    return this.jobApplicationForm.get('experiences') as FormArray;
  }

  // Create a new experience tab
  createExperienceTab(): FormGroup {
    return this.fb.group({
      company: ['', Validators.required],
      position: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      hodName: [''],
      hodmobileNo: [''],
      hodemailAddress: ['']
    });
  }
  addTab(index: number): void {
    this.experiences.push(this.createExperienceTab());
    this.initializeDatepickers();
  }
  removeTab(index: number): void {
    if (this.experiences.length > 1) {
      this.experiences.removeAt(index);
      this.initializeDatepickers();
    }
  }
  saveExperience(index: number) {
    const experience = this.experiences.at(index).value;
    console.log('Saved experience:', experience);
  }

  ngAfterViewInit(): void {
    $('#datepicker').datepicker({
      format: 'dd/mm/yyyy',
      autoclose: true,
      todayHighlight: true,
    })
      .on('changeDate', (e: any) => {
        const selectedDate = e.format('dd/mm/yyyy');
        this.jobApplicationForm.patchValue({ dateOfBirth: selectedDate });
      });
    this.initializeDatepickers();
  }
  initializeDatepickers() {
    setTimeout(() => {
      this.experiences.controls.forEach((experience, index) => {
        $(`#datepicker1-${index}`).datepicker({
          format: 'dd/mm/yyyy',
          autoclose: true,
          todayHighlight: true,
        }).on('changeDate', (e: any) => {
          const selectedFromDate = e.format('yyyy-mm-dd');
          experience.patchValue({ fromDate: selectedFromDate });
        });

        $(`#datepicker2-${index}`).datepicker({
          format: 'dd/mm/yyyy',
          autoclose: true,
          todayHighlight: true,
        }).on('changeDate', (e: any) => {
          const selectedToDate = e.format('yyyy-mm-dd');
          experience.patchValue({ toDate: selectedToDate });
        });
      });
    }, 0);
  }
}
