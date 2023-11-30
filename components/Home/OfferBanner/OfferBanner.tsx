import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import { Offerbanner } from "../../../public/assets";
import { DEFAULT_IMAGE } from "../../../pages/_app";
import { useRouter } from "next/router";
import { useTranslate } from "../../../commonModules/translate";

function OfferBanner({ data }: { data: any[] }) {
  const router = useRouter();
  const t = useTranslate();
  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    // <>
    //   {data?.length > 0 && (
    //     <Slider {...settings}>
    //       {data.map((x: any, index: number) => (
    //         <div
    //           className="headerban-set"
    //           onClick={() => {
    //             router.push("/doctor-list");
    //           }}
    //           key={`offer-banner-${index}`}
    //         >
    //           {/* <a href="javascript:;"> */}
    //             <Image
    //               src={Offerbanner || DEFAULT_IMAGE}
    //               width="0"
    //               height="0"
    //               sizes="100vw"
    //               style={{ width: "100%", height: "auto" }}
    //               alt={t("offer_banner")}
    //             />
    //           {/* </a> */}
    //         </div>
    //       ))}
    //     </Slider>
    //   )}
    // </>
    <div className="bannerdata-cover">
      <div className="desktopban-set">
        <Slider {...settings}>
          {data?.map((data1: any) => (data1.promocodeBannerImagePath &&
            <div
              className="headerban-set cursorPointer headerban-set"
              key={`main-banner-${data1.promocodeBannerImagePath}`}
              onClick={() => {
                router.push(`/doctor-list?promoCodeId=${data1.promoCodeId}`)
              }}
            >
              <Image
                src={data1.promocodeBannerImagePath}
                alt="Header banner"
                width="0"
                height="0"
                sizes="100vw"
                style={{ width: "100%", height: "280px" }}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default OfferBanner;
