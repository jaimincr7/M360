import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AiFillStar } from "react-icons/ai";
import { MdLanguage } from "react-icons/md";
// import './appsection-style.css';
import { HiLocationMarker } from "react-icons/hi";
import { Doclist2 } from "../../public/assets";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import {
  doctorDetailsSelector,
  getDoctorsDetailsAction,
} from "../../store/doctorDetails/doctorDetailsSlice";
import { useRouter } from "next/router";
import { useTranslate } from "../../commonModules/translate";

export default function DoctorDetails() {
  const router = useRouter();
  const doctorDetails = useAppSelector(doctorDetailsSelector);
  const [doctor, setDoctor] = useState<any>({});
  const dispatch = useAppDispatch();

  const t = useTranslate();

  useEffect(() => {
    if (router.isReady) {
      const { doctorId }: { doctorId?: number } = router.query;
      dispatch(getDoctorsDetailsAction(doctorId as number));
    }
  }, [router.isReady]);

  useEffect(() => {
    setDoctor(doctorDetails.data.doctorDetails);
  }, [doctorDetails.data.doctorDetails]);

  return (
    <>
      <div className="docpersonal-info">
        <Image
          src={doctor?.photoPath || Doclist2}
          width={100}
          height={100}
          alt="Doclist"
        />
        <div className="docinfo-left">
          <h5>{doctor?.displayName}</h5>
          <p className="docspe-info">
            {doctor?.specialities
              ?.filter((sp) => !!sp.name)
              ?.map((sp) => sp.name)
              .join(", ")}{" "}
            | <span>{doctor?.yearsOfExperience} {t("years_exp")}</span>
          </p>

          <p className="docdegree-info">{doctor?.degrees}</p>

          {/* For Language Listing */}
          {doctor?.languages?.length > 0 && (
            <p className="doclangu-info">
              <MdLanguage />{" "}
              {doctor?.languages?.map((lng) => lng.name).join(", ")}
            </p>
          )}
          <div className="docrateinfo-set">
            {Array.from(
              Array(parseInt(doctor?.averageRating, 10) || 0),
              (element, index) => {
                return <AiFillStar key={index} />;
              }
            )}
            <span>({doctor?.totalRatings})</span>
          </div>
          <p className="doclangu-info">
            <HiLocationMarker /> {doctor?.city}
          </p>
        </div>
      </div>
    </>
  );
}
