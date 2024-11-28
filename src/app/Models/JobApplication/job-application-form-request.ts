export class JobApplicationFormRequest {
  'MRID': string;
  'FacebookId': string;
  'gender': string;
  'PinCode': string;
  'uanNo': string;
  'mobileNo': string;
  'maritalStatus': string;
  'permanentAddress': string;
  'fatherName': string;
  'panFile': File;
  'districtId': string;
  'resumeFile': File;
  'correspondenceState': string;
  'correspondencePincode': string;
  'LinkdinId': string;
  'name': string;
  'qualificationFile': File;
  'stateId': string;
  'correspondenceDistrict': string;
  'InstagramId': string;
  'bankAccountNo': string;
  'adharFile': File;
  'TwiterId': string;
  'bankName': string;
  'revenueId': string;
  'adharNo': string;
  'emailAddress': string;
  'bankStatementFile': File;
  'dateOfBirth': string;
  'correspondenceAddress': string;
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

