import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
import BlogCard from "../../components/Common/Cards/symptoms/blogcard/BlogCard";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import {
  blogSelector,
  getAllBlogCategories,
  getAllBlogs,
} from "../../store/blog/blogSlice";
import { useTranslate } from "../../commonModules/translate";

function BlogList() {
  const [blogsData, setblogs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useAppDispatch();
  const blogs = useAppSelector(blogSelector);

  const t = useTranslate();

  useEffect(() => {
    dispatch(getAllBlogCategories());
    dispatch(getAllBlogs({ categoryId: null }));
  }, []);

  useEffect(() => {
    if (!!blogs && blogs.blogs.blogs) {
      setblogs(blogs.blogs.blogs);
    }
  }, [blogs.blogs.blogs]);
  let keywordSearchTimer: any = null;

  const onSearch = (e) => {
    if (keywordSearchTimer) {
      clearTimeout(keywordSearchTimer);
    }
    keywordSearchTimer = setTimeout(() => {
      const data = {
        search: e,
      };
      dispatch(getAllBlogs(data));
    }, 1000);
  };

  const onCategoryChange = (id: number) => {
    const data = {
      categoryId: id,
    };
    setSelectedId(id);
    dispatch(getAllBlogs(data));
  };

  return (
    <>
      {/* <Breadcrumbs /> */}

      <div className="blogListdataBgmain">
        <div className="container">
          <div className="BlogslstdataTitle">
            <h1>{t("Blogs")}</h1>
            <div className="BlogslsttitleSearch">
              <Form.Group controlId="" className="BlogslstSearchIner">
                <Form.Control
                  type=""
                  placeholder="Search Blog"
                  onChange={(e) => onSearch(e.target.value)}
                />
                <BiSearch />
              </Form.Group>
            </div>
          </div>
          <div className="Blogceteglistcovbox">
            <ul>
              <li>
                <a
                  className={!selectedId ? "active" : ""}
                  onClick={() => onCategoryChange(null)}
                >
                  {t("all")}
                </a>
              </li>
              {blogs.data.blogCat?.map((data) => (
                <li key={data?.blogCategoryId}>
                  <a
                    className={
                      data?.blogCategoryId === selectedId ? "active" : ""
                    }
                    onClick={() => onCategoryChange(data?.blogCategoryId)}
                  >
                    {data?.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="blogListdataCover">
            {blogsData?.map((blgd: any) => (
              <div className="blogListdataIner" key={blgd.blogId}>
                <BlogCard
                  id={blgd?.blogId}
                  imagePath={blgd.imagePath}
                  title={blgd.title}
                  description={blgd.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogList;
