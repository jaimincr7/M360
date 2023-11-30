import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { specialitiesListSelector } from "../../../store/specialitiesList/specialitiesListSlice";
import { symptomsListSelector } from "../../../store/symptomsList/symptomsListSlice";
import { hospitalsListSelector } from "../../../store/hospitalsList/hospitalsListSlice";
import {
  IFilterDoctors,
  myLoader,
} from "../../../commonModules/commonInterfaces";
import {
  getAllDoctorsListAction,
  lastFiltersForDrList,
} from "../../../store/doctorList/doctorListSlice";
import { customSelector } from "../../../store/custom/customSlice";
import { useRouter } from "next/router";
import { PageSizeConstant } from "../../pagination";
import { useTranslate } from "../../../commonModules/translate";

export default function FilterModel(props: {
  show: boolean;
  onHide: any;
  setServiceChange: (val: number[]) => void;
  setCurrentPage: (val: number) => void;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const t = useTranslate();
  const appliedFilters: any = useRef(null);

  const specialities = useAppSelector(specialitiesListSelector);
  const hospitals = useAppSelector(hospitalsListSelector);
  const symptoms = useAppSelector(symptomsListSelector);
  const language = useAppSelector(customSelector);
  const {promoCodeId}=router.query;

  const [specialitiesData, setSpecialities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hospitalsData, setHospitals] = useState([]);
  const [symptomsData, setSymptoms] = useState([]);
  const [languagesData, setLanguages] = useState([]);
  const [gender, setGender] = useState<string[]>([]);
  const [experience, setExperience] = useState<string[]>([]);
  const [symptomIds, setSymptomIds] = useState<number[]>([]);
  const [hospitalIds, setHospitalIds] = useState<number[]>([]);
  const [specialityIds, setSpecialityIds] = useState<number[]>([]);
  const [languageIds, setLanguageIds] = useState<number[]>([]);

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

  const clearSelectedData = () => {
    setHospitalIds([]);
    setExperience([]);
    setGender([]);
    setLanguageIds([]);
    setSpecialityIds([]);
    setSymptomIds([]);
  };

  const onClear = () => {
    data = {
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
      promoCodeId:null
    };
    clearSelectedData();
    appliedFilters.current = null;
    dispatch(getAllDoctorsListAction(data));
    props.setCurrentPage(1);
    props.onHide();
  };

  useEffect(() => {
    if (props.show && appliedFilters.current) {
      setHospitalIds(appliedFilters.current?.hospitalIds);
      setExperience(appliedFilters.current?.experience);
      setGender(appliedFilters.current?.gender);
      setLanguageIds(appliedFilters.current?.languageIds);
      setSpecialityIds(appliedFilters.current?.specialityIds);
      setSymptomIds(appliedFilters.current?.symptomIds);
    }
  }, [props.show]);

  useEffect(() => {
    if (router.isReady) {
      if (Object.keys(router.query).length > 0) {
        const key = Object.keys(router.query);
        if (key[0] == "servicetype") {
          const currentServiceType = router.query[key[0]];
          data = {
            ...data,
            serviceTypes: [router.query[key[0]]?.toString() || ""],
          };
          if (currentServiceType) {
            props.setServiceChange([+currentServiceType]);
          }
        }
        if (key[0] == "specialityId") {
          data = {
            ...data,
            specialities: [router.query[key[0]]?.toString() || ""],
          };
          setSpecialityIds([Number(router.query[key[0]])]);
        }
        if (key[0] == "symptomId") {
          data = {
            ...data,
            symptoms: [router.query[key[0]]?.toString() || ""],
          };
          setSymptomIds([Number(router.query[key[0]])]);
        }
        if (key[0] == "hospitalId") {
          data = {
            ...data,
            hospitals: [router.query[key[0]]?.toString() || ""],
          };
          setHospitalIds([Number(router.query[key[0]])]);
        }
        if (key[0] == "cityId") {
          data = {
            ...data,
            cityId: Number(router.query[key[0]]),
          };
        }
        if (key[0] == "promoCodeId") {
          data = {
            ...data,
            promoCodeId: Number(router.query[key[0]]),
          };
        }
      }
      dispatch(getAllDoctorsListAction({ ...data, pageNumber: 1 }));
      props.setCurrentPage(1);
    }
  }, [router.query]);

  useEffect(() => {
    if (!!specialities && specialities.data.specialitiesList.length) {
      setSpecialities(specialities.data.specialitiesList);
    }
  }, [specialities.data.specialitiesList]);

  useEffect(() => {
    if (!!hospitals && hospitals.breifdata.hospitalsBreifList.length) {
      setHospitals(hospitals.breifdata.hospitalsBreifList);
    }
  }, [hospitals.breifdata.hospitalsBreifList]);

  useEffect(() => {
    if (!!symptoms && symptoms.data.symptomsList.length) {
      setSymptoms(symptoms.data.symptomsList);
    }
  }, [symptoms.data.symptomsList]);

  useEffect(() => {
    if (!!language && language.language.language.length) {
      setLanguages(language.language.language);
    }
  }, [language.language.language]);

  const onFilterSubmit = () => {
    data = {
      cityId: lastFiltersForDrList.cityId,
      pageNumber: 1,
      pageSize: PageSizeConstant,
      gender: gender.length ? gender : [],
      orderBy: lastFiltersForDrList.orderBy,
      doctorId: 0,
      hospitals: hospitalIds.length ? hospitalIds.toString().split(",") : [],
      languages: languageIds.length ? languageIds.toString().split(",") : [],
      specialities: specialityIds.length
        ? specialityIds.toString().split(",")
        : [],
      symptoms: symptomIds.length ? symptomIds.toString().split(",") : [],
      serviceTypes: [],
      experiences: experience.length ? experience : [],
    };
    if(promoCodeId){
      data.promoCodeId=Number(promoCodeId)
    }
    appliedFilters.current = {
      hospitalIds,
      experience,
      gender,
      languageIds,
      specialityIds,
      symptomIds,
    };
    setIsLoading(true);
    props.setCurrentPage(1);
    dispatch(getAllDoctorsListAction(data)).finally(() => {
      setIsLoading(false);
    });
    props.onHide();
  };

  const onSymptomIdsChange = (e, id: number) => {
    if (e) {
      setSymptomIds((current) => [...current, id]);
    } else {
      const filteredArray = symptomIds.filter((dataIds) => dataIds !== id);
      setSymptomIds(filteredArray);
    }
  };

  const onHospitalIdsChange = (id: number) => {
    if (hospitalIds.includes(id)) {
      const filteredArray = hospitalIds.filter((dataIds) => dataIds !== id);
      setHospitalIds(filteredArray);
    } else {
      setHospitalIds((current) => [...current, id]);
    }
  };

  const onGenderChange = (e, id: string) => {
    if (e) {
      setGender([id]);
    } else {
      const filteredArray = gender.filter((dataIds) => dataIds !== id);
      setGender(filteredArray);
    }
  };

  const onExperienceChange = (e, id: string) => {
    if (e) {
      setExperience((current) => [...current, id]);
    } else {
      const filteredArray = experience.filter((dataIds) => dataIds !== id);
      setExperience(filteredArray);
    }
  };

  const onSpecialityIdsChange = (e, id: number) => {
    if (e) {
      setSpecialityIds((current) => [...current, id]);
    } else {
      const filteredArray = specialityIds.filter((dataIds) => dataIds !== id);
      setSpecialityIds(filteredArray);
    }
  };

  const onLanguageIdsChange = (e, id: number) => {
    if (e) {
      setLanguageIds((current) => [...current, id]);
    } else {
      const filteredArray = languageIds.filter((dataIds) => dataIds !== id);
      setLanguageIds(filteredArray);
    }
  };

  return (
    <Modal
      show={props.show}
      backdrop="static"
      keyboard={false}
      centered
      dialogClassName="modal-lg filtermodel-cover"
      className="mainmodalfltcov"
      onHide={() => {
        props.onHide();
        clearSelectedData();
      }}
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <Tab.Container id="left-tabs-example" defaultActiveKey="hospital">
          <div className="tabnavbar-set">
            <Nav variant="pills">
              <Nav.Item>
                <Nav.Link eventKey="hospital">{t("hospital_group")}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="experience">{t("Experience")}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="gender">{t("gender")}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="language">{t("language")}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="speciality">{t('speciality')}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="symptoms">{t("Symptoms")}</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <Tab.Content>
            <Tab.Pane eventKey="hospital">
              <div className="hospitallist-cover">
                <div className="hospitallistHeightbox">
                  {hospitalsData.map((hspd: any) => (
                    <>
                      <div
                        className="hospitaldet-set cursorPointer"
                        onClick={(e: any) =>
                          onHospitalIdsChange(hspd.hospitalId)
                        }
                      >
                        <div className="hospitaldet-cover">
                          <Form.Check
                            inline
                            name="group1"
                            type={"checkbox"}
                            checked={hospitalIds.includes(hspd.hospitalId)}
                          />
                          {hspd.imagePath && (
                            <Image
                              src={hspd.imagePath}
                              loader={myLoader}
                              height={100}
                              width={100}
                              alt="Hospitallogo"
                            />
                          )}
                          <p>{hspd.name}</p>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
                <div className="applyfilter-cover">
                  <Button className="clearfilter" onClick={onClear}>
                    {t("clear_filters")}
                  </Button>
                  <Button
                    className="applyfilter"
                    onClick={onFilterSubmit}
                    disabled={isLoading}
                  >
                    {t("apply_filters")}
                  </Button>
                </div>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="experience">
              <div className="experience-filter">
                {["checkbox"].map((type: any) => (
                  <div key={`inline-${type}`} className="custchbox-main">
                    <div className="experiencedet-set">
                      <Form.Check
                        inline
                        label={`0 - 5 ${t("years")}`}
                        name="group1"
                        type={type}
                        onClick={(e: any) =>
                          onExperienceChange(e.target.checked, "0-5")
                        }
                        id={`inline-${type}-1-0 - 5`}
                        checked={experience.includes("0-5")}
                      />
                    </div>
                    <div className="experiencedet-set">
                      <Form.Check
                        inline
                        label={`6 - 10 ${t("years")}`}
                        name="group1"
                        type={type}
                        onClick={(e: any) =>
                          onExperienceChange(e.target.checked, "6-10")
                        }
                        id={`inline-${type}-2-6 - 10`}
                        checked={experience.includes("6-10")}
                      />
                    </div>
                    <div className="experiencedet-set">
                      <Form.Check
                        inline
                        label={`11 - 15 ${t("years")}`}
                        name="group1"
                        type={type}
                        onClick={(e: any) =>
                          onExperienceChange(e.target.checked, "11-15")
                        }
                        id={`inline-${type}-3-11 - 15`}
                        checked={experience.includes("11-15")}
                      />
                    </div>
                    <div className="experiencedet-set">
                      <Form.Check
                        inline
                        label={`16+ ${t("years")}`}
                        name="group1"
                        type={type}
                        onClick={(e: any) =>
                          onExperienceChange(e.target.checked, "16")
                        }
                        id={`inline-${type}-4-16+`}
                        checked={experience.includes("16")}
                      />
                    </div>
                  </div>
                ))}

                <div className="applyfilter-cover">
                  <Button className="clearfilter" onClick={onClear}>
                    {t("clear_filters")}
                  </Button>
                  <Button
                    className="applyfilter"
                    onClick={onFilterSubmit}
                    disabled={isLoading}
                  >
                    {t("apply_filters")}
                  </Button>
                </div>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="gender">
              <div className="experience-filter">
                {["radio"].map((type: any) => (
                  <div key={`inline-${type}`} className="custchbox-main">
                    <div className="experiencedet-set">
                      <Form.Check
                        inline
                        label={t("Male")}
                        name="group1"
                        type={type}
                        onClick={(e: any) =>
                          onGenderChange(e.target.checked, "M")
                        }
                        id={`inline-${type}-Male-1`}
                        checked={gender.includes("M")}
                      />
                    </div>
                    <div className="experiencedet-set">
                      <Form.Check
                        inline
                        label={t("Female")}
                        name="group1"
                        type={type}
                        onClick={(e: any) =>
                          onGenderChange(e.target.checked, "F")
                        }
                        id={`inline-${type}-Female-2`}
                        checked={gender.includes("F")}
                      />
                    </div>
                  </div>
                ))}
                <div className="applyfilter-cover">
                  <Button className="clearfilter" onClick={onClear}>
                    {t("clear_filters")}
                  </Button>
                  <Button
                    className="applyfilter"
                    onClick={onFilterSubmit}
                    disabled={isLoading}
                  >
                    {t("apply_filters")}
                  </Button>
                </div>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="language">
              <div className="experience-filter">
                {["checkbox"].map((type: any) => (
                  <div key={`inline-${type}`} className="custchbox-main">
                    {languagesData.map((lngd: any) => (
                      <>
                        <div className="experiencedet-set">
                          <Form.Check
                            inline
                            label={lngd.name}
                            type={type}
                            onClick={(e: any) =>
                              onLanguageIdsChange(
                                e.target.checked,
                                lngd.languageId
                              )
                            }
                            id={`inline-lang-${type}-${lngd.languageId}-1`}
                            checked={languageIds.includes(lngd.languageId)}
                          />
                        </div>
                      </>
                    ))}
                  </div>
                ))}
                <div className="applyfilter-cover">
                  <Button className="clearfilter" onClick={onClear}>
                    {t("clear_filters")}
                  </Button>
                  <Button
                    className="applyfilter"
                    onClick={onFilterSubmit}
                    disabled={isLoading}
                  >
                    {t("apply_filters")}
                  </Button>
                </div>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="speciality">
              <div className="experience-filter">
                {["checkbox"].map((type: any) => (
                  <div key={`inline-${type}`} className="custchbox-main">
                    {specialitiesData.map((spd: any) => (
                      <>
                        <div className="experiencedet-set">
                          <Form.Check
                            inline
                            label={spd.name}
                            type={type}
                            onClick={(e: any) =>
                              onSpecialityIdsChange(
                                e.target.checked,
                                spd.specialityId
                              )
                            }
                            id={`inline-speciality-${spd.name}-${type}-1`}
                            checked={specialityIds.includes(spd.specialityId)}
                          />
                        </div>
                      </>
                    ))}
                  </div>
                ))}
                <div className="applyfilter-cover">
                  <Button className="clearfilter" onClick={onClear}>
                    {t("clear_filters")}
                  </Button>
                  <Button
                    className="applyfilter"
                    onClick={onFilterSubmit}
                    disabled={isLoading}
                  >
                    {t("apply_filters")}
                  </Button>
                </div>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="symptoms">
              <Form>
                <Form.Group className="m-0" controlId="trialValueCheck">
                  <div className="experience-filter">
                    {["checkbox"].map((type: any) => (
                      <div key={`inline-${type}`} className="custchbox-main">
                        {symptomsData.map((smd: any) => (
                          <>
                            <div className="experiencedet-set">
                              <Form.Check
                                inline
                                label={smd.name}
                                type={type}
                                onClick={(e: any) =>
                                  onSymptomIdsChange(
                                    e.target.checked,
                                    smd.symptomId
                                  )
                                }
                                id={`inline-symptoms-${smd.name}-${type}-1`}
                                checked={symptomIds.includes(smd.symptomId)}
                              />
                            </div>
                          </>
                        ))}
                      </div>
                    ))}
                    <div className="applyfilter-cover">
                      <Button className="clearfilter" onClick={onClear}>
                        {t("clear_filters")}
                      </Button>
                      <Button
                        className="applyfilter"
                        onClick={onFilterSubmit}
                        disabled={isLoading}
                      >
                        {t("apply_filters")}
                      </Button>
                    </div>
                  </div>
                </Form.Group>
              </Form>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
}
