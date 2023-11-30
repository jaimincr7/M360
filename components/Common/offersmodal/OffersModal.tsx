import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import {
  doctorDetailsSelector,
  getPromoCodesAction,
  setPromoCodeDetail,
} from "../../../store/doctorDetails/doctorDetailsSlice";
import {
  applyPromoCode,
  doctorListSelector,
} from "../../../store/promocode/promocodeSlice";
import { CURRENT_USER } from "../../../commonModules/localStorege";
import { FormikProps, useFormikContext } from "formik";
import { toast } from "react-toastify";
import NoRecordsFound from "../../NoRecordsFound";
import { applyWalletBalance } from "../../../store/user/userWalletSlice";
import { useTranslate } from "../../../commonModules/translate";

function OffersModal(props: {
  show: boolean;
  onHide: any;
  drId: number;
  onApplyCpn: (val: any) => void;
  serviceTypeId: number;
  hpId:number
}) {
  const { show, drId, onHide, onApplyCpn ,serviceTypeId,hpId} = props;
  const { values, setFieldValue }: FormikProps<any> = useFormikContext();
  const dispatch = useAppDispatch();
  const currentUser = CURRENT_USER();
  const doctorState = useAppSelector(doctorDetailsSelector);

  const [promoCodes, setPromoCodes] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchString, setSearchString] = useState<string>("");

  const t = useTranslate();

  useEffect(() => {
    if (drId) dispatch(getPromoCodesAction({ drId, serviceTypeId,hpId }));
  }, [drId,serviceTypeId]);

  useEffect(() => {
    if (doctorState?.promoCodes?.promoCodes?.length) handleFilter(searchString);
  }, [searchString]);

  useEffect(() => {
    if (doctorState?.promoCodes?.promoCodes?.length) {
      setPromoCodes(doctorState?.promoCodes?.promoCodes);
    }
  }, [doctorState?.promoCodes?.promoCodes]);

  const handleFilter = (search: string) => {
    setPromoCodes(
      doctorState?.promoCodes?.promoCodes?.filter((x) =>
        x?.title?.includes(search)
      )
    );
  };

  const onMoreDetail = (promo) => {
    let newWindow: any = window.open(
      `/offer-detail/${promo.promoCodeId}`,
      "_blank"
    );
    newWindow.promoDetail = promo;
  };

  const onApplyPromocode = (promo: any) => {
    setIsLoading(true);
    if (values?.isWalletUsed) {
      dispatch(
        applyWalletBalance({
          promocodeId: promo.promoCodeId || 0,
          userId: currentUser.userId,
          mobileNumber: currentUser.mobileNumber,
          doctorId: values?.bookedAppointmentDetail?.doctorDetails?.doctorId,
          hospitalId:
            values?.bookedAppointmentDetail?.partOfDaySlotDetail?.hospitalId,
          serviceTypeId: values?.bookedAppointmentDetail?.doctorServiceTypeId,
          isApply: true,
        })
      )
        .then((res) => {
          if (res.payload) {
            setFieldValue("promocodeId", promo.promoCodeId);
            onApplyCpn({ ...res.payload, code: promo.code });
            onHide();
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      dispatch(
        applyPromoCode({
          promocodeId: promo.promoCodeId,
          userId: currentUser.userId,
          mobileNumber: currentUser.mobileNumber,
          doctorId: drId,
          hospitalId:
            values?.bookedAppointmentDetail?.partOfDaySlotDetail?.hospitalId,
          serviceTypeId: values?.bookedAppointmentDetail?.doctorServiceTypeId,
          isApply: true,
        })
      )
        .then((res) => {
          if (res.payload?.isValid) {
            setFieldValue("promocodeId", promo.promoCodeId);
            onApplyCpn({ ...res.payload, code: promo.code });
            onHide();
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      <Modal
        show={show}
        backdrop="static"
        keyboard={false}
        centered
        className="CustModalComcovermain LatestOfferModal"
        onHide={onHide}
      >
        <Modal.Header closeButton className="latHedartTitle">
          <h5>{t("latest_coupons_and_offers")}</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="CouponsBoxCov">
            <div className="CouponsBoxApply">
              <Form.Group className="CouponsBoxApplform" controlId="">
                <Form.Control
                  type=""
                  placeholder={t("enter_promocode")}
                  onChange={(e) =>
                    e.target.value
                      ? setSearchString(e.target.value)
                      : handleFilter("")
                  }
                />
                {/* <Button type='button' onClick={() => handleFilter(searchString)}>Apply</Button> */}
              </Form.Group>
            </div>

            <div className="OfferCouponsCardmain">
              {promoCodes?.length ? (
                promoCodes?.map((promo: any, i: number) => {
                  const { code, title, description } = promo;
                  return (
                    <div className="OfferCouponsCardbox" key={`promocode-${i}`}>
                      <div className="OfrCoonsCardTop">
                        <div className="OfrCoosCardtopLeft">
                          <h6>
                            <svg
                              width="20"
                              height="12"
                              viewBox="0 0 20 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M18.2422 0.140625H1.75781C0.788516 0.140625 0 0.929141 0 1.89844V4.24219C0 4.56605 0.26207 4.82812 0.585938 4.82812H1.17188C1.81789 4.82812 2.34375 5.35398 2.34375 6C2.34375 6.64602 1.81789 7.17188 1.17188 7.17188H0.585938C0.26207 7.17188 0 7.43395 0 7.75781V10.1016C0 11.0709 0.788516 11.8594 1.75781 11.8594H18.2422C19.2115 11.8594 20 11.0709 20 10.1016V7.75781C20 7.43395 19.7379 7.17188 19.4141 7.17188H18.8281C18.1821 7.17188 17.6562 6.64602 17.6562 6C17.6562 5.35398 18.1821 4.82812 18.8281 4.82812H19.4141C19.7379 4.82812 20 4.56605 20 4.24219V1.89844C20 0.929141 19.2115 0.140625 18.2422 0.140625ZM5.89844 4.24219C5.89844 3.27289 6.68695 2.48438 7.65625 2.48438C8.62555 2.48438 9.41406 3.27289 9.41406 4.24219C9.41406 5.21148 8.62555 6 7.65625 6C6.68695 6 5.89844 5.21148 5.89844 4.24219ZM7.29 9.38746C7.03769 9.18488 6.99648 8.81641 7.19848 8.56348L11.886 2.7041C12.0891 2.45289 12.457 2.41055 12.7099 2.61254C12.9623 2.81512 13.0035 3.18359 12.8015 3.43652L8.11398 9.2959C7.91004 9.5491 7.54187 9.58867 7.29 9.38746ZM12.3438 9.51562C11.3745 9.51562 10.5859 8.72711 10.5859 7.75781C10.5859 6.78852 11.3745 6 12.3438 6C13.313 6 14.1016 6.78852 14.1016 7.75781C14.1016 8.72711 13.313 9.51562 12.3438 9.51562Z"
                                fill="#174799"
                              />
                            </svg>
                            <span>{code}</span>
                            <span className="offerdotboxtop"></span>
                            <span className="offerdotboxbot"></span>
                          </h6>
                        </div>
                      </div>
                      <div className="OfrCoonsCardData">
                        <h3>{title}</h3>
                        <p>{description}</p>
                        <a
                          href="javascript:;"
                          onClick={() => onMoreDetail(promo)}
                        >
                          +{t("more_details")}
                        </a>
                      </div>
                      <div className="OfrCoosCardtopRight">
                        <Button
                          type={"button"}
                          onClick={() => onApplyPromocode(promo)}
                          disabled={isLoading}
                        >
                          {t("applyCoupon")}
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <NoRecordsFound />
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default OffersModal;
