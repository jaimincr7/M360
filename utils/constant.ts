export enum OTPTypes {
  Login = 0,
  ForgotPassword = 1,
  ChangeMobileNumber = 2,
  ChangeEmail = 3,
}

export enum DoctorFileType {
  License = 0,
  Document = 1,
  Certificate = 2,
}

export enum HealthRecordType {
  Other = 0,
  Report = 1,
  Prescription = 2,
}

export enum HealthRecordUploadFileType {
  PDF = 0,
  Image = 1,
}

export enum PromotionalType {
  ConsultDoctor = 0,
  TopHospital = 1,
  HealthConcern = 2,    
  HomeSymptomsList = 3
}

export enum AppointmentStatusType {
  Pending = 0,
  PaymentInitiated = 1,
  PaymentCancel = 2,
  PaymentFailed = 3,
  Booked = 4,
  Cancelled = 5,
  Completed = 10,
}


export const AppointmentStatus = {
  0: "Pending",
  1: "Payment Initiated",
  2: "Payment Cancel",
  3: "Payment Failed",
  4: "Booked",
  5: "Cancelled",
  10: "Completed",
};

export enum AppointmentListType {
  Past = 1,
  Upcoming = 2,
}

// export const FeedbackSortingType = [
//   { value: 1, label: "This Week" },
//   { value: 2, label: "This Month" },
//   { value: 3, label: "This Year" },
// ];
export const FeedbackSortingType = [
  { value: 1, label: "this_week" },
  { value: 2, label: "this_month" },
  { value: 3, label: "this_year" },
];

export const InsuranceStatus = {
  0: "Waiting For Approval",
  1: "Approved",
  2: "Rejected",
};

export const UserTypeDetail = {
  0: "User",
  1: "Doctor",
  2: "Hospital",
  3: "SuperAdmin",
};

export const UserType = {
  User: 0,
  Doctor: 1,
  Hospital: 2,
  SuperAdmin: 3,
};

export enum DeviceType {
  Web = 0,
  Android = 1,
  IOS = 2,
}

export enum GlobalSearchType {
  Doctor = "0",
  Symptom = "1",
  Speciality = "2",
}

export const DurationFilterOptions = [
  { value: 0, label: "all" },
  { value: 1, label: "this_week" },
  { value: 2, label: "this_month" },
  { value: 3, label: "this_year" },
];

export const ELDER_DATE = (): Date => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 25);
  return date;
};

// this hp name showing when api return null as hp name due to g.p.
export const HpNameIfNull = "General Practitioner";

export const SocialMediaHandler = {
  instagram: "embed",
  twitter: "embed",
  linkedIn: "embed",
};

export const InfoPageConst = {
  "about-us": 1,
  "terms-and-service": 2,
  faqs: 3,
  "privacy-policy": 4,
};

export const CONST_LANGUAGE_ID = 1;

export const DEFAULT_DATE_FORMAT = "dd/MM/yyy";

export enum HospitalFileType {
  Image = 0,
  Document = 1,
}

export const WalletHistoryFilterOptions = [
  { value: 0, label: "all" },
  { value: 1, label: "this_month" },
  { value: 2, label: "last_month" },
  { value: 3, label: "today" },
];

export const PaymentTypeEnum = {
  CashOnConsultation: 0,
  PayOnline: 1,
  FreeOfConsultation: 2,
};

export const PaymentStatusEnum = {
  NotApplicable: 0,
  Pending: 1,
  Completed: 2,
  Cancelled: 3,
  Failed: 4,
  Refunded: 5,
};
