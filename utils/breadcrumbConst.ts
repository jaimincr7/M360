export interface IBreadcrumb {
  path: string;
  details?: { label: string; path?: string; lang_key?: string }[];
}

export const BreadcrumbRoutes: IBreadcrumb[] = [
  {
    path: "/",
  },
  {
    path: "/doctor-list",
    details: [{ label: "Doctor Listing", lang_key: "doctor_listing" }],
  },
  {
    path: "/doctor-details/[doctorId]",
    details: [
      {
        label: "Doctor Listing",
        path: "/doctor-list",
        lang_key: "doctor_listing",
      },
      { label: "Doctor Detail", lang_key: "doctor_detail" },
    ],
  },
  {
    path: "/blog/blog-list",
    details: [{ label: "Blog Listing", lang_key: "blog_listing" }],
  },
  {
    path: "/blog/blog-detail/[blogId]/[blogTitle]",
    details: [
      {
        label: "Blog Listing",
        path: "/blog/blog-list",
        lang_key: "blog_listing",
      },
      { label: "Blog Detail", lang_key: "blog_detail" },
    ],
  },
  {
    path: "/speciality-list",
    details: [{ label: "Speciality", lang_key: "speciality" }],
  },
  {
    path: "/symptoms-list",
    details: [{ label: "Symptoms", lang_key: "Symptoms" }],
  },
  {
    path: "/hospital-list",
    details: [{ label: "Hospital Listing", lang_key: "hospital_listing" }],
  },
  {
    path: "/refer-and-earn",
    details: [{ label: "Refer And Earn", lang_key: "refer_and_earn" }],
  },
  {
    path: "/offer-detail/[id]",
    details: [{ label: "Coupon Detail", lang_key: "coupon_detail" }],
  },
];

export const hideHeaderFooterUrls = [
  "/blog/blog-detail-mobile/[blogId]/[blogTitle]",
  "/contact-us-mobile",
];
