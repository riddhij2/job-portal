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
  'language': string;
  'understand': boolean;
  'read': boolean;
  'write': boolean;
  'speak': boolean;
}

