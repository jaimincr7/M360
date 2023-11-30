import Image from "next/image";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { myLoader } from "../../../commonModules/commonInterfaces";
import { DEFAULT_IMAGE } from "../../../pages/_app";
import { Headerbannermob, Headerbanner } from "../../../public/assets";
import { bannerSelector } from "../../../store/home/bannerSlice";
import { useAppSelector } from "../../../utils/hooks";
export default function BannerCard() {
  const banners = useAppSelector(bannerSelector);
  const [bannersData, setbanners] = useState([]);

  useEffect(() => {
    if (!!banners && banners.data.banners.length) {
      setbanners(banners.data.banners);
    }
  }, [banners.data.banners]);

  const settings = {
    dots: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
  };
  return (
    <>
      {/* Desktop Banner Start */}
      <div className="desktopban-set">
        <Slider {...settings}>
          {bannersData.map((data1: any) => (
            <div
              className="headerban-set cursorPointer"
              key={`main-banner-${data1.bannerId}`}
              onClick={() => {
                window.open(data1?.redirectTo, "_blank");
              }}
            >
              <Image
                src={data1.bannerPath || DEFAULT_IMAGE}
                loader={myLoader}
                alt="Header banner"
                width="0"
                height="0"
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          ))}
        </Slider>
      </div>
      {/* Desktop Banner End */}

      {/* Mobile Banner Start */}
      {/* <div className={styles["mobileban-set"]}>
        <Slider {...settings}>
          <div className={styles["headerban-set"]}>
            <Image src={Headerbannermob} alt="Header banner" />
          </div>
          <div className={styles["headerban-set"]}>
            <Image src={Headerbannermob} alt="Header banner" />
          </div>
          <div className={styles["headerban-set"]}>
            <Image src={Headerbannermob} alt="Header banner" />
          </div>
        </Slider>
      </div> */}
      {/* Mobile Banner End */}
    </>
  );
}
