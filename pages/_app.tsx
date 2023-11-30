import type { AppProps } from "next/app";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../public/assets/css/color.css";
import "../public/assets/css/main.css";
import "../public/assets/css/responsive.css";
import "../styles/tophospital.css";
import "../styles/footer-style.css";
import "../styles/contactusstyle.css";
import "../styles/benefits.css";
import "../styles/blogstyle.css";
import "../styles/blogcard.css";
import "../styles/hospitalcardstyle.css";
import "../styles/hospitalstyle.css";
import "../styles/DoctorDetails/doctordetails.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import "../styles/appSection-Style.css";
import "../styles/bannerCard.css";
import "../styles/patientdetails.css";
import "../styles/bookAppModel-Style.css";
import "../styles/breadCrumbs-Style.css";
import "../styles/categoryCard.css";
import "../styles/consultdoctor.css";
import "../styles/login.css";
import "../styles/datetimeslot-Style.css";
import "../styles/easySteps.css";
import "../styles/header.css";
import "../styles/home.css";
import "../styles/healthConcern.css";
import "../styles/homesymptomslist.css";
import "../styles/joinOurTeam.css";
import "../styles/offerBanner.css";
import "../styles/tophospital.css";
import "../styles/DoctorList/doctorList-Style.css";
import "../styles/DoctorList/doctorList.css";
import "../styles/DoctorList/filterModel-Style.css";
import "../styles/Home/userReview-Style.css";
import "../styles/SpecialitiesList/specialityListStyle.css";
import "../styles/SymptomsList/symptomsCard.css";
import "../styles/SymptomsList/symptomsList.css";
import "../styles/sidebar.css";
import "../styles/settings.css";
import "../styles/profilesetting.css";
import "../styles/manageaddress.css";
import "../styles/member.css";
import "../styles/healthrecordslist.css";
import "../styles/feedbacklist.css";
import "../styles/notification.css";
import "../styles/wallethistory.css";
import "../styles/addmember.css";
import "../styles/healthrecord.css";
import "../styles/addaddress.css";
import "../styles/blog-style.css";
import "../styles/DoctorDetails/doctorregister.css";
import "../styles/registerstyle.css";
import "../styles/offersmodal.css";
import "../styles/offerdetail.css";
import "../styles/appointmentconfirmed.css";
import "../styles/appointmentList.css";
import "../styles/ePrescription-style.css";
import "../styles/appointmentdetails.css";
import "../styles/insurance.css";
import "../styles/feedbackModal.css";
import "../styles/referearnstyle.css";
import "../styles/DoctorDetails/videocallstyle.css";
import "../styles/DoctorDetails/chat-style.css";

import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "../utils/store";
import Header from "../components/Header/Header";
import Footer from "../components/Common/Footer";
import { useRouter } from "next/router";
import { RouterWrapper } from "../components/RouterWrapper";
import Breadcrumbs from "../components/Common/Breadcrumbs";
import { hideHeaderFooterUrls } from "../utils/breadcrumbConst";

type ComponentWithPageLayout = AppProps & {
  Component: AppProps["Component"] & {
    PageLayout?: React.ElementType;
  };
};

export const DEFAULT_IMAGE =
  "https://www.hoanmysaigon.com/upload/hoanmysaigon.com/images/service/2017-11-16/thumbnail_1510799445_m6Q82Xu5YC.jpg";

export default function App({ Component, pageProps }: ComponentWithPageLayout) {
  const router = useRouter();
  return (
    <Provider store={store}>
      {hideHeaderFooterUrls?.find((x) => x === router.pathname) ? (
        <></>
      ) : (
        <Header />
      )}
      <ToastContainer theme="colored" />
      <Breadcrumbs />

      <RouterWrapper router={router}>
        {Component.PageLayout ? (
          <Component.PageLayout>
            <Component {...pageProps} />
          </Component.PageLayout>
        ) : (
          <Component {...pageProps} />
        )}
      </RouterWrapper>
      {hideHeaderFooterUrls?.find((x) => x === router.pathname) ? (
        <></>
      ) : (
        <Footer />
      )}
    </Provider>
  );
}
