import { CommonModule, DatePipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterLink } from '@angular/router';
import { Bank, District, LanguageLabels, State, SubDivision } from '../../../Models/JobApplication/language-labels';
import { JobApplicationService } from '../../../Services/JobApplication/job-application.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { JobApplicationFormRequest } from '../../../Models/JobApplication/job-application-form-request';
declare var Swal: any;
declare var $: any;


@Component({
  selector: 'app-job-application',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf, FormsModule, NgFor, TitleCasePipe, DatePipe, CommonModule, MatDatepickerModule, MatInputModule, MatNativeDateModule],
  templateUrl: './job-application.component.html',
  styleUrl: './job-application.component.css',
  providers: [DatePipe, MatDatepickerModule]
})
export class JobApplicationComponent {
  jobApplicationForm: FormGroup = new FormGroup({});
  position: string = '';
  labels = new LanguageLabels();
  states: State[] = [];
  districtsForState: District[] = [];
  districtsForCorrespondenceState: District[] = [];
  language = "";
  ZoneId = 0;
  MobileNo = '';
  banks: Bank[] = [];
  subDivisions: SubDivision[] = [];
  applicationData: JobApplicationFormRequest = new JobApplicationFormRequest();
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2020, 0, 1);
  currentStep: number = 1;

  constructor(private fb: FormBuilder, private router: Router, private jobappservice: JobApplicationService, private datePipe: DatePipe) { }

  ngOnInit(): void {

    this.MobileNo = JSON.parse(sessionStorage.getItem('MobileNo') || '')
    this.ZoneId = Number(JSON.parse(sessionStorage.getItem('zoneId') || '0'));
    this.position = JSON.parse(sessionStorage.getItem('groupName') || '')
    this.jobApplicationForm = this.fb.group({
      revenueId: ['', Validators.required],
      name: ['', Validators.required],
      fatherName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      mobileNo: [{ value: this.MobileNo, disabled: true }, Validators.required],
      permanentAddress: ['', Validators.required],
      stateId: ['', Validators.required],
      districtId: [{ value: ''}, Validators.required],
      PinCode: ['', Validators.required, Validators.pattern(/^\d{6}$/)],
      correspondenceAddress: ['', Validators.required],
      correspondenceState: ['', Validators.required],
      correspondenceDistrict: [{ value: '' }, Validators.required],
      correspondencePincode: ['', Validators.required, Validators.pattern(/^\d{6}$/)],
      copyAddress: [false],
      fatherMobileNo: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      uanNo: ['', [Validators.pattern('[0-9]{12}')]],
      esiNo: [''],
      panNo: ['', Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)],
      bankName: ['', Validators.required],
      bankAccountNo: ['', Validators.required, Validators.pattern(/^\d{9,18}$/)],
      ifscCode: ['', [Validators.required, Validators.pattern('[A-Za-z]{4}[0-9]{7}')]],
      adharNo: ['', [Validators.required, Validators.pattern('[0-9]{12}')]],
      MRID: [''],
      adharFile: ['', Validators.required],
      panFile: ['', Validators.required],
      qualificationFile: ['', Validators.required],
      bankStatementFile: ['', Validators.required],
      resumeFile: [''],
      passportPhoto: ['', Validators.required],
      termsCheck: [false, Validators.requiredTrue]
    });
    this.GetSubDivision(this.ZoneId);
    this.GetBankName();
    this.GetState();
    this.jobApplicationForm.get('stateId')?.setValue(3);
    this.jobApplicationForm.get('correspondenceState')?.setValue(3);
    this.GetCity(3, 'permanent');
    this.GetCity(3, 'correspondence');
    this.jobApplicationForm.get('districtId')?.setValue(0);
    this.jobApplicationForm.get('correspondenceDistrict')?.setValue(0);
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
        this.GetCity(selectedStateId, 'correspondence');
        this.jobApplicationForm.get('correspondenceDistrict')?.enable();
      }
    } else {
      if (type === 'permanent') {
        //this.jobApplicationForm.get('districtId')?.disable();
        this.districtsForState = [];
      } else if (type === 'correspondence') {
        //this.jobApplicationForm.get('correspondenceDistrict')?.disable();
        this.districtsForCorrespondenceState = [];
      }
    }
  }
  get f() {
    return this.jobApplicationForm.controls;
  }

  onSubmit(): void {
    if (this.jobApplicationForm.valid) {
      this.jobApplicationForm.get('mobileNo')?.enable();
      this.jobApplicationForm.get('correspondenceDistrict')?.enable();
      this.applicationData.revenueId = this.jobApplicationForm.controls['revenueId'].value;
      this.applicationData.name = this.jobApplicationForm.controls['name'].value;
      this.applicationData.fatherName = this.jobApplicationForm.controls['fatherName'].value;
      const dateOfBirth = this.jobApplicationForm.controls['dateOfBirth'].value;
      this.applicationData.dateOfBirth = this.datePipe.transform(dateOfBirth, 'dd/MM/yyyy') || '';
      this.applicationData.gender = this.jobApplicationForm.controls['gender'].value;
      this.applicationData.maritalStatus = this.jobApplicationForm.controls['maritalStatus'].value;
      this.applicationData.emailAddress = this.jobApplicationForm.controls['emailAddress'].value;
      this.applicationData.mobileNo = this.jobApplicationForm.controls['mobileNo'].value;
      this.applicationData.permanentAddress = this.jobApplicationForm.controls['permanentAddress'].value;
      this.applicationData.stateId = this.jobApplicationForm.controls['stateId'].value;
      this.applicationData.districtId = this.jobApplicationForm.controls['districtId'].value;
      this.applicationData.PinCode = this.jobApplicationForm.controls['PinCode'].value;
      this.applicationData.correspondenceAddress = this.jobApplicationForm.controls['correspondenceAddress'].value;
      this.applicationData.correspondenceState = this.jobApplicationForm.controls['correspondenceState'].value;
      this.applicationData.correspondenceDistrict = this.jobApplicationForm.controls['correspondenceDistrict'].value;
      this.applicationData.correspondencePincode = this.jobApplicationForm.controls['correspondencePincode'].value;
      this.applicationData.fatherMobileNo = this.jobApplicationForm.controls['fatherMobileNo'].value;
      this.applicationData.uanNo = this.jobApplicationForm.controls['uanNo'].value;
      this.applicationData.esiNo = this.jobApplicationForm.controls['esiNo'].value;
      this.applicationData.panNo = this.jobApplicationForm.controls['panNo'].value;
      this.applicationData.bankName = this.jobApplicationForm.controls['bankName'].value;
      this.applicationData.bankAccountNo = this.jobApplicationForm.controls['bankAccountNo'].value;
      this.applicationData.ifscCode = this.jobApplicationForm.controls['ifscCode'].value;
      this.applicationData.adharNo = this.jobApplicationForm.controls['adharNo'].value;
      this.applicationData.MRID = this.jobApplicationForm.controls['MRID'].value;
      this.jobappservice.submitApplication(this.applicationData).subscribe(
        (result: any) => {
          if (result.status == 200) {
            Swal.fire({
              title: 'Success!',
              text: 'Your application has been submitted successfully.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['']);
            });
          }
        },
        (error: any) => {
          Swal.fire({
            text: error.error.title,
            icon: "error"
          });
        });
    }
  }

  onCopyAddressChange(event: any): void {
    if (event.target.checked) {
      this.jobApplicationForm.patchValue({
        correspondenceAddress: this.jobApplicationForm.get('permanentAddress')?.value,
        correspondencePincode: this.jobApplicationForm.get('PinCode')?.value,
        correspondenceState: this.jobApplicationForm.get('stateId')?.value,
        correspondenceDistrict: this.jobApplicationForm.get('districtId')?.value,
      });
      const permanentStateId = this.jobApplicationForm.get('stateId')?.value;
      if (permanentStateId) {
        this.GetCity(permanentStateId, 'correspondence');
      }
    } else {
      this.jobApplicationForm.patchValue({
        correspondenceAddress: '',
        correspondencePincode: '',
        correspondenceState: '',
        correspondenceDistrict: '',
      });
      this.districtsForCorrespondenceState = [];
    }
  }
  submitTermsForm() {
    if (this.jobApplicationForm.get('termsCheck')?.value == true && this.jobApplicationForm.get('name')?.value && this.jobApplicationForm.get('fatherName')?.value)
      sessionStorage.setItem('name', this.jobApplicationForm.get('name')?.value);
    sessionStorage.setItem('fatherName', this.jobApplicationForm.get('fatherName')?.value);
    window.open('/T&C', '_blank');
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
      const allowedTypes = ['pdf', 'jpg', 'jpeg', 'png'];
      const filename = file.name;
      const extension = filename.split('.').pop()?.toLowerCase();
      if (extension && !allowedTypes.includes(extension)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid file type!',
          text: 'Please upload a PDF, JPG, JPEG, or PNG file.',
          confirmButtonText: 'OK'
        });
        input.value = '';
      }
      else {
        switch (fieldName) {
          case 'adharFile':
            this.applicationData.adharFile = file;
            break;
          case 'panFile':
            this.applicationData.panFile = file;
            break;
          case 'qualificationFile':
            this.applicationData.qualificationFile = file;
            break;
          case 'bankStatementFile':
            this.applicationData.bankStatementFile = file;
            break;
          case 'resumeFile':
            this.applicationData.resumeFile = file;
            break;
          case 'passportPhoto':
            this.applicationData.passportPhoto = file;
            break;
          default:
            console.error('Unknown field name:', fieldName);
        }
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
        labelMRID: "MRID"
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
  GetBankName() {
    this.jobappservice.GetBankName().subscribe(
      (result: any) => {
        if (result != null) {
          this.banks = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  GetSubDivision(zoneId: number) {
    this.jobappservice.GetSubDivision(zoneId).subscribe(
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
  }
}
