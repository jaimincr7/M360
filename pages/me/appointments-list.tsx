import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { CURRENT_USER } from "../../commonModules/localStorege";
import NoRecordsFound from "../../components/NoRecordsFound";
import UserProfileLayout from "../../layouts/userProfileLayout";
import {
  appointmentStateSelector,
  getAllAppointmentAction,
} from "../../store/user/appointmentSlice";
import {
  AppointmentListType,
  AppointmentStatus,
  FeedbackSortingType,
} from "../../utils/constant";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import AddInsuranceDetail from "../../components/Appointment/AddInsuranceDetail";
import { useTranslate } from "../../commonModules/translate";
function AppointmentList() {
  const animatedComponents = makeAnimated();
  const dispatch = useAppDispatch();
  const currentUser = CURRENT_USER();
  const appointmentState: any = useAppSelector(appointmentStateSelector);
  const router = useRouter();

  const t = useTranslate();

  const [currentListType, setCurrentListType] = useState<number>(
    AppointmentListType.Upcoming
  );
  const [showInsuranceDetail, setShowInsuranceDetail] = useState<{
    record: any;
    show: boolean;
  }>({
    record: null,
    show: false,
  });
  const [feedbackSortingTypeVal, setFeedbackSortingTypeVal] = useState<number>(
    FeedbackSortingType[0].value
  );

  useEffect(() => {
    if (router.isReady) {
      dispatch(
        getAllAppointmentAction({
          userId: currentUser.userId,
          mobileAppointmentSortingType: currentListType,
          feedbackSortingType: feedbackSortingTypeVal,
        })
      );
    }
  }, [router.isReady, currentListType, feedbackSortingTypeVal]);

  const getAptStatusClass = (status: number) => {
    switch (status) {
      case 4:
        return "BookedStatuscl";
      case 10:
        return "CompletedStatuscl";
      case 2:
      case 3:
      case 5:
        return "CancelledStatuscl";
    }
  };

  return (
    <>
      <div className="AppointmentListCov">
        <div className="AppottListTitle">
          <div className="AppottListTitLeft">
            <ul>
              <li
                className={
                  currentListType === AppointmentListType.Upcoming
                    ? "active"
                    : ""
                }
              >
                <a
                  href="javascript:;"
                  onClick={() => {
                    setCurrentListType(AppointmentListType.Upcoming);
                  }}
                >
                  {t("upcoming_appointment")}
                </a>
              </li>
              <li
                className={
                  currentListType === AppointmentListType.Past ? "active" : ""
                }
              >
                <a
                  href="javascript:;"
                  onClick={() => {
                    setCurrentListType(AppointmentListType.Past);
                  }}
                >
                  {t("past_appointment")}
                </a>
              </li>
            </ul>
          </div>
          <div className="AppottListTitRight">
            <Select
              components={animatedComponents}
              classNamePrefix="react-select"
              options={FeedbackSortingType.map(i => ({ ...i, label: t(i.label) }))}
              value={{
                ...FeedbackSortingType.find(
                  (x) => x.value === feedbackSortingTypeVal
                ), label: t(FeedbackSortingType.find(
                  (x) => x.value === feedbackSortingTypeVal
                ).label)
              }}
              onChange={(opt: any) => setFeedbackSortingTypeVal(opt.value)}
            />
          </div>
        </div>
        <div className="AppontdataList maxHeight">
          {appointmentState?.data?.appointment?.appointments?.length > 0 ? (
            <>
              {appointmentState?.data?.appointment?.appointments?.map(
                (itm: any, i: number) => {
                  const {
                    appointmentDateTime,
                    doctorName,
                    specialities,
                    serviceType,
                    appointmentStatus,
                    isFollowup,
                    appointmentId,
                    appointmentNumber,
                  } = itm;
                  const momentAptDateTime = moment(appointmentDateTime);
                  return (
                    <div
                      className="AppointmentListtbl"
                      key={"appointment-table-row-" + i}
                    >
                      <div className="AppointIDfolupbox">
                        <h6>{appointmentNumber}</h6>
                        {isFollowup && <span>{t("follow_up")}</span>}
                      </div>
                      {/* <div className='DateAppointbox'>
                                <h3><span>{momentAptDateTime.format('DD')}</span> <br /> {momentAptDateTime.format('MMM, yyyy')}</h3>
                            </div> */}
                      <div className="NameptAppointbox">
                        <p>
                          {doctorName}, {specialities}
                        </p>
                      </div>
                      <div className="TimeAppointbox">
                        <p>{momentAptDateTime.format("dddd, hh:mm A")}</p>
                      </div>
                      <div className="ServiceListapointBox">
                        <p
                          className={
                            serviceType?.toString()?.replace(" ", "") + "apoint"
                          }
                        >
                          {serviceType}
                        </p>
                      </div>
                      <div className="StatusAppointbox">
                        <span className={getAptStatusClass(appointmentStatus)}>
                          {AppointmentStatus[appointmentStatus]}
                        </span>
                      </div>
                      <div className="ActionAppointbox">
                        <Dropdown
                          className="TableAppointDeormnav"
                          autoClose="outside"
                        >
                          <Dropdown.Toggle id="dropdown-autoclose-outside">
                            {t("view_details")}
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="TableAppotDeormLink">
                            <Dropdown.Item
                              onClick={() => {
                                router.push(
                                  `/me/appointment/details/${appointmentId}`
                                );
                              }}
                            >
                              {t("view_detail")}
                            </Dropdown.Item>

                            {AppointmentStatus[appointmentStatus] !==
                              AppointmentStatus[5] && (
                                <>
                                  <hr />
                                  <Dropdown.Item
                                    onClick={() => {
                                      if (!itm?.isClaimDone) {
                                        setShowInsuranceDetail({
                                          record: itm,
                                          show: true,
                                        });
                                      }
                                    }}
                                  >
                                    {itm?.isClaimDone
                                      ? t("insurance_claimed")
                                      : t("CalimInsurence")}
                                  </Dropdown.Item>
                                </>
                              )}
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  );
                }
              )}
            </>
          ) : (
            <NoRecordsFound />
          )}
        </div>
      </div>
      {showInsuranceDetail.show && (
        <AddInsuranceDetail
          doctorId={showInsuranceDetail.record?.doctorId}
          show={showInsuranceDetail.show}
          onHide={() => {
            setShowInsuranceDetail({
              record: null,
              show: false,
            });
            dispatch(
              getAllAppointmentAction({
                userId: currentUser.userId,
                mobileAppointmentSortingType: currentListType,
                feedbackSortingType: feedbackSortingTypeVal,
              })
            );
          }}
          appointmentId={showInsuranceDetail.record?.appointmentId}
        />
      )}
    </>
  );
}

AppointmentList.PageLayout = UserProfileLayout;
export default AppointmentList;
