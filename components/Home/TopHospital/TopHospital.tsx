import { Button } from "react-bootstrap";
import { FaUserMd } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import Slider from "react-slick";
import Image from "next/image";
import { Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { promotionalSelector } from "../../../store/home/promotionalSlice";
import { useEffect, useState } from "react";
import { myLoader } from "../../../commonModules/commonInterfaces";
import { useRouter } from "next/router";
import { getAllHospitalsListAction } from "../../../store/hospitalsList/hospitalsListSlice";
import { DEFAULT_IMAGE } from "../../../pages/_app";
import { useTranslate } from "../../../commonModules/translate";

export default function Tophospital({promotionalData}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [hospitalsData, setHospitalsData] = useState<any>([]);
  const t = useTranslate();

  useEffect(() => {
    dispatch(getAllHospitalsListAction({}));
  }, []);

  useEffect(() => {
    if (promotionalData) {
      setHospitalsData(promotionalData);
    }
  }, [promotionalData]);

  const onHospitalFilter = (id: number) => {
    router.push({
      pathname: "/doctor-list",
      query: { hospitalId: id },
    });
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
  return (
    <>
      <div className="tophospital-cover ComArrowSlidercs">
        <div className="CustContainer">
          <div className="ComHomeTitle-cover tophospital-title">
            <h2>{hospitalsData?.title || t("consult_Our_hospital")}</h2>
            <p>{hospitalsData?.description || t("consult_Our_hospital_subtext")}</p>
          </div>
          <div className="hospitallist-set">
            <Row>
              <Slider {...settings}>
                {hospitalsData?.hospitals?.map((data1) => (
                  <>
                    <div
                      className="tophospbox-cover"
                      key={`hospital-${data1.hospitalId}`}
                      onClick={() => {
                        onHospitalFilter(data1?.hospitalId);
                      }}
                    >
                      <div className="tophospimg-set">
                        <Image
                          src={data1?.imagePath || DEFAULT_IMAGE}
                          loader={myLoader}
                          alt="Hospitallist"
                          width="0"
                          height="0"
                          sizes="100vw"
                        />
                      </div>
                      <div className="hospnamedet-set">
                        <a href="javascript:;">
                          <h5>{data1?.name}</h5>
                          <p>
                            <IoLocationSharp />
                            {data1?.city}
                          </p>
                          <span>
                            <FaUserMd />
                            {data1?.doctorCount} {t("doctors")}
                          </span>
                        </a>
                      </div>
                    </div>
                  </>
                ))}
              </Slider>
              <div className="viewall-btn">
                <Button
                  onClick={() => {
                    router.push("/hospital-list");
                  }}
                >
                  {t("view_all")}
                </Button>
              </div>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
}
