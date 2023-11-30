import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button } from "react-bootstrap";
import { Row } from "react-bootstrap";
import Image from "next/image";
import { HiArrowNarrowRight } from "react-icons/hi";
import { useAppSelector } from "../../../utils/hooks";
import { promotionalSelector } from "../../../store/home/promotionalSlice";
import { useRouter } from "next/router";
import { myLoader } from "../../../commonModules/commonInterfaces";
import { DEFAULT_IMAGE } from "../../../pages/_app";
import { useTranslate } from "../../../commonModules/translate";

export default function HomeSymptomsList({promotionalData}) {
  const router = useRouter();
  const [symptomsData, setSymptomsData] = useState<any>([]);
  const t = useTranslate();

  useEffect(() => {
    if (promotionalData) {
      setSymptomsData(promotionalData);
    }
  }, [promotionalData]);

  const viewAllSymptoms = () => {
    router.push("/symptoms-list");
  };

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 650,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 414,
        settings: {
          slidesToShow: 1.5,
        },
      },
      {
        breakpoint: 375,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const renderCard = (data) => {
    return (
      <div className="topcosultbox-cover">
        <div className="consultnamedet-set">
          <Image
            src={data?.imagePath || DEFAULT_IMAGE}
            alt="Consultation"
            loader={myLoader}
            height={100}
            width={100}
          />
          <div className="consultdata-set">
            <h5>{data.name}</h5>
            <p>{data.description}</p>
            <a
              href="javascript:;"
              onClick={() => {
                router.push(`doctor-list?symptomId=${data.symptomId}`);
              }}
            >
              {t('book_appointment')} <HiArrowNarrowRight />
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="topconsult-cover ComArrowSlidercs">
        <div className="CustContainer">
          <div className="ComHomeTitle-cover topconsult-title">
            <h2>{symptomsData?.title}</h2>
            <p>{symptomsData?.description}</p>
          </div>
          <div className="consultlist-set">
            <Row>
              <Slider {...settings}>
                {symptomsData?.symptoms?.map((data1) => (
                  <>{renderCard(data1)}</>
                ))}
              </Slider>
              <div className="viewall-btn">
                <Button onClick={viewAllSymptoms}>{t("view_all")}</Button>
              </div>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
}
