import React from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { Benefitsimg } from "../../../public/assets";
import Image from "next/image";
import { DEFAULT_IMAGE } from "../../../pages/_app";
import { useTranslate } from "../../../commonModules/translate";

function Benefits() {
  const t = useTranslate();
  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <>
      <div className="benefitcon-set">
        <div className="CustContainer">
          <div className="row">
            <div className="col-md-6">
              <div className="benefitcon-left">
                <Image
                  src={Benefitsimg || DEFAULT_IMAGE}
                  alt="benefitsimg"
                  width="0"
                  height="0"
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="benefitcon-right">
                <h2>{t('benefits_of_online_consultation')}</h2>
                <div className="ourbenefit-set">
                  <AiOutlineCheck />
                  <div className="ourbenefit-text">
                    <h5>{t('consult_best_doctor_24_7')}</h5>
                    <p>
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page when looking
                      at its layout.
                    </p>
                  </div>
                </div>
                <div className="ourbenefit-set">
                  <AiOutlineCheck />
                  <div className="ourbenefit-text">
                    <h5>{t('convinient_and_easy')}</h5>
                    <p>
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page when looking
                      at its layout.
                    </p>
                  </div>
                </div>
                <div className="ourbenefit-set">
                  <AiOutlineCheck />
                  <div className="ourbenefit-text">
                    <h5>{t('hundred_safety')}</h5>
                    <p>
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page when looking
                      at its layout.
                    </p>
                  </div>
                </div>
                <div className="ourbenefit-set">
                  <AiOutlineCheck />
                  <div className="ourbenefit-text">
                    <h5>{t('similar_clinic_experience')}</h5>
                    <p>
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page when looking
                      at its layout.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Benefits;
