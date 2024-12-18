import { CommonModule, DatePipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterLink } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { District, LanguageLabels, State } from '../../../Models/JobApplication/language-labels';
import { AddressDetail, BasicDetail, Experience, HealthDetail, JobApplicationFormRequest, JobApplicationFormRequestIO, Language, LanguageDetail, PassportDetail, Qualification, RemoveQualDetail, Resume, Skill, SkillDetail } from '../../../Models/JobApplication/job-application-form-request';
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
  addressForm: FormGroup = new FormGroup({});
  passportDetailsForm: FormGroup = new FormGroup({});
  healthDetailsForm: FormGroup = new FormGroup({});
  languageForm: FormGroup = new FormGroup({});
  QualificationForm: FormGroup = new FormGroup({});
  experienceDetailForm: FormGroup = new FormGroup({});
  itSkillForm: FormGroup = new FormGroup({});
  position: string = '';
  labels = new LanguageLabels();
  states: State[] = [];
  districtsForState: District[] = [];
  districtsForCorrespondenceState: District[] = [];
  language = "";
  MobileNo = '';
  applicationData: BasicDetail = new BasicDetail();
  skillDetail: SkillDetail = new SkillDetail();
  addressDetail: AddressDetail = new AddressDetail();
  healthDetail: HealthDetail = new HealthDetail();
  passportDetail: PassportDetail = new PassportDetail();
  languageDetail: LanguageDetail = new LanguageDetail();
  qualificationDetail: Qualification = new Qualification();
  removeDetail: RemoveQualDetail = new RemoveQualDetail();
  skill: Skill = new Skill();
  lg: Language = new Language();
  resumeModel = new Resume;
  currentStep: number = 7;

  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2020, 0, 1);
  ZoneId = 0;
  savedTabs: boolean[] = []; 

  constructor(private fb: FormBuilder, private router: Router, private jobappservice: JobApplicationService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.MobileNo = JSON.parse(sessionStorage.getItem('MobileNo') || '')
    this.ZoneId = Number(JSON.parse(sessionStorage.getItem('zoneId') || '0'));
    this.position = JSON.parse(sessionStorage.getItem('groupName') || '')
    const mobileNo = sessionStorage.getItem('MobileNo');
    this.MobileNo = mobileNo ? JSON.parse(mobileNo) : '';
    this.jobApplicationForm = this.fb.group({
      fName: ['', Validators.required],
      mName: [''],
      lName: ['', Validators.required],
      nationality: ['', Validators.required],
      fatherName: ['', Validators.required],
      fatherMobileNo: ['', Validators.required],
      vehicleType: ['No', Validators.required],
      drivingLicenseNo: [''],
      dateOfBirth: ['', Validators.required],
      gender: ['Male', Validators.required],
      maritalStatus: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      mobileNo: [{ value: this.MobileNo, disabled: true }, Validators.required],
      Photofile: ['', Validators.required],

    });
    this.addressForm = this.fb.group({
      permanentAddress: ['', Validators.required],
      stateId: ['', Validators.required],
      districtId: [{ value: '' }, Validators.required],
      pinCode: ['', Validators.required],
      correspondenceAddress: ['', Validators.required],
      cStateId: ['', Validators.required],
      cDistrictId: [{ value: '' }, Validators.required],
      cPinCode: ['', Validators.required],
      copyAddress: [false],
    });
    this.itSkillForm = this.fb.group({
      skills: this.fb.array([this.createSkillsTab()]),
    });
    this.passportDetailsForm = this.fb.group({
      passportNo: [''],
      dateOfIssue: [''],
      validUpto: [''],
      issuedBy: [''],
      passAddress: [''],
      pCityName: [''],
      emigrationChecReq: [''],
    });
    this.healthDetailsForm = this.fb.group({
      vision: ['No', Validators.required],
      diabetes: ['No', Validators.required],
      bloodPressure: ['No', Validators.required],
      heartAilments: ['No', Validators.required],
      anyOtherIllnes: ['', Validators.required],
      lastMajorIllness: ['', Validators.required],
      majoreIllnessDate: ['', Validators.required],
      bloodGroop: ['', Validators.required],
    });
    this.languageForm = this.fb.group({
      languages: this.fb.array([this.createLanguageTab()])
    });
    this.QualificationForm = this.fb.group({
      qualifications: this.fb.array([this.createQualificationTab()]),
    });
    this.savedTabs.push(false);

    this.experienceDetailForm = this.fb.group({
      experiences: this.fb.array([this.createExperienceTab()])
    });
    this.GetState();
    this.jobApplicationForm.get('stateId')?.setValue(3);
    this.GetCity(3, 'permanent');
    this.GetCity(3, 'correspondence');
    this.jobApplicationForm.get('districtId')?.setValue(0);
    this.jobApplicationForm.get('cDistrictId')?.setValue(0);
    this.changeLabels('en');
  }
  // onStateChange(event: any, type: string): void {
  //   const selectedStateId = +event.target.value;
  //   if (selectedStateId) {
  //     if (type === 'permanent') {
  //       this.jobApplicationForm.patchValue({
  //         permanentDistrict: ''
  //       });
  //       this.GetCity(selectedStateId, 'permanent');
  //       this.jobApplicationForm.get('districtId')?.enable();
  //     } else if (type === 'correspondence') {
  //       this.jobApplicationForm.patchValue({
  //         correspondenceDistrict: ''
  //       });
  //     }
  //   } else {
  //     if (type === 'permanent') {
  //       this.districtsForState = [];
  //     } else if (type === 'correspondence') {
  //       this.districtsForCorrespondenceState = [];
  //     }
  //   }
  // }
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
          cDistrictId: ''
        });
        this.GetCity(selectedStateId, 'correspondence');
        this.jobApplicationForm.get('cDistrictId')?.enable();
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
  onSubmitCurrentForm(): void {
    if (this.currentStep === 1 && this.jobApplicationForm.valid) {
      this.submitJobApplicationForm();
    } else if (this.currentStep === 2 && this.itSkillForm.valid) {
      this.submititSkillForm();
    } else if (this.currentStep === 3 && this.addressForm.valid) {
      this.submitaddressForm();
    } else if (this.currentStep === 4 && this.healthDetailsForm.valid) {
      this.submitHealthForm();
    } else if (this.currentStep === 5 && this.passportDetailsForm.valid) {
      this.submitpassportDetailsForm();
    } else if (this.currentStep === 6 && this.languageForm.valid) {
      this.submitlanguageForm();
      //} else {
      //  Object.keys(this.BankDetailsForm.controls).forEach(key => {
      //    const control = this.BankDetailsForm.get(key);
      //    if (control && !control.valid) {
      //      console.error(`Field ${key} is invalid.`, control.errors);
      //    }
      //  });
      //Swal.fire('Error', 'Please fill out all required fields.', 'error');
    }
  }
  submitJobApplicationForm(): void {
    this.jobApplicationForm.get('mobileNo')?.enable();
    this.applicationData.fName = this.jobApplicationForm.controls['fName'].value;
    this.applicationData.mName = this.jobApplicationForm.controls['mName'].value;
    this.applicationData.lName = this.jobApplicationForm.controls['lName'].value;
    this.applicationData.fatherName = this.jobApplicationForm.controls['fatherName'].value;
    this.applicationData.fatherMobileNo = this.jobApplicationForm.controls['fatherMobileNo'].value;
    this.applicationData.nationality = this.jobApplicationForm.controls['nationality'].value;
    this.applicationData.drivingLicenseNo = this.jobApplicationForm.controls['drivingLicenseNo'].value;
    this.applicationData.vehicleType = this.jobApplicationForm.controls['vehicleType'].value;
    this.applicationData.dateOfBirth = this.jobApplicationForm.controls['dateOfBirth'].value;
    this.applicationData.gender = this.jobApplicationForm.controls['gender'].value;
    this.applicationData.maritalStatus = this.jobApplicationForm.controls['maritalStatus'].value;
    this.applicationData.emailAddress = this.jobApplicationForm.controls['emailAddress'].value;
    this.applicationData.mobileNo = this.jobApplicationForm.controls['mobileNo'].value;
    this.jobappservice.AddEmployeeFirst(this.applicationData).subscribe(
      (result: any) => {
        if (result.status == 200) {
          Swal.fire('Success!', 'Basic Details submitted successfully.', 'success').then(() => {
            if (this.currentStep < 8) {
              this.currentStep++;
            }
          });
        }
      },
      (error: any) => {
        Swal.fire('Error', error.error.title, 'error');
      }
    );
  }
  submititSkillForm(): void {
    this.skillDetail.mobileNo = this.MobileNo;
    this.skillDetail.skillDtl = this.skills.value.map((skill: any) => ({
      skillName: skill.skillName,
      softwareVerson: skill.softwareVerson,
      lastUsed: skill.lastUsed,
      experienceYear: skill.experienceYear,
      experienceMonth: skill.experienceMonth,
    }));
    this.jobappservice.AddSecondScreen(this.skillDetail).subscribe(
      (result: any) => {
        if (result.status == 200) {
          Swal.fire('Success!', 'Skills submitted successfully.', 'success').then(() => {
            if (this.currentStep < 8) {
              this.currentStep++;
            }
          });
        }
      },
      (error: any) => {
        Swal.fire('Error', error.error.title, 'error');
      }
    );
  }
  submitaddressForm(): void {
    Object.assign(this.addressDetail, this.addressForm.value);
    this.addressDetail.mobileNo = this.MobileNo;
    this.jobappservice.AddThirdScreen(this.addressDetail).subscribe(
      (result: any) => {
        if (result.status == 200) {
          Swal.fire('Success!', 'Address details submitted successfully.', 'success').then(() => {
            if (this.currentStep < 8) {
              this.currentStep++;
            }
          });
        }
      },
      (error: any) => {
        Swal.fire('Error', error.error.title, 'error');
      }
    );
  }
  submitHealthForm(): void {
    Object.assign(this.healthDetail, this.healthDetailsForm.value);
    this.healthDetail.mobileNo = this.MobileNo;
    this.jobappservice.AddFourthScreen(this.healthDetail).subscribe(
      (result: any) => {
        if (result.status == 200) {
          Swal.fire('Success!', 'Health details submitted successfully.', 'success').then(() => {
            if (this.currentStep < 8) {
              this.currentStep++;
            }
          });
        }
      },
      (error: any) => {
        Swal.fire('Error', error.error.title, 'error');
      }
    );
  }
  submitpassportDetailsForm(): void {
    const isFormFilled = Object.values(this.passportDetailsForm.value).some(
      value => value && String(value).trim() !== ''
    );
    if (isFormFilled) {
      Object.assign(this.passportDetail, this.passportDetailsForm.value);
      this.passportDetail.mobileNo = this.MobileNo;
      this.jobappservice.AddFifthScreen(this.passportDetail).subscribe(
        (result: any) => {
          if (result.status == 200) {
            Swal.fire('Success!', 'Passport details submitted successfully.', 'success').then(() => {
              if (this.currentStep < 9) {
                this.currentStep++;
              }
            });
          }
        },
        (error: any) => {
          Swal.fire('Error', error.error.title, 'error');
        }
      );
    } else {
      Swal.fire('Info', 'No passport details were entered, skipping submission.', 'info').then(() => {
        if (this.currentStep < 9) {
          this.currentStep++;
        }
      });
    }
  }

  submitlanguageForm(): void {
    this.languageDetail.mobileNo = this.MobileNo;
    this.languageDetail.lanDtl = this.languages.value.map((lang: any) => ({
      languageName: lang.languageName,
      speek: lang.speek == true ? 1 : 0,
      understand: lang.understand == true ? 1 : 0,
      read: lang.read == true ? 1 : 0,
      write: lang.write == true ? 1 : 0,
    }));
    this.jobappservice.AddSixScreen(this.languageDetail).subscribe(
      (result: any) => {
        if (result.status == 200) {
          Swal.fire('Success!', 'Languages submitted successfully.', 'success').then(() => {
            if (this.currentStep < 8) {
              this.currentStep++;
            }
          });
        }
      },
      (error: any) => {
        Swal.fire('Error', error.error.title, 'error');
      }
    );
  }

  submitQualificationTab(): void {
    if (this.currentStep === 7) {
      // Check if at least one tab is saved
      const isAnyTabSaved = this.savedTabs.some((isSaved) => isSaved);
  
      if (!isAnyTabSaved) {
        Swal.fire('Error', 'Please fill and save at least one qualification tab before proceeding.', 'error');
        return;
      }
  
      // Check if all tabs are filled and saved
      const areAllTabsSaved = this.savedTabs.every((isSaved) => isSaved);
  
      if (areAllTabsSaved) {
        Swal.fire('Success', 'All qualifications have been saved and submitted.', 'success');
      }
    }
  
    // Proceed to the next step if conditions are met
    if (this.currentStep < 8) {
      this.currentStep++;
    }
  }
  

 

  goToNext(): void {
    if (this.currentStep < 8) {
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
            //this.applicationData.adharFile = file;
            break;
          case 'panFile':
            //this.applicationData.panFile = file;
            break;
          case 'qualificationFile':
            //this.applicationData.qualificationFile = file;
            break;
          case 'bankStatementFile':
            //this.applicationData.bankStatementFile = file;
            break;
          case 'resumeFile':
            this.resumeModel.resumeFile = file;
            break;
          case 'Photofile':
            this.applicationData.Photofile = file;
            break;
          case 'imageFile':
            this.qualificationDetail.imageFile = file;
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
        labelName: "Full Name",
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
        labelExperienceDetails: "Experience Details",
        labelKeySkills: "Skill / software name",
        labelPersonal: "Employee Personal Details",
        labelPassport: "Passport Details",
        labelPassportNo: "Passport Number",
        labelIssuedDate: "Issued Date",
        labelValidUpto: "Valid Upto",
        labelEmigration: "Emigration Check",
        labelHealth: "Health Details",
        labelVision: "Vision",
        labelDiabetes: "Diabetes",
        labelBloodPressure: "Blood Press.(High/Low)",
        labelHeartAliments: "Heart Aliments",
        labelOtherIllness: "Other Illness",
        labelLastMajorIllness: "Last Major Illness",
        labelLastMajorIllnessDate: "Last Major Illness Date",
        labelBloodGroup: "Blood Group",
        labelLanguageDetails: "Language Details",
        labelLanguage: "Language",
        labelUnderstand: "Understand",
        labelWrite: "Write",
        labelSpeak: "Speak",
        labelRead: "Read",
        labelActions: "Actions",
        labelAddress: "Address Details",
        labelQualificatonDetails: "Qualification Details",
        labelSubject: "Specialization",
        labelPassingYear: "Passing Year",
        labelUploadImage: "Upload Image",
        labelPrevious: "Previous",
        labelSubmit: "Submit",
        labelNext: "Next",
        labelDegree: "Degree",
        labelITSkill: "Skills",
        labelIssuedBy: "Issued By",
        labelCity: "City",
        labelNationality: "Nationality",
        labelVehicalType: "Vehical Type",
        labelDrivingLicenceNo: "Driving Licence No",
        labelPassportAddress: "Passport Address",
        labelSoftwareVersion: "Software version",
        labelLastUsed: "Last used",
        labelExperience: "Experience"


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
        labelExperienceDetails: "अनुभव विवरण",
        labelKeySkills: "प्रमुख कौशल",
        labelPersonal: "कर्मचारी व्यक्तिगत विवरण",
        labelPassport: "पासपोर्ट विवरण",
        labelPassportNo: "पासपोर्ट नंबर",
        labelIssuedDate: "जारी तिथि",
        labelValidUpto: "वैधता तिथि",
        labelEmigration: "प्रवासन जांच",
        labelHealth: "स्वास्थ्य विवरण",
        labelVision: "दृष्टि",
        labelDiabetes: "मधुमेह",
        labelBloodPressure: "रक्तचाप (उच्च/निम्न)",
        labelHeartAliments: "हृदय रोग",
        labelOtherIllness: "अन्य बीमारियां",
        labelLastMajorIllness: "पिछली बड़ी बीमारी",
        labelLastMajorIllnessDate: "पिछली बड़ी बीमारी की तिथि",
        labelBloodGroup: "रक्त समूह",
        labelLanguageDetails: "भाषा विवरण",
        labelLanguage: "भाषा",
        labelUnderstand: "समझना",
        labelWrite: "लिखना",
        labelSpeak: "बोलना",
        labelRead: "पढ़ना",
        labelActions: "क्रियाएं",
        labelAddress: "पता विवरण",
        labelQualificatonDetails: "योग्यता विवरण",
        labelSubject: "विशेषज्ञता",
        labelPassingYear: "उत्तीर्ण वर्ष",
        labelUploadImage: "छवि अपलोड करें",
        labelPrevious: "पिछला",
        labelSubmit: "जमा करें",
        labelNext: "अगला",
        labelDegree: "डिग्री",
        labelITSkill: "कौशल",
        labelIssuedBy: "जारी करने वाला",
        labelCity: "शहर",
        labelNationality: "राष्ट्रीयता",
        labelVehicalType: "वाहन प्रकार",
        labelDrivingLicenceNo: "ड्राइविंग लाइसेंस नंबर",
        labelPassportAddress: "पता",
        labelSoftwareVersion: "सॉफ़्टवेयर संस्करण",
        labelLastUsed: "अंतिम उपयोग",
        labelExperience: "अनुभव"

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

  get skills(): FormArray {
    return this.itSkillForm.get('skills') as FormArray;
  }

  createSkillsTab(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      softwareVerson: ['', Validators.required],
      lastUsed: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      experienceYear: ['', [Validators.required, Validators.min(0)]],
      experienceMonth: ['', [Validators.required, Validators.min(0), Validators.max(11)]],
    });
  }
  addSkillsTab(index: number): void {
    this.skills.push(this.createSkillsTab());
  }
  removeSkillsTab(index: number): void {
    if (this.skills.length > 1) {
      this.skills.removeAt(index);
    }
  }


  get qualifications(): FormArray {
    return this.QualificationForm.get('qualifications') as FormArray;
  }

  createQualificationTab(): FormGroup {
    return this.fb.group({
      OrderNo: ['', Validators.required],
      DegreeName: ['', Validators.required],
      Specialization: ['', Validators.required],
      PassingYear: ['', Validators.required, Validators.pattern(/^\d{4}-\d{4}$/)],
      imageFile: ['', Validators.required],
    });
  }
  addQualicationTab(index: number): void {
    this.qualifications.push(this.createQualificationTab());
    this.savedTabs.push(false);
  }
  deleteQualicationTab(index: number): void {
    if (this.qualifications.length > 1) {
      this.qualifications.removeAt(index);
      // this.savedTabs.splice(index, 1);
    }
  }

  removeQualicationTab(index: number): void {
  // if (this.qualifications.length > 1) {
    const tabData = this.qualifications.at(index)?.value;
    const orderNo = parseInt(tabData?.OrderNo, 10);
    
    const removeDetail: RemoveQualDetail = {
      mobileNo: this.MobileNo,
      orderNo: isNaN(orderNo) ? 0 : orderNo
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this qualification?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.jobappservice.DeleteSevenScreen(removeDetail).subscribe(
          (response: any) => {
            if (response.status === 200) {
              Swal.fire('Deleted!', 'Qualification deleted successfully.', 'success');
              this.qualifications.removeAt(index);
              this.savedTabs.splice(index, 1);
              this.addQualicationTab(index+1);
            } else {
              Swal.fire('Error', 'Failed to delete qualification.', 'error');
            }
          },
          (error: any) => {
            Swal.fire('Error', error.error.title || 'Failed to delete qualification.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your qualification is safe!', 'info');
      }
    });

    // this.jobappservice.DeleteSevenScreen(removeDetail).subscribe(
    //   (result: any) => {
    //     if (result.status === 200) {
    //       Swal.fire('Success!', 'Qualification deleted successfully.', 'success');
    //       // Remove the tab and its saved state
          
    //       this.qualifications.removeAt(index);
    //       this.savedTabs.splice(index, 1);
    //     } else {
    //       Swal.fire('Error', 'Failed to delete qualification.', 'error');
    //     }
    //   },
    //   (error: any) => {
    //     Swal.fire('Error', error.error.title, 'error');
    //   }
    // );
  // }
}

  saveQualification(index: number): void {
    this.savedTabs[index] = true;
    if (index < 0 || index >= this.qualifications.length) {
      console.error('Invalid index:', index);
      Swal.fire('Error', 'Invalid tab index.', 'error');
      return;
    }
  
    const tabData = this.qualifications.at(index)?.value;
    console.log('Tab Data:', tabData);
  
    if (!tabData) {
      Swal.fire('Error', 'Tab data is missing.', 'error');
      return;
    }
    const orderNo = parseInt(tabData.OrderNo, 10);
    // Proceed with the qualification details
    this.qualificationDetail.MobileNo = this.MobileNo;
    this.qualificationDetail.OrderNo = isNaN(orderNo) ? 0 : orderNo;
    this.qualificationDetail.DegreeName = tabData.DegreeName || this.QualificationForm.controls['DegreeName'].value;
    this.qualificationDetail.Specialization = tabData.Specialization || this.QualificationForm.controls['Specialization'].value;
    this.qualificationDetail.PassingYear = tabData.PassingYear || this.QualificationForm.controls['PassingYear'].value;
  
    this.jobappservice.AddSevenScreen(this.qualificationDetail).subscribe(
      (result: any) => {
        if (result.status === 200) {
          Swal.fire('Success!', 'Qualification submitted successfully.', 'success')
          // .then(() => {
          //   if (this.currentStep < 8) {
          //     this.currentStep++;
          //   }
          // });
        }
      },
      (error: any) => {
        Swal.fire('Error', error.error.title, 'error');
      }
    );
  }
  
  get languages(): FormArray {
    return this.languageForm.get('languages') as FormArray;
  }

  createLanguageTab(): FormGroup {
    return this.fb.group({
      languageName: ['', Validators.required],
      understand: [false],
      read: [false],
      write: [false],
      speek: [false]
    });
  }
  addlanguageTab(index: number): void {
    this.languages.push(this.createLanguageTab());
  }
  removelanguageTab(index: number): void {
    if (this.languages.length > 1) {
      this.languages.removeAt(index);
    }
  }

  get experiences(): FormArray {
    return this.experienceDetailForm.get('experiences') as FormArray;
  }

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
    // this.initializeDatepickers();
  }
  removeTab(index: number): void {
    if (this.experiences.length > 1) {
      this.experiences.removeAt(index);
      // this.initializeDatepickers();
    }
  }
  saveExperience(index: number) {
    const experience = this.experiences.at(index).value;
    console.log('Saved experience:', experience);
  }

  ngAfterViewInit(): void {
    //$('#datepicker').datepicker({
    //  format: 'dd/mm/yyyy',
    //  autoclose: true,
    //  todayHighlight: true,
    //})
    //  .on('changeDate', (e: any) => {
    //    const selectedDate = e.format('dd/mm/yyyy');
    //    this.jobApplicationForm.patchValue({ dateOfBirth: selectedDate });
    //  });
    // Use a timeout to ensure the DOM is ready
    
    // this.initializeDatepickers();
  }
  // Add AfterViewChecked to ensure datepicker initializes properly after view has been rendered
  ngAfterViewChecked(): void {
    this.initializeDatepicker('#majoreIllnessDate', this.healthDetailsForm, 'majoreIllnessDate');
    this.initializeDatepicker('#dateOfIssue', this.passportDetailsForm, 'dateOfIssue');
    this.initializeDatepicker('#validUpto', this.passportDetailsForm, 'validUpto');
    this.initializeDatepicker('#datepicker1', this.experienceDetailForm, 'datepicker1');
    this.initializeDatepicker('#datepicker2', this.experienceDetailForm, 'datepicker2');
    this.initializeDatepicker('#datepicker', this.jobApplicationForm, 'datepicker');
    this.initializeDatepicker('#lastUsed', this.healthDetailsForm, 'lastUsed');
  }

  private initializeDatepicker(elementId: string, formGroup: any, controlName: string): void {
    const element = $(elementId);
    if (element.length > 0) {
      console.log(`${controlName} initialized`);
      element.datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        todayHighlight: true,
      }).on('changeDate', (e: any) => {
        const selectedDate = e.format('dd/mm/yyyy');
        formGroup.patchValue({ [controlName]: selectedDate });
      });
    }
  }
  
  onCopyAddressChange(event: any): void {
    if (event.target.checked) {
      this.addressForm.patchValue({
        correspondenceAddress: this.addressForm.get('permanentAddress')?.value,
        cPinCode: this.addressForm.get('pinCode')?.value,
        cStateId: this.addressForm.get('stateId')?.value,
        cDistrictId: this.addressForm.get('districtId')?.value,
      });
      const permanentStateId = this.addressForm.get('stateId')?.value;
      if (permanentStateId) {
        this.GetCity(permanentStateId, 'correspondence');
      }
    } else {
      this.addressForm.patchValue({
        correspondenceAddress: '',
        cPinCode: '',
        cStateId: '',
        cDistrictId: '',
      });
      this.districtsForCorrespondenceState = [];
    }
  }
}
