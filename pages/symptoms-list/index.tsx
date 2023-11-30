import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import SymptomsCard from "../../components/Common/Cards/symptoms/SymptomsCard";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import {
  getAllSymptomsListAction,
  symptomsListSelector,
} from "../../store/symptomsList/symptomsListSlice";
import { useTranslate } from "../../commonModules/translate";

export default function SymptomsList() {
  const dispatch = useAppDispatch();
  const t=useTranslate()
  const symptoms = useAppSelector(symptomsListSelector);
  const [symptomsData, setSymptoms] = useState([]);

  useEffect(() => {
    dispatch(getAllSymptomsListAction());
  }, []);

  useEffect(() => {
    if (!!symptoms && symptoms.data.symptomsList.length) {
      setSymptoms(symptoms.data.symptomsList);
    }
  }, [symptoms.data.symptomsList]);

  return (
    <>
      {/* <Breadcrumbs /> */}

      <div className="SymptomsCov">
        <div className="CustContainer">
          <div className="SymptomsTitle">
            <h1>{t("Symptoms")}</h1>
          </div>
          <Row>
            <div className="SymptomsMain">
              {symptomsData.map((data1: any) => (
                <>
                  <div className="SymptomsIner">
                    <SymptomsCard
                      id={data1?.symptomId}
                      image={data1?.imagePath}
                      key={data1.symptomId}
                      name={data1.name}
                      description={data1.description}
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
