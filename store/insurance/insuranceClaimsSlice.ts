import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import insuranceClaimsService from "../../services/insuranceClaimsService";
import { RootState } from "../../utils/store";

export interface InsuranceClaimsState {
  value: number;
  status: "idle" | "loading" | "failed";
  getAllInsuranceCompanies: {
    status: string;
    data: any;
  };
}

export interface ICreateInsuranceClaims {
  insuranceCompanyId: number;
  appointmentId: number;
  insuredName: string;
  policyNumber: string;
  birthDate: Date | string;
  uniqueId: string;
  passportFrontSideFilePath: string;
  passportBackSideFilePath: string;
  countryId: number;
  phoneCode: number;
  mobileNumber: string;
  email: string;
  reasonForRequest: string;
  eventDate: Date | string;
  medicalProvidersName: string;
  claimAmount: number;
  isTermsAndConditionAccepted: boolean;
}

const initialState: InsuranceClaimsState = {
  value: 0,
  status: "idle",
  getAllInsuranceCompanies: {
    status: "idle",
    data: [],
  },
};

export const getAllInsuranceCompaniesAction = createAsyncThunk(
  "getAllInsuranceCompaniesAction",
  async () => {
    const response = await insuranceClaimsService.getAllInsuranceCompanies();
    return response.data;
  }
);

export const createInsuranceClaimAction = createAsyncThunk(
  "createInsuranceClaimAction",
  async (data: ICreateInsuranceClaims) => {
    const response = await insuranceClaimsService.createInsuranceClaim(data);
    return response.data;
  }
);

export const insuranceClaimsSlice = createSlice({
  name: "insuranceClaimsSlice",
  initialState,
  reducers: {
    clearData: (state) => {
      state.getAllInsuranceCompanies.data = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllInsuranceCompaniesAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllInsuranceCompaniesAction.fulfilled, (state, action) => {
        state.status = "idle";
        state.getAllInsuranceCompanies.data = action.payload.insuranceCompanies;
      })
      .addCase(getAllInsuranceCompaniesAction.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearData } = insuranceClaimsSlice.actions;

export const insuranceClaimsSelector = (state: RootState) =>
  state.insuranceClaims;

export default insuranceClaimsSlice.reducer;
