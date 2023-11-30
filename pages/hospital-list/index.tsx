import React, { useEffect, useState } from "react";
import { TiLocation } from "react-icons/ti";
import { IoIosArrowDown } from "react-icons/io";
import { BiSearch } from "react-icons/bi";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { FloatingLabel, Form, Pagination, Row } from "react-bootstrap";
import Appsection from "../../components/Common/Appsection/appsection";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import HospitalCard from "../../components/Common/Cards/hospitalcard/HospitalCard";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import {
  getAllHospitalsListAction,
  hospitalsListSelector,
} from "../../store/hospitalsList/hospitalsListSlice";
import { customSelector, getAllCities } from "../../store/custom/customSlice";
import { useRouter } from "next/router";
import PaginationComp, { PageSizeConstant } from "../../components/pagination";
import { useTranslate } from "../../commonModules/translate";

export default function HospitalList() {
  const t = useTranslate();
  const router = useRouter();
  const hospital = useAppSelector(hospitalsListSelector);
  const cities = useAppSelector(customSelector);
  const [hospitals, setHospitals] = useState<any>([]);
  const [searchCities, setSearchCities] = useState<any>([]);
  const [currentCity, setCurrentCity] = useState<any>("");
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [filters, setFilters] = useState<{
    cityId: number | null;
    searchString: string;
    pageNumber: number;
    pageSize: number;
  }>({
    cityId: null,
    searchString: "",
    pageNumber: 1,
    pageSize: PageSizeConstant,
  });
  const dispatch = useAppDispatch();
  let keywordSearchTimer: any = null;

  const animatedComponents = makeAnimated();
  useEffect(() => {
    if (!!hospital && hospital.data.hospitalsList) {
      setHospitals(hospital.data.hospitalsList);
    }
  }, [hospital.data.hospitalsList]);

  useEffect(() => {
    setTotalRecords(hospital.data.pagination?.totalRecords);
  }, [hospital.data.pagination?.totalRecords]);

  useEffect(() => {
    dispatch(getAllCities());
  }, []);

  useEffect(() => {
    if (filters) {
      let payloadData: any = {};
      const { cityId, searchString, pageNumber, pageSize } = filters;
      if (cityId) {
        payloadData.cityId = cityId;
      }
      if (searchString) {
        payloadData.search = searchString;
      }
      if (pageNumber) {
        payloadData.pageNumber = pageNumber;
      }
      if (pageSize) {
        payloadData.pageSize = pageSize;
      }
      dispatch(getAllHospitalsListAction(payloadData));
    } else {
      dispatch(getAllHospitalsListAction({}));
    }
  }, [filters]);

  useEffect(() => {
    if (cities.cities.cities?.length) {
      let citiesD: any = [];
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

  const onHospitalFilter = (id: number) => {
    router.push({
      pathname: "/doctor-list",
      query: { hospitalId: id },
    });
  };

  const onCityChange = (e) => {
    const currentCityName = cities.cities.cities?.filter(
      (data) => data.cityId == e
    )[0];
    setCurrentCity(currentCityName.name);
    setFilters({ ...filters, cityId: e });
  };

  const onSearch = (e) => {
    if (keywordSearchTimer) {
      clearTimeout(keywordSearchTimer);
    }
    keywordSearchTimer = setTimeout(() => {
      setFilters({ ...filters, pageNumber: 1, searchString: e });
    }, 1000);
  };

  const onPageChange = (pageNo: number) => {
    setFilters({ ...filters, pageNumber: pageNo });
  };

  return (
    <>
      {/* <Breadcrumbs /> */}

      <div className="CustContainer">
        <div className="doclist-title">
          {currentCity == "" ? (
            <></>
          ) : (
              <h1>{t("counsult_best_hospital")} {currentCity}</h1>
          )}
        </div>

        <div className="searchcitydoc-cover">
          <div className="searchbar-left">
            <Select
              components={animatedComponents}
              classNamePrefix="react-select"
              className="react-select"
              onChange={(e: any) => onCityChange(e.value)}
              options={searchCities}
              // defaultValue={searchCities[0]}
            />
            <TiLocation />
          </div>
          <div className="searchbar-right">
            <BiSearch />
            <input
              type="text"
              placeholder={t("search_hospital")}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="CustContainer">
        <div className="ListHospitdataCov">
          {hospitals?.map((hsp: any) => (
            <div
              className="ListHospitdataIner"
              key={hsp.hospitalId}
              onClick={() => {
                onHospitalFilter(hsp?.hospitalId);
              }}
            >
              <HospitalCard
                name={hsp?.name}
                city={hsp?.city}
                doctorCount={hsp?.doctorCount}
                image={hsp?.imagePath}
              />
            </div>
          ))}

          {totalRecords > PageSizeConstant && (
            <PaginationComp
              totalRecords={totalRecords}
              currentPage={filters?.pageNumber}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>

      <Appsection />
    </>
  );
}
