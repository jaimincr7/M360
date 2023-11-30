import React, { useEffect, useState } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { FaHospitalAlt } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";
import { Hospitallist1, Hospitallist2 } from "../../public/assets";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import {
  doctorDetailsSelector,
  getDoctorHospitalAction,
} from "../../store/doctorDetails/doctorDetailsSlice";
import { useRouter } from "next/router";
import { useTranslate } from "../../commonModules/translate";

export default function HospitalDoctor() {
  const router = useRouter();
  const doctorDetails = useAppSelector(doctorDetailsSelector);
  const [doctor, setDoctor] = useState([]);
  const dispatch = useAppDispatch();

  const t = useTranslate();

  useEffect(() => {
    if (router.isReady) {
      const { doctorId }: { doctorId?: number } = router.query;
      dispatch(getDoctorHospitalAction(doctorId as number));
    }
  }, [router.isReady]);

  useEffect(() => {
    setDoctor(doctorDetails.doctorHospital?.doctorHospital);
  }, [doctorDetails.doctorHospital.doctorHospital]);

  return (
    <>
      <div className="hospitaltab-list">
        {doctor?.length > 0 &&
          doctor?.map((dctr: any) => (
            <>
              <div className="hospitaldet-tab">
                <div className="hospitaldet-left">
                  <h5>
                    <FaHospitalAlt />
                    {dctr?.name}
                  </h5>
                  {/* <h6><span className='CurrencyTagcl'>₫</span> 50</h6> */}
                  <p>
                    <HiLocationMarker />
                    {dctr?.city}, {dctr?.country}
                  </p>
                </div>
                <div className="hospitaldet-right">
                  {dctr?.hospitalFiles?.map((hspF) => (
                    <>
                      <Image
                        src={hspF?.filePath}
                        alt="hospitallist"
                        width={100}
                        height={100}
                      />
                    </>
                  ))}
                  <a href="javascript:;">
                    {t("view_more")}
                    <BsArrowRight />
                  </a>
                </div>
              </div>
            </>
          ))}
      </div>
    </>
  );
}
