import React from "react";
import Image from "next/image";
import { HiArrowNarrowRight } from "react-icons/hi";
import { myLoader } from "../../../../../commonModules/commonInterfaces";
import { useRouter } from "next/router";
import moment from "moment";
import { useAppDispatch } from "../../../../../utils/hooks";
import { getBlogDetailsById } from "../../../../../store/blog/blogSlice";
import { useTranslate } from "../../../../../commonModules/translate";

export default function BlogCard(props) {
  const router = useRouter();
  const t = useTranslate();
  const dispatch = useAppDispatch();
  const newDate = new Date(props?.createdAt);

  return (
    <>
      <div className="tophealthbox-cover">
        <div className="healthnamedet-set">
          <div className="healthnamedet-img">
            <Image
              src={props?.imagePath ? props?.imagePath : ""}
              alt="Blog"
              loader={myLoader}
              width="0"
              height="0"
              sizes="100vw"
              style={{ width: "100%", height: "50%" }}
            />
            <div className="BlogDatecov">
              <h6>{moment(props.createdAt).utc().format("ddd")}</h6>
              <p>
                {moment(props.createdAt).utc().format("MMM")},{" "}
                {moment(props.createdAt).utc().format("YY")}
              </p>
            </div>
          </div>
          <div className="healthdata-set">
            <h5>{props.title}</h5>
            <p>{props.description}</p>
            <a
              href="javascript:;"
              onClick={() => {
                let urlTitle = props.title
                  .substring(0, 50)
                  .toLowerCase()
                  .replace(/[^\w]/g, "-");
                urlTitle = urlTitle.replace(/--/g, "-");
                router.push(`/blog/blog-detail/${props.id}/${urlTitle}`);
                // dispatch(getBlogDetailsById(props.id));
              }}
            >
              {" "}
              {t('read_more')} <HiArrowNarrowRight />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
