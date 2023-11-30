import React from "react";
import Image from "next/image";
import { HiArrowNarrowRight } from "react-icons/hi";
import { Consultationimg1 } from "../../../../public/assets";
import { myLoader } from "../../../../commonModules/commonInterfaces";
import { useRouter } from "next/router";
import { useTranslate } from "../../../../commonModules/translate";

export default function SymptomsCard(props) {
  const router = useRouter();
  const t = useTranslate();
  return (
    <>
      <div className="topcosultbox-cover">
        <div className="consultnamedet-set">
          <Image
            src={props?.image ? props.image : Consultationimg1}
            loader={myLoader}
            width="0"
            height="0"
            sizes="100vw"
            style={{ width: "100%", height: "50%" }}
            alt="Consultation"
          />
          <div className="consultdata-set">
            <h5>{props.name}</h5>
            <p>{props.description}</p>
            <a
              onClick={() =>
                router.push({
                  pathname: "/doctor-list",
                  query: { symptomId: props.id },
                })
              }
            >
              {t('book_appointment')} <HiArrowNarrowRight />
            </a>
          </div>
        </div>
      </div>
      {/* <div className='topcosultbox-cover'>
            </div> */}
    </>
  );
}
