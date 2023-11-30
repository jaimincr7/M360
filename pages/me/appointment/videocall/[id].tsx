import dynamic from "next/dynamic";

const DynamicZoomVideoComp = dynamic(
  () => import("../../../../components/DoctorDetails/VideoCall"),
  {
    ssr: false,
  }
);

function AppointmentVideoCall() {
  return <DynamicZoomVideoComp />;
}

export default AppointmentVideoCall;
