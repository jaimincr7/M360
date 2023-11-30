import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Row } from "react-bootstrap";
import { AiFillStar } from "react-icons/ai";
import { BsPatchCheckFill } from "react-icons/bs";
import { IoLocationSharp } from "react-icons/io5";
import Slider from "react-slick";
import { myLoader } from "../../../commonModules/commonInterfaces";
import { useTranslate } from "../../../commonModules/translate";
import { DEFAULT_IMAGE } from "../../../pages/_app";
import { Doclist1, Doclist2, Doclist3, Doclist4 } from "../../../public/assets";
import { promotionalSelector } from "../../../store/home/promotionalSlice";
import { useAppSelector } from "../../../utils/hooks";

function ConsultDoctor({promotionalData}) {
  const router = useRouter();
  const [doctors, setDoctors] = useState<any>([]);
  const t = useTranslate();

  useEffect(() => {
    if(promotionalData) {
      setDoctors(promotionalData);    
    }
  }, [promotionalData]);

  const viewAllDoctors = () => {
    router.push("/doctor-list");
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
      <div className="topdoctor-cover ComArrowSlidercs">
        <div className="CustContainer">
          <div className="ComHomeTitle-cover topdoc-title">
            <h2>{doctors?.title}</h2>
            <p>{doctors?.description}</p>
          </div>
          <div className="doctorlist-set">
            <Row>
              <Slider {...settings}>
                {doctors?.doctors?.map((data1: any) => (
                  <div
                    className="topdocbox-cover cursorPointer"
                    key={data1.displayName + data1.doctorId}
                    onClick={() =>
                      router.push(`/doctor-details/${data1.doctorId}`)
                    }
                  >
                    <div className="topdocimg-set">
                      <Image
                        src={data1.photoPath || DEFAULT_IMAGE}
                        loader={myLoader}
                        alt="Doclist"
                        width="0"
                        height="0"
                        sizes="100vw"
                      />
                      <p>
                        <AiFillStar />
                        {data1.averageRating}
                      </p>
                    </div>
                    <div className="docnamedet-set">
                      <a href="javascript:;">
                        <h5>{data1?.displayName}</h5>
                        <p>
                          {data1?.specialties} | {data1?.yearsOfExperience}{" "}
                          {t("years_exp")}
                        </p>
                        <span>
                          <IoLocationSharp />
                          {data1?.city}
                        </span>
                      </a>
                    </div>
                  </div>
                ))}
              </Slider>
              <div className="viewall-btn">
                <Button onClick={viewAllDoctors}>{t("view_all")}</Button>
              </div>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConsultDoctor;
