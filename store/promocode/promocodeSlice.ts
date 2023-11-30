import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import promocodeService from "../../services/promocodeService";
import { RootState } from "../../utils/store";

export interface IApplyPromocode {
  promocodeId: number;
  userId: number;
  mobileNumber: string;
  doctorId: number;
  hospitalId: number;
  serviceTypeId: number;
  isApply?: boolean;
}

export interface PromocodeState {
  value: number;
  status: "idle" | "loading" | "failed";
  applyPromocode: {
    status: string;
    data: any;
  };
  allPromocode:{
    status: string;
    data: any;
  };
  promoCodeDetail:{
    status: string;
    data: any;
  };
}

const initialState: PromocodeState = {
  value: 0,
  status: "idle",
  applyPromocode: {
    status: "idle",
    data: {},
  },
  allPromocode:{
    status:"idle",
    data:[]
  },
  promoCodeDetail:{
    data:{},
    status:"idle"
  }
};

export const applyPromoCode = createAsyncThunk(
  "applyPromoCode",
  async (data: IApplyPromocode) => {
    const response = await promocodeService.applyPromoCode(data);
    return response.data;
  }
);

export const getAllPromocodeAction = createAsyncThunk(
  "getAllPromocodeAction",
  async () => {
    const response = await promocodeService.getAllPromoCodes();
    return response.data;
  }
);

export const getPromoDetailsAction = createAsyncThunk(
  "getPromoDetailsAction",
  async (id:number) => {
    const response = await promocodeService.getPromoDetails(id);
    return response.data;
  }
);

export const promocodeSlice = createSlice({
  name: "promocodeSlice",
  initialState,
  reducers: {
    clearData: (state) => {
      state.applyPromocode.data = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyPromoCode.pending, (state) => {
        state.status = "loading";
      })
      .addCase(applyPromoCode.fulfilled, (state, action) => {
        state.status = "idle";
        state.applyPromocode.data = action.payload;
      })
      .addCase(applyPromoCode.rejected, (state) => {
        state.status = "failed";
      });

      builder
      .addCase(getAllPromocodeAction.pending, (state) => {
        state.allPromocode.status = "loading";
      })
      .addCase(getAllPromocodeAction.fulfilled, (state, action) => {
        state.allPromocode.status  = "idle";
        state.allPromocode.data = action.payload;
      })
      .addCase(getAllPromocodeAction.rejected, (state) => {
        state.allPromocode.status  = "failed";
      });

      builder
      .addCase(getPromoDetailsAction.pending, (state) => {
        state.promoCodeDetail.status = "loading";
      })
      .addCase(getPromoDetailsAction.fulfilled, (state, action) => {
        state.promoCodeDetail.status  = "idle";
        state.promoCodeDetail.data = action.payload;
      })
      .addCase(getPromoDetailsAction.rejected, (state) => {
        state.promoCodeDetail.status  = "failed";
      });
  },
});

export const { clearData } = promocodeSlice.actions;

export const doctorListSelector = (state: RootState) => state.promocode;

export default promocodeSlice.reducer;
