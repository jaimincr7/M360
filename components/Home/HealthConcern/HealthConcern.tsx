import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Button, Row } from "react-bootstrap";
import CategoryCard from "../CategoryCard/CategoryCard";
import { useAppSelector } from "../../../utils/hooks";
import { promotionalSelector } from "../../../store/home/promotionalSlice";
import { useRouter } from "next/router";
import { DEFAULT_IMAGE } from "../../../pages/_app";
import { useTranslate } from "../../../commonModules/translate";

export default function HealthConcern({promotionalData}) {
  const router = useRouter();
  const [specialitiesData, setSpecialitiesData] = useState<any>([]);
  const t = useTranslate();

  useEffect(() => {
    if (promotionalData) {      
      setSpecialitiesData(promotionalData);
    }
  }, [promotionalData]);

  const viewAllSpecialities = () => {
    router.push("/speciality-list");
  };

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 767,
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
  return (
    <>
      <div className="C-cover healthconcern-cover ComArrowSlidercs">
        <div className="CustContainer">
          <div className="ComHomeTitle-cover healthcon-title">
            <h2>{specialitiesData?.title}</h2>
            <p>{specialitiesData?.description}</p>
          </div>
          <div className="healthconlist-set">
            <Row>
              <Slider {...settings}>
                {specialitiesData?.specialities?.map((data1) => (
                  <>
                    <CategoryCard
                      id={data1?.specialityId}
                      image={data1?.imagePath || DEFAULT_IMAGE}
                      description={data1?.description}
                      name={data1?.name}
                      imagePath={data1?.imagePath}
                    />
                  </>
                ))}
              </Slider>
              <div className="viewall-btn">
                <Button onClick={viewAllSpecialities}>{t("view_all")}</Button>
              </div>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
}
