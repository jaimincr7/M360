import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { BiCalendar } from "react-icons/bi";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import { myLoader } from "../../../../commonModules/commonInterfaces";
import { FacebookShareIcon, TwitterShareIcon } from "../../../../public/assets";
import {
  blogSelector,
  getAllBlogs,
  getBlogDetailsById,
} from "../../../../store/blog/blogSlice";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import Image from "next/image";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { useTranslate } from "../../../../commonModules/translate";

const BlogTitle = () => {
  const t=useTranslate()
  const router = useRouter();
  const { blogId } = router.query;
  const blogs = useAppSelector(blogSelector);

  const dispatch = useAppDispatch();

  const [blogsData, setblogs] = useState<any>([]);

  const [allBlogs, setAllBlogs] = useState<any>([]);

  useEffect(() => {
    if (blogs?.blogs?.blogs?.length) {
      setAllBlogs(blogs.blogs?.blogs);
    }
  }, [blogs?.blogs?.blogs]);

  useEffect(() => {
    if (blogId) dispatch(getBlogDetailsById(Number(blogId)));
  }, [blogId]);

  useEffect(() => {
    dispatch(
      getAllBlogs({
        pageSize: 10,
        pageNumber: 1,
      })
    );
  }, []);

  useEffect(() => {
    if (!!blogs && !!blogs.blogDetails.blogDetails) {
      setblogs(blogs.blogDetails.blogDetails);
    }
  }, [blogs.blogDetails.blogDetails]);

  const onNext = () => {
    const currentBlogIndex = allBlogs.findIndex(
      (x) => x.blogId.toString() === blogId
    );
  };

  const onNextOrPrev = (nextPrevDetail: { blogId: number; title: string }) => {
    let urlTitle = nextPrevDetail.title
      .substring(0, 50)
      .toLowerCase()
      .replace(/[^\w]/g, "-");
    urlTitle = urlTitle.replace(/--/g, "-");
    router.push(
      `/blog/blog-detail-mobile/${nextPrevDetail.blogId}/${urlTitle}`
    );
  };

  return (
    <Container>
      <div className="BlogDetailsmainCov">
        <div className="BlogDetailsmainLeft">
          <div className="BlogDetailsleftImgset">
            <Image
              src={blogsData?.imagePath}
              width={100}
              height={100}
              loader={myLoader}
              alt="Blog Image"
            />
          </div>
          <div className="BlogDetailsleftTitle">
            <h1>{blogsData?.title}</h1>
            <p>
              <BiCalendar />
              {moment(blogsData?.updatedAt).utc().format("DD MMMM YYYY")}
            </p>
          </div>
          <div className="BlogDetailsDataCov">
            <p>{blogsData?.description}</p>
          </div>

          <div className="sharenewxtprbtncov">
            <div className="sharenewxtprbtnLeft">
              <p>{t("share_with")}</p>
              <ul>
                <li>
                  <FacebookShareButton url={window.location.href}>
                    <Image src={FacebookShareIcon} alt="Facebook" />
                  </FacebookShareButton>
                </li>
                <li>
                  <TwitterShareButton url={window.location.href}>
                    <Image src={TwitterShareIcon} alt="Twitter" />
                  </TwitterShareButton>
                </li>
              </ul>
            </div>
            <div className="sharenewxtprbtnRight">
              <Button
                className={
                  "PreviousBtnlft " + (blogsData?.prevBlog ? "" : "DisabledBtn")
                }
                disabled={!blogsData?.prevBlog}
                onClick={() => {
                  onNextOrPrev(blogsData.prevBlog);
                }}
              >
                <HiOutlineArrowLeft /> {t("previous")}
              </Button>
              <Button
                className={
                  "NextBtnrit " + (blogsData?.nextBlog ? "" : "DisabledBtn")
                }
                disabled={!blogsData?.nextBlog}
                onClick={() => {
                  onNextOrPrev(blogsData.nextBlog);
                }}
              >
                {t("next")} <HiOutlineArrowRight />
              </Button>
            </div>
          </div>
        </div>
        <div className="BlogDetailsmainRight">
          <h2>{t("recent_post")}</h2>
          <div className="BlogDetailsListrightCov">
            {blogs.blogs?.blogs?.map((blog) => (
              <React.Fragment key={blog.title + blog.blogId}>
                <div className="BlogDetailsListrightIner">
                  <a
                    href="javascript:;"
                    onClick={() => {
                      onNextOrPrev(blog);
                    }}
                  >
                    {" "}
                    <Image
                      src={blog.imagePath}
                      alt=""
                      width={100}
                      height={100}
                    />
                    <h4>{blog.title}</h4>
                    <p>{blog.description}</p>
                  </a>
                </div>
                <hr />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BlogTitle;
