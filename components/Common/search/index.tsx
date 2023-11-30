import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import {
  customSelector,
  getGlobalSearch,
} from "../../../store/custom/customSlice";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { Typeahead } from "react-bootstrap-typeahead";
import { useRouter } from "next/router";
import { GlobalSearchType } from "../../../utils/constant";
import { useTranslate } from "../../../commonModules/translate";

function Index() {
  let keywordSearchTimer: any = null;
  const dispatch = useAppDispatch();
  const t = useTranslate();
  const [globalKeywords, setGlobalKeywords] = useState([]);
  const custom = useAppSelector(customSelector);
  const router = useRouter();

  const onSearch = (e) => {
    if (e !== "" && e !== null) {
      if (keywordSearchTimer) {
        clearTimeout(keywordSearchTimer);
      }
      keywordSearchTimer = setTimeout(() => {
        const data = {
          searchText: e,
        };
        dispatch(getGlobalSearch(data));
      }, 1000);
    } else {
      setGlobalKeywords([]);
    }
  };

  useEffect(() => {
    if (custom.globalSearch.data.length > 0) {
      setGlobalKeywords(custom.globalSearch.data);
    }
  }, [custom.globalSearch.data]);

  const handleSearchClick = (searchObj: any) => {
    const type = searchObj?.type?.toString()?.toLowerCase();
    const id = searchObj?.id;
    const typeId = searchObj?.typeId?.toString();
    if (type === "doctor" || typeId === GlobalSearchType.Doctor) {
      router.push(`/doctor-details/${id}`);
      setGlobalKeywords([]);
    } else if (type === "symptoms" || typeId === GlobalSearchType.Symptom) {
      router.push(`/doctor-list?symptomId=${id}`);
      setGlobalKeywords([]);
    } else if (
      type === "speciality" ||
      typeId === GlobalSearchType.Speciality
    ) {
      router.push(`/doctor-list?specialityId=${id}`);
      setGlobalKeywords([]);
    }
  };

  return (
    <>
      <div className="searchbar-set">
        <BiSearch />
        <Typeahead
          id="basic-typeahead-single"
          labelKey="name"
          onInputChange={(e) => {
            onSearch(e);
          }}
          onChange={(e) => (e.length ? handleSearchClick(e[0]) : null)}
          options={globalKeywords}
          placeholder={t("search_view_heading")}
          selected={[]}
        />
      </div>
    </>
  );
}

export default Index;
