import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import promotionalsReducer from "../store/home/promotionalSlice";
import testimonialsReducer from "../store/home/testimonialSlice";
import blogsReducer from "../store/home/blogSlice";
import bannersReducer from "../store/home/bannerSlice";
import doctorsListReducer from "../store/doctorList/doctorListSlice";
import doctorDetailsReducer from "../store/doctorDetails/doctorDetailsSlice";
import specialitiesListReducer from "../store/specialitiesList/specialitiesListSlice";
import symptomsListReducer from "../store/symptomsList/symptomsListSlice";
import hospitalsListReducer from "../store/hospitalsList/hospitalsListSlice";
import loginUserReducer from "../store/login/loginSlice";
import appointmentReducer from "../store/user/appointmentSlice";
import blogReducer from "../store/blog/blogSlice";
import customReducer from "../store/custom/customSlice";
import patientDetailsReducer from "../store/patientDetails/patientDetailsSlice";
import userDetailsReducer from "../store/user/userDetailsSlice";
import userAddressReducer from "../store/user/addressSlice";
import userAppointmentReducer from "../store/user/userFeedbacksForDoctorSlice";
import userWalletReducer from "../store/user/userWalletSlice";
import userNotificationReducer from "../store/user/userNotificationSlice";
import userHealthRecordReducer from "../store/user/userHealthRecordSlice";
import languageReducer from "../store/language/languageSlice";
import promocodeReducer from "../store/promocode/promocodeSlice";
import insuranceClaimsReducer from "../store/insurance/insuranceClaimsSlice";

export const store = configureStore({
  reducer: {
    promotionals: promotionalsReducer,
    testimonials: testimonialsReducer,
    banners: bannersReducer,
    doctorsList: doctorsListReducer,
    specialitiesList: specialitiesListReducer,
    symptomsList: symptomsListReducer,
    blogs: blogsReducer,
    hospitalsList: hospitalsListReducer,
    doctorDetails: doctorDetailsReducer,
    loginUser: loginUserReducer,
    appointment: appointmentReducer,
    blog: blogReducer,
    custom: customReducer,
    patientDetails: patientDetailsReducer,
    userDetails: userDetailsReducer,
    userAddress: userAddressReducer,
    userAppointmentReview: userAppointmentReducer,
    userWallet: userWalletReducer,
    userNotification: userNotificationReducer,
    userHealthRecord: userHealthRecordReducer,
    promocode: promocodeReducer,
    insuranceClaims: insuranceClaimsReducer,
    language: languageReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
