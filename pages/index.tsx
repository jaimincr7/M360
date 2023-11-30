import Image from "next/image";
import { Button } from "react-bootstrap";
import BannerCard from "../components/Home/BannerCard/BannerCard";
import { Referandearn } from "../public/assets";
import { ReferEarnViImage } from "../public/assets";
import ConsultDoctor from "../components/Home/ConsultDoctor/ConsultDoctor";
import HomeSymptomsList from "../components/Home/Symptoms/SymptomsList";
import HealthConcern from "../components/Home/HealthConcern/HealthConcern";
import TopHospital from "../components/Home/TopHospital/TopHospital";
import { createContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import {
  getAllPromotionalAction,
  promotionalSelector,
} from "../store/home/promotionalSlice";
import EasySteps from "../components/Home/EasySteps/EasySteps";
import JoinOurTeam from "../components/Home/JoinOurTeam/JoinOurTeam";
import Userreview from "../components/Home/UserReview/userreview";
import Blog from "../components/Home/Blog/blog";
import Appsection from "../components/Common/Appsection/appsection";
import { getAllTestimonialsAction } from "../store/home/testimonialSlice";
import { getAllBannersAction } from "../store/home/bannerSlice";
import Benefits from "../components/Home/Benefits/Benefits";
import { getAllBlogsAction } from "../store/home/blogSlice";
import OfferBanner from "../components/Home/OfferBanner/OfferBanner";
import { loginUserSelector, toggleLoginModal } from "../store/login/loginSlice";
import Toasters from "../components/Toast/toast";
import { Typeahead } from "react-bootstrap-typeahead";
import {
  clearDashboardFilterData,
  customSelector,
  getAllCities,
  getAllCitiesForFilter,
  getAllDoctorNames,
  getAllHospitalFilter,
  getAllSpecialitiesForFilter,
} from "../store/custom/customSlice";
import { CURRENT_USER } from "../commonModules/localStorege";
import { useRouter } from "next/router";
import { useTranslate } from "../commonModules/translate";
import { getUserFromStorage } from "../commonModules/commonInterfaces";
import { toast } from "react-toastify";
import { doctorListSelector, getAllPromocodeAction } from "../store/promocode/promocodeSlice";
import { PromotionalType } from "../utils/constant";
import { languageSelector } from "../store/language/languageSlice";

export default function Home() {
  let keywordSearchTimer: any = null;
  //const DataContext = createContext(null);
  const router = useRouter();
  const [rerender, setRerender] = useState(false);
  const login = useAppSelector(loginUserSelector);
  const dispatch = useAppDispatch();
  const promotionals = useAppSelector(promotionalSelector);
  const [showToaster, setShowToaster] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>({});
  const [cities, setCities] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorIds] = useState<any>([]);
  const [hospitalId, setHospitalIds] = useState<any>([]);
  const [specialityId, setSpecialityIds] = useState<any>([]);
  const [cityId, setCityId] = useState<any>([]);
  const custom = useAppSelector(customSelector);
  const promocodeState = useAppSelector(doctorListSelector);
  const t = useTranslate();
  const lg = useAppSelector(languageSelector)
  useEffect(() => {
    dispatch(getAllPromotionalAction());
    dispatch(getAllTestimonialsAction());
    dispatch(getAllBannersAction());
    dispatch(getAllBlogsAction());
    dispatch(getAllPromocodeAction());
    setCurrentUser(getUserFromStorage());
    window.addEventListener("loggedInCustomEvent", () => {
      setCurrentUser(getUserFromStorage());
    });
  }, []);

  useEffect(() => {
    if (custom.citiesForFilter.citiesForFilter.length > 0) {
      setCities(custom.citiesForFilter.citiesForFilter);
    }
  }, [custom.citiesForFilter.citiesForFilter]);
  
  useEffect(() => {
    if (custom.specialitiesForFilter.specialitiesForFilter.length > 0) {
      setSpecialities(custom.specialitiesForFilter.specialitiesForFilter);
    }
  }, [custom.specialitiesForFilter.specialitiesForFilter]);

  useEffect(() => {
    if (custom.hospitalsForFilter.hospitalsForFilter.length > 0) {
      setHospitals(custom.hospitalsForFilter.hospitalsForFilter);
    }
  }, [custom.hospitalsForFilter.hospitalsForFilter]);

  useEffect(() => {
    if (custom.doctorNames.doctorNames.length > 0) {
      setDoctors(custom.doctorNames.doctorNames);
    }
  }, [custom.doctorNames.doctorNames]);

  useEffect(() => {
    if (!!login && Object.keys(login.createUser.createUser).length) {
      setShowToaster(true);
    }
  }, [login.createUser.createUser]);

  useEffect(() => {
    if (promotionals.data.promotionals.length > 0) setRerender(true);
  }, [promotionals.data.promotionals]);

  useEffect(() => {
    return () => {
      dispatch(clearDashboardFilterData());
    };
  }, []);

  //For Cities search
  const onSearch = (e) => {
    if (e !== "" && e !== null) {
      if (keywordSearchTimer) {
        clearTimeout(keywordSearchTimer);
      }
      keywordSearchTimer = setTimeout(() => {
        const data = {
          Name: e,
        };
        dispatch(getAllCitiesForFilter(data));
      }, 1000);
    } else {
      setCities([]);
    }
  };

  //For Specialities search
  const onSearchSpeciality = (e) => {
    if (e !== "" && e !== null) {
      if (keywordSearchTimer) {
        clearTimeout(keywordSearchTimer);
      }
      keywordSearchTimer = setTimeout(() => {
        const data = {
          Name: e,
        };
        dispatch(getAllSpecialitiesForFilter(data));
      }, 1000);
    } else {
      setSpecialities([]);
    }
  };

  //For Hospital search
  const onSearchHospital = (e) => {
    if (e !== "" && e !== null) {
      if (keywordSearchTimer) {
        clearTimeout(keywordSearchTimer);
      }
      keywordSearchTimer = setTimeout(() => {
        dispatch(getAllHospitalFilter(e));
      }, 1000);
    } else {
      setHospitals([]);
    }
  };

  //For Doctor search
  const onSearchDoctor = (e) => {
    if (e !== "" && e !== null) {
      if (keywordSearchTimer) {
        clearTimeout(keywordSearchTimer);
      }
      keywordSearchTimer = setTimeout(() => {
        const data = {
          Name: e,
        };
        dispatch(getAllDoctorNames(data));
      }, 1000);
    } else {
      setDoctors([]);
    }
  };

  const makeAppointment = () => {
    if (
      doctorId?.length ||
      hospitalId.length ||
      specialityId.length > 0 ||
      cityId?.length > 0
    ) {
      if (doctorId?.length > 0) {
        router.push("/doctor-details/" + doctorId[0].doctorId);
      } else {
        const query: any = {};

        if (hospitalId.length > 0) {
          query.hospitalId = hospitalId[0].hospitalId;
        }

        if (specialityId.length > 0) {
          query.specialityId = specialityId[0].specialityId;
        }

        if (cityId.length > 0) {
          query.cityId = cityId[0].cityId;
          dispatch(getAllCities());
        }
        router.push({
          pathname: "/doctor-list",
          query,
        });
      }
    } else {
      toast.error(t("atleast_1_filter"));
    }
  };

  return (
    <>
      <div className="bannerdata-cover">
        {rerender ? <BannerCard /> : <></>}
        <div className="CustContainer">
          <div className="makeappoi-cover">
            <div className="makeappoi-set">
              <div className="appoifeild-set">
                <label htmlFor="">{t("location")}</label>
                <Typeahead
                  id="basic-typeahead-single"
                  labelKey="name"
                  onInputChange={(e) => {
                    onSearch(e);
                  }}
                  onChange={(e) => setCityId(e)}
                  options={cities}
                  placeholder={t("enter_city_district")}
                />
              </div>
              <div className="appoifeild-set">
                <label htmlFor="">{t("speciality")}</label>
                <Typeahead
                  id="basic-typeahead-single"
                  labelKey="name"
                  onInputChange={(e) => {
                    onSearchSpeciality(e);
                  }}
                  onChange={(e) => setSpecialityIds(e)}
                  options={specialities}
                  placeholder={t("choose_speciality")}
                />
              </div>
              <div className="appoifeild-set">
                <label htmlFor="">{t("doctor")}</label>
                <Typeahead
                  id="basic-typeahead-single"
                  labelKey="displayName"
                  onInputChange={(e) => {
                    onSearchDoctor(e);
                  }}
                  onChange={(e) => setDoctorIds(e)}
                  options={doctors}
                  placeholder={t("choose_doctor")}
                />
              </div>
              <div className="appoifeild-set">
                <label htmlFor="">{t("hospital")}</label>
                <Typeahead
                  id="basic-typeahead-single"
                  labelKey="name"
                  onInputChange={(e) => {
                    onSearchHospital(e);
                  }}
                  onChange={(e) => setHospitalIds(e)}
                  options={hospitals}
                  placeholder={t("choose_hospital")}
                />
              </div>
              <div className="appoifeild-set">
                <Button onClick={makeAppointment}>
                  {t("make_appointment")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      { rerender && promotionals?.data?.promotionals ? promotionals.data.promotionals.map((p, index) => {
          switch(p.promotionalType) {
            case PromotionalType.HealthConcern:
              return <HealthConcern key={"section" + index} promotionalData={p} />;
            case PromotionalType.ConsultDoctor:
              return <ConsultDoctor key={"section" + index} promotionalData={p} />;
            case PromotionalType.TopHospital:
              return <TopHospital key={"section" + index} promotionalData={p} />;
            case PromotionalType.HomeSymptomsList:
              return <HomeSymptomsList key={"section" + index} promotionalData={p} />;
          }
        }) : <></>
      }
      {/* {rerender ? <HealthConcern /> : <></>}
      {rerender ? <ConsultDoctor /> : <></>}
      {rerender ? <TopHospital /> : <></>}
      {rerender ? <HomeSymptomsList /> : <></>} */}
      <Benefits />
      <div className="offbanner-cover">
        <div className="CustContainer">
          <div className="row">
            <div className="col-md-6 offerban-det">
              <OfferBanner data={promocodeState.allPromocode?.data?.promoCodes}/>
            </div>

            <div className="col-md-6">
              <div
                className="referearn-cover"
                onClick={() => {
                  CURRENT_USER()?.userId
                    ? router.push("/refer-and-earn")
                    : dispatch(toggleLoginModal());
                }}
              >
                <a href="javascript:;">
                  <Image
                    src={lg?.language==="vi"? ReferEarnViImage:Referandearn}
                    alt="referandearn"
                    width="0"
                    height="0"
                    sizes="100vw"
                    style={{ width: "100%", height: "auto" }}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EasySteps />

      {!currentUser?.userId && <JoinOurTeam />}

      <Userreview />

      <Blog />

      <Appsection />
    </>
  );
}
