import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { TbDiscount2 } from "react-icons/tb";
import {
  doctorDetailsSelector,
  getPromoCodesAction,
} from "../../store/doctorDetails/doctorDetailsSlice";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";

export default function DoctorOffer({ selectedServiceId }) {
  const router = useRouter();
  const { doctorId }: { doctorId?: number } = router.query;
  const doctorDetails = useAppSelector(doctorDetailsSelector);
  const [doctorPromo, setDoctorPromo] = useState([]);
  const dispatch = useAppDispatch();

  const idRef:any=useRef(null)

  useEffect(() => {
    idRef.current={}
    window.addEventListener("loggedInCustomEvent", () => {
      dispatch(
        getPromoCodesAction({
          drId: idRef.current?.doctorId,
          serviceTypeId: idRef.current?.selectedServiceId,
        })
      );
    });
  }, [])
  
  useEffect(() => {
    if (router.isReady) {
      idRef.current={doctorId,selectedServiceId}
      dispatch(
        getPromoCodesAction({
          drId: doctorId as number,
          serviceTypeId: selectedServiceId as number,
        })
      );
    }
  }, [router.isReady, doctorId, selectedServiceId]);

  useEffect(() => {
    setDoctorPromo(doctorDetails.promoCodes.promoCodes);
  }, [doctorDetails.promoCodes.promoCodes]);

  return (
    <>
      <div className="offercode-list">
        {doctorPromo?.length > 0 &&
          doctorPromo?.map((drpm: any) => (
            <>
              <div className="promodata-box">
                <TbDiscount2 className="offerlogo-icon1" />
                <div className="promocode-title">
                  <h4>{drpm.code}</h4>
                  <p>{drpm.description}</p>
                </div>
              </div>
            </>
          ))}
      </div>
    </>
  );
}
