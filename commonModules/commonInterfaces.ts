export interface IFilterDoctors {
  pageNumber: number;
  pageSize: number;
  cityId: number;
  gender: string[];
  orderBy: string;
  doctorId: number;
  hospitals: string[];
  languages: string[];
  specialities: string[];
  symptoms: string[];
  experiences: string[];
  serviceTypes: string[];
  promoCodeId?:number
}

export interface ICreateUser {
  fullName: string;
  email: string;
  countryId?: number;
  phoneCode?: number;
  mobileNumber: string;
  birthDate?: Date;
  gender?: string;
  uniqueId: string;
  zaloNumber: string;
  facebookId?: string;
  googleId?: string;
  passwordHash: string;
  referralId?: number;
}

export interface IRequestOTP {
  userId?: number;
  username: string;
  countryId?: number;
  otpType: number;
}

export interface IVerifyOTP {
  username: string;
  otp: string;
  otpType: number;
  countryId?: number;
  timeZoneOffSet?: number;
}

export interface IChangePassword {
  username: string;
  otp: string;
  otpType: number;
  password: string;
}

export interface ILoginUser {
  userName: string;
  password: string;
  countryId?: number;
}

export interface ILoginUserWithOTP {
  userName: string;
  otp: string;
  countryId?:number
}

export interface IMakeAppointment {
  doctorId: number;
  hospitalId: number;
  patientId: number;
  userId: number;
  serviceTypeId: number;
  appointmentDateTime: string | Date;
  addressId: number;
  isWalletUsed: boolean;
  isFollowup?: boolean;
  followupParentAppointmentId?: number;
  followupRemark?: string;
  consulationNoteAppointmentIds: string;
  userHealthRecordIds: string;
  symptoms: string;
  promocodeId?: number;
  mobileNumber: string;
  paymentType?: number;
}

export interface IAddAppointmentReview {
  appointmentId: number;
  userId: number;
  doctorId: number;
  ratings: number;
  comment: string;
}

export interface IAddPatient {
  patientId?: number;
  fullName: string;
  email: string;
  countryId: number;
  phoneCode: number;
  mobileNumber: string;
  relationId: number;
  birthDate: Date;
  gender: string;
  userId: number;
  uniqueId: string;
  zaloNumber: string;
}

export interface IAddUserAddress {
  userAddressId: number;
  userId: number;
  fullName: string;
  countryId: number;
  phoneCode: number;
  mobileNumber: string;
  address: string;
  ward: string;
  district: string;
  stateId: number;
  cityId: number;
  isDefaultAddress: true;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddUser {
  fullName: string;
  email: string;
  countryId: number;
  phoneCode: number;
  mobileNumber: string;
  birthDate: Date;
  gender: string;
  uniqueId: string;
  zaloNumber: string;
  facebookId: string;
  googleId: string;
  passwordHash: string;
}

export interface IResetPassword {
  userId: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IClinic {
  name: string;
  countryId: number;
  phoneCode: number;
  mobileNumber: string;
  emergencyMobileCountryId: number;
  emergencyMobilePhoneCode: number;
  emergencyMobileNumber: string;
  licenseNumber: string;
  aboutus: string;
  email: string;
  address: string;
  ward: string;
  district: string;
  cityId: number;
  stateId: number;
  isClinic: boolean;
  clinicDoctorId: number;
  files?: {
    name: string;
    filePath: string;
    hospitalFileType: number;
  }[];
}

export interface ICreateHospital {
  doctorId: number;
  clinic: IClinic;
  services: any;
  userName: string;
}

export interface IAddContactUs {
  fullName: string;
  email: string;
  mobileNumber: string;
  message: string;
  countryId: number;
  phoneCode: number;
}

export interface IApiResponse<T> {
  data: T;
  errors: string[];
  isSuccess: boolean;
  message: string;
}

//This is for Next image dynamic loading.
export const myLoader = ({ src }) => {
  return `${src}`;
};

export const getUserFromStorage = () => {
  let user: any = {};
  if (localStorage["user"]) {
    user = JSON.parse(localStorage.getItem("user") || "");
  }
  return user;
};
