import React, { useEffect, useRef, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { HiLocationMarker } from "react-icons/hi";
import { GrLanguage } from "react-icons/gr";
import { MdVerified } from "react-icons/md";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import Image from "next/image";
import { Button, Spinner } from "react-bootstrap";
import { Doclist1, Doclist2, Doclist3 } from "../../public/assets";
import Bookappmodel from "../Common/Model/bookappointment/bookappmodel";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { doctorListSelector } from "../../store/doctorList/doctorListSlice";
import {
  getDoctorsDetailsAction
} from "../../store/doctorDetails/doctorDetailsSlice";
import { myLoader } from "../../commonModules/commonInterfaces";
import Link from "next/link";
import LoadingSpinner from "../Common/LoadingSpinner";
import { useTranslate } from "../../commonModules/translate";

function DoctorsList({ offlineSearchString, setOfflineSearchString }: any) {
  const dispatch = useAppDispatch();
  const offlineSearchTimeOutRef = useRef(null);
  const t = useTranslate();

  const doctors = useAppSelector(doctorListSelector);

  const [bookappmodel, setShowftr] = useState(false);
  const [selectedDrId, setSelectedDrId] = useState(0);
  const [records, setRecords] = useState([]);
  const handleBookappmodel = () => setShowftr(true);
  const handleClosedet = () => setShowftr(false);

  useEffect(() => {
    if (doctors.data.doctorsList) {
      setRecords(doctors.data.doctorsList);
    }
    setOfflineSearchString("");
  }, [doctors?.data?.doctorsList]);

  useEffect(() => {
    if (doctors?.data?.doctorsList?.length) {
      if (offlineSearchTimeOutRef.current) {
        clearTimeout(offlineSearchTimeOutRef.current);
      }
      offlineSearchTimeOutRef.current = setTimeout(() => {
        if (offlineSearchString) {
          const compareString = trimAndLower(offlineSearchString);
          const newData = doctors.data.doctorsList?.filter(
            (x: any) =>
              trimAndLower(x.displayName)?.includes(compareString) ||
              trimAndLower(x.languages)?.includes(compareString) ||
              trimAndLower(x.city)?.includes(compareString) ||
              trimAndLower(x.specialities)?.includes(compareString) ||
              trimAndLower(x.yearsOfExperience)?.includes(compareString)
          );
          setRecords(newData);
        } else {
          setRecords(doctors?.data?.doctorsList);
        }
      }, 1000);
    }
  }, [offlineSearchString]);

  const trimAndLower = (str: String) => {
    return str?.toString()?.toLowerCase()?.trim();
  };
  return (
    <div>
      {bookappmodel && (
        <Bookappmodel
          show={bookappmodel}
          selectedDrId={selectedDrId}
          onHide={() => {
            handleClosedet();
            setSelectedDrId(0);
          }}
        />
      )}

      <div className="doctorlist-cover">
        {doctors.status === "loading" ? (
          <LoadingSpinner />
        ) : (
          <div className="row">
            {records?.length ? (
              records?.map((dctr: any) => (
                <>
                  <div className="col-lg-4 col-md-6">
                    <div className="docdetlist-cover">
                      <div className="docdetlist-set">
                        <div className="docdetname-set">
                          <Image
                            src={dctr?.photoPath ? dctr?.photoPath : Doclist1}
                            width={"0"}
                            height={"0"}
                            loader={myLoader}
                            alt="Doclist"
                          />
                          <div className="docnameexp-set">
                            <h5>{dctr.displayName}</h5>
                            <p>{dctr.specialities?.toString()}</p>
                            <h4>{dctr.yearsOfExperience} {t("years_of_exp")}</h4>
                            <div className="docrate-set">
                              {Array.from(
                                Array(parseInt(dctr.averageRating, 10)),
                                (element, index) => {
                                  return <AiFillStar key={index} />;
                                }
                              )}
                              <span>({dctr.totalRatings})</span>
                            </div>
                            <h6>
                              <HiLocationMarker />
                              {dctr.city}
                            </h6>
                          </div>
                        </div>
                        <div className="doclang-set">
                          {dctr?.languages ? (
                            <p>
                              <GrLanguage />
                              {dctr.languages?.toString() + " "}
                            </p>
                          ) : (
                            <p>
                              <GrLanguage />
                              English
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="viewprobookap-btn">
                        <Button className="viewpro-btn">
                          <Link href={`/doctor-details/${dctr.doctorId}`}>
                            {t("view_profile")}
                          </Link>
                        </Button>
                        <Button
                          className="bookapp-btn"
                          onClick={() => {
                            handleBookappmodel();
                            setSelectedDrId(dctr.doctorId);
                            dispatch(getDoctorsDetailsAction(dctr.doctorId));
                          }}
                          variant="link"
                        >
                          {t('book_appointment')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ))
            ) : (
              <div className="mx-3">{t("no_dr_available")}</div>
            )}
          </div>
        )}

        {/* <div className="paginationlist-cover">
                        <div className="totalpaglist-set">
                            <p>Showing 1 to 12 of 84 entries</p>
                        </div>
                        <div className="pagelistnum-set">
                            <ul>
                                <li><a href="javasript:;"><BiChevronLeft /></a></li>
                                <li><a href="javasript:;" className='pageactive'>1</a></li>
                                <li><a href="javasript:;">2</a></li>
                                <li><a href="javasript:;">3</a></li>
                                <li><a href="javasript:;">4</a></li>
                                <li><a href="javasript:;">5</a></li>
                                <li><a href="javasript:;"><BiChevronRight /></a></li>
                            </ul>
                        </div>
                    </div> */}
      </div>
    </div>
  );
}

export default DoctorsList;
