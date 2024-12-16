export class JobApplicationFormRequest {
  'mrid': string;
  'FacebookId': string;
  'gender': string;
  'pinCode': string;
  'uanNo': string;
  'mobileNo': string;
  'maritalStatus': string;
  'permanentAddress': string;
  'fatherName': string;
  'panFile': File;
  'districtId': string;
  'resumeFile': File;
  'cStateId': string;
  'cPinCode': string;
  'LinkdinId': string;
  'name': string;
  'qualificationFile': File;
  'stateId': string;
  'cDistrictId': string;
  'InstagramId': string;
  'bankAccountNo': string;
  'adharFile': File;
  'TwiterId': string;
  'bankId': string;
  'revenueId': string;
  'adharNo': string;
  'emailAddress': string;
  'bankStatementFile': File;
  'dateOfBirth': string;
  'cAddress': string;
  'ifscCode': string;
  'passportPhoto': File;
  'panNo': string;
  'esiNo': string;
  'fatherMobileNo': string;
}

export class JobApplicationFormRequestIO {
  'FacebookId': string;
  'gender': string;
  'PinCode': string;
  'mobileNo': string;
  'maritalStatus': string;
  'permanentAddress': string;
  'districtId': string;
  'LinkdinId': string;
  'name': string;
  'stateId': string;
  'InstagramId': string;
  'TwiterId': string;
  'KeySkills': string;
  'emailAddress': string;
  'dateOfBirth': string;
  'ExpDtl': Experience[];
  'languageDtl': Language[];
  'qualificationDtl': Qualification[];
  'skillDtl': Skill[];
}

export class Experience {
  'companyName': string;
  'joiningDate': string;
  'relievingDate': string;
  'hodName': string;
  'mobileNo': string;
  'emailAddress': string;
  'position': string;
}
export class Resume {
  'resumeFile': File;
  'mobileNo': string;
}

export class Language {
  'languageName': string;
  'understand': boolean;
  'read': boolean;
  'write': boolean;
  'speek': boolean;
}

export class Qualification{
  'MobileNo': string;
  'OrderNo': number;
  'DegreeName': string;
  'Specialization': string;
  'PassingYear': string;
  'imageFile': File;
}
export class RemoveQualDetail{
  'mobileNo': string;
  'orderNo': number;
}
export class Skill{
  'skillName': string;
  'softwareVerson': string;
  'lastUsed': number;
  'experienceYear': number;
  'experienceMonth': number;
}
export class BasicDetail {
  'fName': string;
  'mName': string;
  'lName': string;
  'fatherName': string;
  'fatherMobileNo': string;
  'nationality': string;
  'vehicleType': string;
  'drivingLicenseNo': string;
  'dateOfBirth': string;
  'gender': string;
  'maritalStatus': string;
  'emailAddress': string;
  'mobileNo': string;
  'Photofile': File;
}
export class SkillDetail {
  'mobileNo': string;
  'skillDtl': Skill[];
}
export class AddressDetail {
  'mobileNo': string;
  'permanentAddress': string;
  'pinCode': string;
  'stateId': number
  'districtId': number
  'correspondenceAddress': string;
  'cPinCode': string;
  'cStateId': number
  'cDistrictId': number
}
export class HealthDetail {
  'mobileNo': string;
  'vision': string;
  'bloodPressure': string;
  'diabetes': string;
  'heartAilments': string;
  'anyOtherIllnes': string;
  'lastMajorIllness': string;
  'majoreIllnessDate': string;
  'bloodGroop': string;
}
export class PassportDetail {
  'mobileNo': string;
  'passportNo': string;
  'dateOfIssue': string;
  'validUpto': string;
  'issuedBy': string;
  'passAddress': string;
  'pCityName': string;
  'emigrationChecReq': string;
}
export class LanguageDetail {
  'mobileNo': string;
  'lanDtl': Language[];
}

