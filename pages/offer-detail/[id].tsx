import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { OfferImg } from "../../public/assets";
import { useTranslate } from "../../commonModules/translate";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { doctorListSelector, getPromoDetailsAction } from "../../store/promocode/promocodeSlice";
import LoadingSpinner from "../../components/Common/LoadingSpinner";

const OfferDetail = () => {
  const router = useRouter();
  const dispatch = useAppDispatch()
  const {id}=router.query
  const t=useTranslate()
  const promocodeState=useAppSelector(doctorListSelector)

  const [promoDetail, setPromoDetail] = useState<any>({});

  useEffect(() => {
   if(router.isReady){
    dispatch(getPromoDetailsAction(+id)).then(res=>{
      if(res?.payload){
        setPromoDetail(res.payload)
      }
    })
   }
  }, [id,router])
  
  return (
    <div className="OfferdetailsCov">
      <div className="OfferdetailsIner">
        {promocodeState.promoCodeDetail.status==="loading"?<LoadingSpinner />:<>
        <div className="OfferdetailsImg">
          <Image
            src={promoDetail?.promocodeBannerImagePath}
            alt="Coupon Code"
            width={10}
            height={200}
          />
        </div>
        <div className="OfferdetailsData">
          <div className="OfferdetasdataTitle">
            <div className="OfferdetastitleLeft">
              <h1>{promoDetail.code}</h1>
              <p>{t("Coupon_code")}</p>
            </div>
            <div className="OfferdetastitleRight">
              <Button
                type="button"
                onClick={() => navigator.clipboard.writeText(promoDetail.code)}
              >
                {t("copy_code")}
              </Button>
            </div>
          </div>
          <div className="OfferdetasDetailsbox">
            <h2>{promoDetail.title}</h2>
            <p>{promoDetail.description}</p>
            {promoDetail.expiryDateTime && (
              <h6>
                {t("expire_on")}{" "}
                {moment(promoDetail.expiryDateTime).format("DD MMM yyyy")}
              </h6>
            )}
          </div>
        </div></>}
        
       
      </div>
    </div>
  );
};

export default OfferDetail;
