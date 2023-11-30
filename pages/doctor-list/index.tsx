import React, { useEffect, useState } from "react";
import { TiLocation } from "react-icons/ti";
import { IoIosArrowDown } from "react-icons/io";
import { BiSearch, BiSort } from "react-icons/bi";
import { FaFilter } from "react-icons/fa";
import { Button, FloatingLabel } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Appsection from "../../components/Common/Appsection/appsection";
import DoctorsList from "../../components/DoctorList";
import FilterModel from "../../components/DoctorList/filter";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { getAllSpecialitiesListAction } from "../../store/specialitiesList/specialitiesListSlice";
import { getAllSymptomsListAction } from "../../store/symptomsList/symptomsListSlice";
import { getHospitalsBreifListAction } from "../../store/hospitalsList/hospitalsListSlice";
import {
  customSelector,
  getAllCities,
  getAllLanguages,
} from "../../store/custom/customSlice";
import { IFilterDoctors } from "../../commonModules/commonInterfaces";
import {
  doctorListSelector,
  getAllDoctorsListAction,
  lastFiltersForDrList,
} from "../../store/doctorList/doctorListSlice";
import PaginationComp, { PageSizeConstant } from "../../components/pagination";
import { clearData } from "../../store/doctorList/doctorListSlice";
import { useRouter } from "next/router";
import { useTranslate } from "../../commonModules/translate";

export default function DoctorList() {
  const cities = useAppSelector(customSelector);
  const doctors = useAppSelector(doctorListSelector);
  const router = useRouter();

  const t = useTranslate();
  const dispatch = useAppDispatch();
  const [currentCity, setCurrentCity] = useState<any>("");
  const [offlineSearchString, setOfflineSearchString] = useState("");
  const [currentService, setServiceChange] = useState<number[]>([]);
  const [searchCities, setSearchCities] = useState<any>([
    { value: 0, label: t("all_cities") },
  ]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(90);

  let data: IFilterDoctors = {
    cityId: 0,
    pageNumber: 1,
    pageSize: PageSizeConstant,
    gender: [],
    orderBy: "DESC",
    doctorId: 0,
    hospitals: [],
    languages: [],
    specialities: [],
    symptoms: [],
    serviceTypes: [],
    experiences: [],
  };

  useEffect(() => {
    dispatch(getAllSymptomsListAction());
    dispatch(getAllSpecialitiesListAction());
    dispatch(getAllCities());
    dispatch(getAllLanguages());
    dispatch(getHospitalsBreifListAction());
  }, []);

  useEffect(() => {
    if (router.isReady) {
      if (Object.keys(router.query).length > 0) {
        const key = Object.keys(router.query);

        if (key[0] == "cityId") {
          data = {
            ...data,
            cityId: Number(router.query[key[0]]),
          };

          const newCurCity: any = cities?.cities?.cities?.find(
            (x: any) => x.cityId === Number(router.query[key[0]])
          );
          if (newCurCity) {
            setCurrentCity(newCurCity?.name);
          }
        }
      }
    }
  }, [router.query, cities.cities.cities]);

  useEffect(() => {
    if (doctors.data?.pagination?.totalRecords) {
      setTotalRecords(doctors.data?.pagination?.totalRecords);
    } else {
      setTotalRecords(0);
    }
  }, [doctors.data.pagination?.totalRecords]);

  const [filtermodel, setShowftr] = useState(false);
  const handleFiltermodel = () => setShowftr(true);
  const handleClosedet = () => setShowftr(false);

  const animatedComponents = makeAnimated();
  const sortby = [
    { value: "1", label: t("rate_high_to_low") },
    { value: "2", label: t("rate_low_to_high")},
  ];

  const onCityChange = (e) => {
    data = {
      cityId: e,
      pageNumber: 1,
      pageSize: PageSizeConstant,
      gender: [],
      orderBy: "DESC",
      doctorId: 0,
      hospitals: [],
      languages: [],
      specialities: [],
      symptoms: [],
      serviceTypes: [],
      experiences: [],
    };
    setCurrentPage(1);
    dispatch(
      getAllDoctorsListAction({
        ...lastFiltersForDrList,
        cityId: e,
        pageNumber: 1,
      })
    );
    const currentCityName = cities.cities.cities?.filter(
      (data) => data.cityId == e
    )[0];
    setCurrentCity(currentCityName?.name);
  };

  useEffect(() => {
    if (cities.cities.cities?.length) {
      let citiesD: any = [{ value: 0, label: t("all_cities")}];
      cities.cities.cities?.map((data1) => {
        const data = {
          label: data1.name,
          value: data1.cityId,
        };
        citiesD.push(data);
      });
      setSearchCities(citiesD);
    }
  }, [cities.cities.cities]);

  useEffect(() => {
    return () => {
      dispatch(clearData());
    };
  }, []);

  const onServiceChange = (e, serviceId) => {
    let curr = currentService;
    if (e) {
      curr = [...currentService, serviceId];
      setServiceChange((current) => [...current, serviceId]);
    } else {
      curr = currentService?.filter((data) => data !== serviceId);
      setServiceChange(curr);
    }
    setCurrentPage(1);
    dispatch(
      getAllDoctorsListAction({
        ...lastFiltersForDrList,
        pageNumber: 1,
        serviceTypes: curr.length ? curr.toString().split(",") : [],
      })
    );
  };

  const onSortingChange = (e) => {
    let sort = "";
    if (e == 2) {
      sort = "ASC";
    } else {
      sort = "DESC";
    }
    data = { ...data, pageNumber: 1, orderBy: sort };
    setCurrentPage(1);
    dispatch(
      getAllDoctorsListAction({
        ...lastFiltersForDrList,
        orderBy: sort,
        pageNumber: 1,
      })
    );
  };

  const onPageChange = (pageNo: number) => {
    setCurrentPage(pageNo);
    dispatch(
      getAllDoctorsListAction({ ...lastFiltersForDrList, pageNumber: pageNo })
    );
  };

  return (
    <>
      <FilterModel
        show={filtermodel}
        onHide={() => handleClosedet()}
        setServiceChange={setServiceChange}
        setCurrentPage={setCurrentPage}
      />
      {/* <Breadcrumbs /> */}

      <div className="CustContainer">
        <div className="doclist-title">
          {currentCity == "" ? (
            <></>
          ) : (
              <h1>{t("counsult_best_cardiologist")} {currentCity}</h1>
          )}
        </div>

        <div className="searchcitydoc-cover">
          <div className="searchbar-left">
            <TiLocation />
            <Select
              components={animatedComponents}
              classNamePrefix="react-select"
              className="react-select"
              defaultValue={
                searchCities?.find((x: any) => x.value === 0) || null
              }
              value={
                currentCity
                  ? searchCities?.find((x: any) => x.label === currentCity)
                  : searchCities?.find((x: any) => x.value === 0) || null
              }
              onChange={(e: any) => onCityChange(e.value)}
              options={searchCities}
              // defaultValue={searchCities[0]}
            />
            {/* <FloatingLabel controlId="floatingSelect" label='Search Cities/District'>
                            <Form.Select aria-label="Floating label select example" onChange={(e) => onCityChange(e.target.value)}>
                                {
                                    cities.cities.cities?.map((data) => (
                                        <>
                                            <option value={data.cityId}>{data.name}</option>
                                        </>
                                    ))
                                }
                            </Form.Select>
                        </FloatingLabel> */}
            <TiLocation />
            {/* <input type="text" placeholder='Search Cities/District' /> */}
          </div>
          <div className="searchbar-right">
            <BiSearch />
            <input
              type="text"
              value={offlineSearchString}
              placeholder={t("search_doctor")}
              onChange={(e) => setOfflineSearchString(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="CustContainer">
        <div className="filterbox-cover">
          <div className="sortby-filter">
            <BiSort />
            <p>{t("sort_by")}:</p>
            <div className="selectsortbycov">
              <Select
                components={animatedComponents}
                classNamePrefix="react-select"
                options={sortby}
                defaultValue={sortby[0]}
                onChange={(e: any) => onSortingChange(e.value)}
              />
            </div>
          </div>
          <div className="consult-filter">
            {["checkbox"].map((type: any) => (
              <div key={`inline-${type}`} className="custchbox-main">
                <div className="consultbox-set">
                  <Form.Check
                    inline
                    label={t("home_visit")}
                    name="group1"
                    type={type}
                    onClick={(e: any) => onServiceChange(e.target.checked, 1)}
                    id={`inline-${type}-1`}
                    checked={
                      currentService.find((x) => x.toString() === "1")
                        ? true
                        : false
                    }
                  />
                </div>
                <div className="consultbox-set">
                  <Form.Check
                    inline
                    label={t("vidio_consult")}
                    name="group1"
                    onClick={(e: any) => onServiceChange(e.target.checked, 2)}
                    type={type}
                    id={`inline-${type}-2`}
                    checked={
                      currentService.find((x) => x.toString() === "2")
                        ? true
                        : false
                    }
                  />
                </div>
                <div className="consultbox-set">
                  <Form.Check
                    inline
                    label={t('hospital_visit')}
                    name="group1"
                    type={type}
                    onClick={(e: any) => onServiceChange(e.target.checked, 3)}
                    id={`inline-${type}-3`}
                    checked={
                      currentService.find((x) => x.toString() === "3")
                        ? true
                        : false
                    }
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="filter-sec">
            <Button onClick={handleFiltermodel} variant="link">
              <FaFilter />
              {t("filetr")}
            </Button>
          </div>
        </div>
      </div>

      <div className="CustContainer">
        <DoctorsList
          offlineSearchString={offlineSearchString}
          setOfflineSearchString={setOfflineSearchString}
        />
        {totalRecords > PageSizeConstant && (
          <PaginationComp
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalRecords={totalRecords}
          />
        )}
      </div>

      <Appsection />
    </>
  );
}
