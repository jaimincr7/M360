import React, { useState } from "react";
import { Nav, Tab } from "react-bootstrap";
import AboutDoctor from "../../components/DoctorDetails/AboutDoctor";
import DoctorDetails from "../../components/DoctorDetails/DoctorDetails";
import DoctorOffer from "../../components/DoctorDetails/DoctorOffer";
import HospitalDoctor from "../../components/DoctorDetails/HospitalDoctor";
import PatientFeedback from "../../components/DoctorDetails/PatientFeedback";
import DateTimeSlot from "../../components/Common/DatetimeSlot";
import { Formik } from "formik";
import { useTranslate } from "../../commonModules/translate";

export default function Index() {
  const t = useTranslate();
  const [selectedServiceId, setSelectedServiceId] = useState();
  const initVal = {
    doctorServiceTypeId: "",
    daySlotDetail: {},
  };

  return (
    <div>
      {/* <Breadcrumbs /> */}
      <div className="CustContainer">
        <Formik
          initialValues={initVal}
          onSubmit={(values) => {
            console.log("formil values", values);
          }}
          enableReinitialize
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className="DoctordetailsCover">
                <div className="DoctordetailsLeft">
                  <DoctorDetails />

                  <Tab.Container
                    id="left-tabs-example"
                    defaultActiveKey="aboutme"
                  >
                    <div className="docheader-navset">
                      <div className="docheader-nav">
                        <Nav variant="pills">
                          <Nav.Item>
                            <Nav.Link eventKey="aboutme">
                              {t("about_me")}
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link eventKey="hospital">
                              {t("hospital")}
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link eventKey="feedback">
                              {t("patient_feedback")}
                            </Nav.Link>
                          </Nav.Item>
                        </Nav>
                      </div>
                    </div>
                    <Tab.Content>
                      <Tab.Pane eventKey="aboutme">
                        <AboutDoctor />
                      </Tab.Pane>
                      <Tab.Pane eventKey="hospital">
                        <HospitalDoctor />
                      </Tab.Pane>
                      <Tab.Pane eventKey="feedback">
                        <PatientFeedback />
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
                <div className="DoctordetailsRight">
                  <DateTimeSlot
                    onServiceTypeChange={(newSelectedServiceId) => {
                      setSelectedServiceId(newSelectedServiceId);
                    }}
                  />
                  {Number(selectedServiceId)>=0 && (
                    <DoctorOffer selectedServiceId={selectedServiceId} />
                  )}
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
