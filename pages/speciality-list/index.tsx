import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import CategoryCard from "../../components/Home/CategoryCard/CategoryCard";
import {
  getAllSpecialitiesListAction,
  specialitiesListSelector,
} from "../../store/specialitiesList/specialitiesListSlice";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { useTranslate } from "../../commonModules/translate";

export default function Specialitylist() {
  const dispatch = useAppDispatch();
  const t = useTranslate();
  const specialities = useAppSelector(specialitiesListSelector);
  const [specialitiesData, setSpecialities] = useState([]);

  useEffect(() => {
    dispatch(getAllSpecialitiesListAction());
  }, []);

  useEffect(() => {
    if (!!specialities && specialities.data.specialitiesList.length) {
      setSpecialities(specialities.data.specialitiesList);
    }
  }, [specialities.data.specialitiesList]);

  return (
    <>
      {/* <Breadcrumbs /> */}

      <div className="specialitymaiCov">
        <div className="CustContainer">
          <div className="specialitymaTitle">
            <h1>{t("speciality")}</h1>
          </div>
          <Row>
            <div className="specialitymaMain">
              {specialitiesData.map((data1: any) => (
                <>
                  <div className="specialitymaIner">
                    <CategoryCard
                      id={data1?.specialityId}
                      image={data1?.imagePath}
                      description={data1?.description}
                      name={data1?.name}
                      imagePath={data1?.imagePath}
                    />
                  </div>
                </>
              ))}
            </div>
          </Row>
        </div>
      </div>
    </>
  );
}
