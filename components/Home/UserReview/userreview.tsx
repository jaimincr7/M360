import React, { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Row } from "react-bootstrap";
import { Vectorimage } from "../../../public/assets";
import Image from "next/image";
import { useAppSelector } from "../../../utils/hooks";
import { testimonialSelector } from "../../../store/home/testimonialSlice";
import { useTranslate } from "../../../commonModules/translate";

function Userreview() {
  const testimonials = useAppSelector(testimonialSelector);
  const t = useTranslate();
  const [testimonialsData, setTestimonials] = useState([]);

  useEffect(() => {
    if (!!testimonials && testimonials.data.testimonials.length) {
      setTestimonials(testimonials.data.testimonials);
    }
  }, [testimonials.data.testimonials]);

  var settings = {
    dots: false,
    infinite: true,
    autoplay:true,
    autoplaySpeed: 5000,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
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
      <div className="toppatients-cover ComArrowSlidercs">
        <div className="CustContainer">
          <div className="ComHomeTitle-cover toppatient-title">
            <h2>{t('patient_say_about_us')}</h2>
          </div>
          <div className="patientlist-set">
            <Row>
              <Slider {...settings}>
                {testimonialsData.map((data1: any) => (
                  <>
                    <div className="toppatientbox-cover">
                      <h3>{data1.subject}</h3>
                      <p>{data1.description}</p>
                      <h5>{data1.name}</h5>
                      <div className="patientrate-set">
                        {Array.from(Array(data1.ratings), (element, index) => {
                          return <AiFillStar key={index} />;
                        })}
                      </div>
                      <Image src={Vectorimage} alt="Vectorimage" />
                    </div>
                  </>
                ))}
              </Slider>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
}

export default Userreview;
