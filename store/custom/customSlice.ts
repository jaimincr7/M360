import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IAddContactUs,
  IAddPatient,
  IAddUser,
  IAddUserAddress,
} from "../../commonModules/commonInterfaces";
import commonService from "../../services/commonService";
import customService from "../../services/commonService";
import contactUsService from "../../services/contactUsService";
import specialitiesListService from "../../services/specialtyService";
import hospitalsListService from "../../services/hospitalService";
import { RootState } from "../../utils/store";

export interface CustomState {
  value: number;
  status: "idle" | "loading" | "failed";
  cities: {
    status: String;
    cities: any;
  };
  citiesForFilter: {
    status: "idle";
    citiesForFilter: any;
  };
  specialitiesForFilter: {
    status: "idle";
    specialitiesForFilter: any;
  };
  hospitalsForFilter: {
    status: "idle";
    hospitalsForFilter: any;
  };
  doctorNames: {
    status: "idle";
    doctorNames: any;
  };
  language: {
    status: String;
    language: any;
  };
  countries: {
    status: String;
    countries: any;
  };
  states: {
    status: String;
    states: any;
  };
  relations: {
    status: string;
    relations: any;
  };
  serviceTypes: {
    status: string;
    serviceTypes: any;
  };
  contactUs: {
    status: string;
    contactUs: any;
  };
  globalSearch: {
    status: string;
    data: any;
  };
  infoContent: {
    data: any;
    status: string;
  };
  configData: {
    data: any;
    status: string;
  };
}

const initialState: CustomState = {
  value: 0,
  status: "idle",
  cities: {
    status: "idle",
    cities: [],
  },
  citiesForFilter: {
    status: "idle",
    citiesForFilter: [],
  },
  specialitiesForFilter: {
    status: "idle",
    specialitiesForFilter: [],
  },
  hospitalsForFilter: {
    status: "idle",
    hospitalsForFilter: [],
  },
  doctorNames: {
    status: "idle",
    doctorNames: [],
  },
  language: {
    status: "idle",
    language: [],
  },
  countries: {
    status: "idle",
    countries: [],
  },
  states: {
    status: "idle",
    states: [],
  },
  relations: {
    status: "idle",
    relations: [],
  },
  serviceTypes: {
    status: "idle",
    serviceTypes: [],
  },
  contactUs: {
    status: "idle",
    contactUs: [],
  },
  globalSearch: {
    status: "idle",
    data: [],
  },
  infoContent: {
    status: "idle",
    data: "",
  },
  configData: {
    status: "idle",
    data: {},
  },
};

export const getAllCities = createAsyncThunk("getAllCities", async () => {
  const response = await customService.getAllCities();
  return response.data;
});

export const getAllCitiesByStateId = createAsyncThunk("getAllCitiesByStateId", async (id:number) => {
  const response = await customService.getAllCities({stateId:id});
  return response.data;
});

export const getAllDoctorNames = createAsyncThunk(
  "getAllDoctorNames",
  async (param: any) => {
    const response = await customService.getAllDoctorNames(param);
    return response.data;
  }
);

export const getAllCitiesForFilter = createAsyncThunk(
  "getAllCitiesForFilter",
  async (param: any) => {
    const response = await customService.getAllCities(param);
    return response.data;
  }
);

export const getAllHospitalFilter = createAsyncThunk(
  "getAllHospitalFilter",
  async (data?: any) => {
    const response = await hospitalsListService.getAllHospitalsList(
      undefined,
      data
    );
    return response.data;
  }
);

export const getAllSpecialitiesForFilter = createAsyncThunk(
  "getAllSpecialitiesForFilter",
  async (param: any) => {
    const response = await specialitiesListService.getAllSpecialitiesList(
      param
    );
    return response.data;
  }
);

export const addContactUsMessage = createAsyncThunk(
  "addContactUsMessage",
  async (data: IAddContactUs) => {
    const response = await contactUsService.addContactUsMessage(data);
    return response.data;
  }
);

export const getConfig = createAsyncThunk("getConfig", async () => {
  const response = await customService.getConfig();
  return response;
});

export const getAllCountries = createAsyncThunk("getAllCountries", async () => {
  const response = await customService.getAllCountries();
  return response.data;
});

export const getGlobalSearch = createAsyncThunk(
  "getGlobalSearch",
  async (param: any) => {
    const response = await commonService.getGlobalSearch(param);
    return response.data;
  }
);

export const getGlobalSearches = createAsyncThunk(
  "getGlobalSearches",
  async (search: string) => {
    const response = await customService.getGlobalSearches(search);
    return response.data;
  }
);

export const getAllLanguages = createAsyncThunk("getAllLanguages", async () => {
  const response = await customService.getAllLanguages();
  return response.data;
});

export const getAllPatients = createAsyncThunk("getAllPatients", async () => {
  const response = await customService.getAllPatients();
  return response.data;
});

export const addPateint = createAsyncThunk(
  "addPateint",
  async (data: IAddPatient) => {
    const response = await customService.addPateint(data);
    return response.data;
  }
);

export const getAllRelations = createAsyncThunk("getAllRelations", async () => {
  const response = await customService.getAllRelations();
  return response.data;
});

export const getAllStates = createAsyncThunk("getAllStates", async () => {
  const response = await customService.getAllStates();
  return response.data;
});

export const addUserAddresses = createAsyncThunk(
  "addUserAddresses",
  async (data: IAddUserAddress) => {
    const response = await customService.addUserAddresses(data);
    return response.data;
  }
);

export const addUser = createAsyncThunk("addUser", async (data: IAddUser) => {
  const response = await customService.addUser(data);
  return response.data;
});

export const getAllServiceTypes = createAsyncThunk(
  "getAllServiceTypes",
  async () => {
    const response = await customService.getAllServiceTypes();
    return response.data;
  }
);

export const getInfoContentAction = createAsyncThunk(
  "getInfoContentAction",
  async (data: { type: number; languageId: number }) => {
    const response = await commonService.getInfoContent(
      data.type,
      data.languageId
    );
    return response.data;
  }
);

export const custom = createSlice({
  name: "custom",
  initialState,
  reducers: {
    clearData: (state) => {
      state.cities.cities = [];
    },
    clearDashboardFilterData: (state) => {
      state.citiesForFilter.citiesForFilter = [];
      state.specialitiesForFilter.specialitiesForFilter = [];
      state.doctorNames.doctorNames = [];
      state.hospitalsForFilter.hospitalsForFilter = [];
    },
  },

  extraReducers: (builder) => {
    //Get all Blog Cat.
    builder
      .addCase(getAllCities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllCities.fulfilled, (state, action) => {
        state.status = "idle";
        state.cities.cities = action.payload.cities;
      })
      .addCase(getAllCities.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(getAllCitiesForFilter.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllCitiesForFilter.fulfilled, (state, action) => {
        state.status = "idle";
        state.citiesForFilter.citiesForFilter = action.payload.cities;
      })
      .addCase(getAllCitiesForFilter.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(getAllSpecialitiesForFilter.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllSpecialitiesForFilter.fulfilled, (state, action) => {
        state.status = "idle";
        state.specialitiesForFilter.specialitiesForFilter =
          action.payload.specialities;
      })
      .addCase(getAllSpecialitiesForFilter.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(getAllHospitalFilter.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllHospitalFilter.fulfilled, (state, action) => {
        state.status = "idle";
        state.hospitalsForFilter.hospitalsForFilter = action.payload.hospitals;
      })
      .addCase(getAllHospitalFilter.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(getAllDoctorNames.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllDoctorNames.fulfilled, (state, action) => {
        state.status = "idle";
        state.doctorNames.doctorNames = action.payload.doctors;
      })
      .addCase(getAllDoctorNames.rejected, (state) => {
        state.status = "failed";
      });

    //Get all Language.
    builder
      .addCase(getAllLanguages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllLanguages.fulfilled, (state, action) => {
        state.status = "idle";
        state.language.language = action.payload.languages;
      })
      .addCase(getAllLanguages.rejected, (state) => {
        state.status = "failed";
      });

    //Get all Countries.
    builder
      .addCase(getAllCountries.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllCountries.fulfilled, (state, action) => {
        state.status = "idle";
        state.countries.countries = action.payload.countries;
      })
      .addCase(getAllCountries.rejected, (state) => {
        state.status = "failed";
      });

    //Get all States.
    builder
      .addCase(getAllStates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllStates.fulfilled, (state, action) => {
        state.status = "idle";
        state.states.states = action.payload.states;
      })
      .addCase(getAllStates.rejected, (state) => {
        state.status = "failed";
      });

    //Get all relations.
    builder
      .addCase(getAllRelations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllRelations.fulfilled, (state, action) => {
        state.status = "idle";
        state.relations.relations = action.payload.relations;
      })
      .addCase(getAllRelations.rejected, (state) => {
        state.status = "failed";
      });

    //Get Global Searches.
    builder
      .addCase(getGlobalSearch.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getGlobalSearch.fulfilled, (state, action) => {
        state.status = "idle";
        state.globalSearch.data = action.payload.globalSearches;
      })
      .addCase(getGlobalSearch.rejected, (state) => {
        state.status = "failed";
      });

    //Add ContactUs Message.
    builder
      .addCase(addContactUsMessage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addContactUsMessage.fulfilled, (state, action) => {
        state.status = "idle";
        state.contactUs.contactUs = action.payload;
      })
      .addCase(addContactUsMessage.rejected, (state) => {
        state.status = "failed";
      });

    //Get all service types.
    builder
      .addCase(getAllServiceTypes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllServiceTypes.fulfilled, (state, action) => {
        state.status = "idle";
        state.serviceTypes.serviceTypes = action.payload.serviceTypes;
      })
      .addCase(getAllServiceTypes.rejected, (state) => {
        state.status = "failed";
      });

    //Get all service types.
    builder
      .addCase(getInfoContentAction.pending, (state) => {
        state.infoContent.status = "loading";
      })
      .addCase(getInfoContentAction.fulfilled, (state, action) => {
        state.infoContent.status = "idle";
        state.infoContent.data = action.payload;
      })
      .addCase(getInfoContentAction.rejected, (state) => {
        state.infoContent.status = "failed";
      });

    //Get Config.
    builder
      .addCase(getConfig.pending, (state) => {
        state.configData.status = "loading";
      })
      .addCase(getConfig.fulfilled, (state, action) => {
        state.configData.status = "idle";
        state.configData.data = action.payload;
      })
      .addCase(getConfig.rejected, (state) => {
        state.configData.status = "failed";
      });
  },
});

export const { clearData, clearDashboardFilterData } = custom.actions;

export const customSelector = (state: RootState) => state.custom;

export default custom.reducer;
