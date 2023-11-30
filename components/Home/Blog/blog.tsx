import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Row } from "react-bootstrap";
import BlogCard from "../../Common/Cards/symptoms/blogcard/BlogCard";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { blogSelector } from "../../../store/home/blogSlice";
import { useRouter } from "next/router";
import { getAllBlogs } from "../../../store/blog/blogSlice";
import { DEFAULT_IMAGE } from "../../../pages/_app";
import { useTranslate } from "../../../commonModules/translate";

function Blog() {
  const dispatch = useAppDispatch();
  const t = useTranslate();
  const router = useRouter();
  const blogs = useAppSelector(blogSelector);
  const [blogsData, setblogs] = useState([]);

  useEffect(() => {
    if (!!blogs && blogs.data.blogs.length) {
      setblogs(blogs.data.blogs);
    }
  }, [blogs.data.blogs]);

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
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
      <div className="tophealth-cover">
        <div className="CustContainer">
          <div className="healthexp-title">
            <h2>{t('read_top_articles')}</h2>
          </div>
          <div className="healthlist-set">
            <Row>
              <Slider {...settings}>
                {blogsData.map((data1: any) => (
                  <>
                    <BlogCard
                      title={data1.title}
                      description={data1.description}
                      imagePath={data1?.imagePath || DEFAULT_IMAGE}
                      id={data1?.blogId}
                    />
                  </>
                ))}
              </Slider>
            </Row>
          </div>
          <div className="viewall-btn">
            <Button
              onClick={() => {
                router.push("/blog/blog-list");
                dispatch(getAllBlogs({}));
              }}
            >
              {t('view_all_articles')}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Blog;
