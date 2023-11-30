import React, { useEffect, useState } from "react";
import { IoDocumentText, IoEyeSharp } from "react-icons/io5";
import {
  ShareScreenIcon,
  VideoCallIcon,
  MicIcon,
  MicMuteIcon,
  ShareScreenStopIcon,
  VideoCallStopIcon,
} from "../../public/assets";
import { Button } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import {
  appointmentStateSelector,
  getAppointmentAction,
} from "../../store/user/appointmentSlice";
import { CURRENT_USER } from "../../commonModules/localStorege";
import appointmentService from "../../services/appointmentService";
import ZoomVideo, {
  ChatClient,
  PassiveStopShareReason,
  Stream,
} from "@zoom/videosdk";
import moment from "moment";
import Countdown from "react-countdown";
import Image from "next/image";
import ZoomChat from "./ZoomChat";
import ConfirmModal from "../Common/ConfirmModal";
import { toast } from "react-toastify";
import { useTranslate } from "../../commonModules/translate";

interface VideoCallState {
  isVideoOn: boolean;
  isDoctorVideoOn: boolean;
  isAudioOn: boolean;
  isSharingScreen: boolean;
  isCanvasUsed: boolean;
  isDoctorSharingScreen: boolean;
}

function VideoCall() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const appointmentState = useAppSelector(appointmentStateSelector);
  const videoCallStateRef: any = React.useRef(null);
  const [zoomReady, setZoomReady] = useState<boolean>(false);
  const [videoCallState, setVideoCallState] = useState<VideoCallState>({
    isAudioOn: false,
    isCanvasUsed: false,
    isDoctorSharingScreen: false,
    isDoctorVideoOn: false,
    isSharingScreen: false,
    isVideoOn: false,
  });
  const { id: appointmentId } = router.query;
  const currentUser = CURRENT_USER();
  const [mediaStream, setMediaStream] = useState<typeof Stream>();
  const [isSupportGalleryView, setIsSupportGalleryView] = useState<any>();
  const [appointmentDetail, setAppointmentDetail] = useState<any>({});
  const [chatClient, setChatClient] = useState<typeof ChatClient>(null);
  const [liveChats, setLiveChats] = useState<any[]>([]);
  const [doctorUser, setDoctorUser] = useState<any>([]);
  const [patientUser, setPatientUser] = useState<any>([]);
  const [sessionLeaveConfirm, setSessionLeaveConfirm] =
    useState<boolean>(false);

  const selfVideoElementId = "self-view-video",
    selfCanvasElementId = "self-view-canvas";
  const doctorCanvasElementId = "participants-canvas";
  const doctorScreenCanvasElementId = "participants-screen-canvas";
  const screenShareVideoElementId = "screen-share-video",
    screenShareCanvasElementId = "screen-share-canvas";
  const mainViewWidth = 960,
    mainViewHeight = 540;
  const smallViewwidth = 130,
    smallViewHeight = 100;

  const zmClient = ZoomVideo.createClient();

  const t = useTranslate();

  // querySelector function
  const qs = (elementId: string) => {
    return document.querySelector(`#${elementId}`);
  };

  const selfViewVideoCords = (forFullView = false) => {
    if (forFullView || !videoCallState.isDoctorVideoOn) {
      return {
        w: mainViewWidth,
        h: mainViewHeight,
        x: 0,
        y: 0,
      };
    } else {
      return {
        w: smallViewwidth,
        h: smallViewHeight,
        x: mainViewWidth - smallViewwidth - 20,
        y: mainViewHeight - smallViewHeight - 20,
      };
    }
  };

  const elements = {
    selfVideo: (): HTMLVideoElement =>
      qId(selfVideoElementId) as HTMLVideoElement,
    selfCanvas: (): HTMLCanvasElement =>
      qs(selfCanvasElementId) as HTMLCanvasElement,
    screenShareVideo: (): HTMLVideoElement =>
      qId(screenShareVideoElementId) as HTMLVideoElement,
    screenShareCanvas: (): HTMLCanvasElement =>
      qs(screenShareCanvasElementId) as HTMLCanvasElement,
    doctorCanvas: (): HTMLCanvasElement =>
      qs(doctorCanvasElementId) as HTMLCanvasElement,
    doctorScreenCanvas: (): HTMLCanvasElement =>
      qs(doctorScreenCanvasElementId) as HTMLCanvasElement,
  };

  // getElementById function
  const qId = (elementId: string) => {
    return document.getElementById(elementId);
  };

  const stopMyVideo = async () => {
    if (videoCallState.isVideoOn) {
      try {
        let stream = mediaStream;
        if (!stream) {
          stream = zmClient.getMediaStream();
          setMediaStream(stream);
        }

        if (stream) {
          await stream.stopVideo();
          console.log("My video stopped");
        }
        updateVideoState({ isVideoOn: false });
      } catch (err: any) {
        console.log("Error while video off", err);
      }
    }
  };

  const updateVideoState = (stateChanges: Partial<VideoCallState>) => {
    videoCallStateRef.current = {
      ...(videoCallStateRef.current || videoCallState),
      ...stateChanges,
    };
    setVideoCallState(videoCallStateRef.current);
  };

  const stopDoctorVideo = async () => {
    if (videoCallState.isDoctorVideoOn) {
      await mediaStream.stopRenderVideo(
        elements.doctorCanvas(),
        patientUser.userId
      );
      updateVideoState({ isDoctorVideoOn: false });
    }
  };

  useEffect(() => {
    if (appointmentState.appointmentDetail?.data) {
      if (Object.keys(appointmentState?.appointmentDetail.data).length !== 0)
        setAppointmentDetail(appointmentState?.appointmentDetail?.data);
      else dispatch(getAppointmentAction(Number(appointmentId)));
    }
  }, [appointmentId, appointmentState.appointmentDetail?.data]);

  useEffect(() => {
    const zoomCallSetup = async () => {
      await initZoomCall();
    };
    zoomCallSetup();
  }, [appointmentId]);

  const initZoomCall = async () => {
    let topic = "Appointment-" + appointmentId;
    let userName = "Patient-" + currentUser?.doctorId;

    const init = async () => {
      await zmClient.init("en-US", `CDN`);
      try {
        const tokenResp = await appointmentService.getZoomAuthToken({
          appointmentId: appointmentId as unknown as number,
          isDoctor: false,
          userName,
        });
        const token = tokenResp.data.zoomToken;
        const stream = zmClient.getMediaStream();
        setMediaStream(stream);
        setIsSupportGalleryView(stream.isSupportMultipleVideos());

        await zmClient
          .join(topic, token, userName, "")
          .then(() => {
            setZoomReady(true);
            stream.startAudio().catch((err) => {
              console.log("Error while starting audio", err);
            });

            let chat = zmClient.getChatClient();
            setChatClient(chat);
            const cUser = zmClient.getCurrentUserInfo();
            setPatientUser(cUser);
            zmClient.getAllUser().forEach((user) => {
              if (cUser.userId !== user.userId) {
                setDoctorUser(user);

                if (user.bVideoOn) {
                  stream
                    .renderVideo(
                      elements.doctorCanvas(),
                      user.userId,
                      mainViewWidth,
                      mainViewHeight,
                      0,
                      0,
                      2
                    )
                    .then(() => {
                      updateVideoState({ isDoctorVideoOn: true });
                    });
                }
              }
            });
          })
          .catch((e) => {
            if (e.reason && e.reason !== "duplicated operation") {
              toast.error(t("error_while_joining_zoom"));
            } else {
              setZoomReady(true);
            }

            console.log(t("error_while_joining_zoom"), e);
          });

        zmClient?.on("user-added", (payload) => {
          setPatientUser(payload[0]);
          toast.success(`${t("dr_join_call")}`, {
            toastId: "doctor-joined-alert",
          });
        });

        // Video state change of participant
        zmClient?.on("peer-video-state-change", async (payload) => {
          console.log("peer-video-state-change");
          if (payload.action === "Start") {
            await stream.renderVideo(
              elements.doctorCanvas(),
              payload.userId,
              mainViewWidth,
              mainViewHeight,
              0,
              0,
              2
            );
            updateVideoState({ isDoctorVideoOn: true });
          } else if (payload.action === "Stop") {
            await stopDoctorVideo();
          }
        });

        zmClient?.on(
          "passively-stop-share",
          (payload: PassiveStopShareReason) => {
            if (payload === "StopScreenCapture") {
              updateVideoState({ isSharingScreen: false });
            }
          }
        );

        // participants screen share change
        zmClient.on("active-share-change", async (payload: any) => {
          console.log("participants screen share change");
          if (payload.state === "Active") {
            //await stopDoctorVideo();
            //await stopMyVideo();
            await stream.startShareView(
              elements.doctorScreenCanvas(),
              payload.userId
            );
            updateVideoState({ isDoctorSharingScreen: true });
          } else if (payload.state === "Inactive") {
            await stream.stopShareView();
            updateVideoState({ isDoctorSharingScreen: false });
          }
        });

        zmClient.on("chat-on-message", (payload) => {
          if (payload) {
            setLiveChats((prev) => [
              ...prev,
              {
                sender: payload.sender,
                message: payload.message,
                time: moment().format("hh:mm A"),
              },
            ]);
          }
        });
      } catch (e: any) {
        console.log(e.reason);
      }
    };
    init();
    return () => {
      //zmClient.destroyClient();
    };
  };

  const handleVideo = async () => {
    if (!zoomReady) {
      toast.error(t("zoom_not_init"));
      return;
    }

    if (
      videoCallState.isDoctorSharingScreen ||
      videoCallState.isSharingScreen
    ) {
      toast.error(t("cannot_turn_vide_dur_screen_share"));
      return;
    }

    if (!videoCallState.isVideoOn) {
      const cords = selfViewVideoCords(true);
      // if Desktop Chrome, Edge, and Firefox with SharedArrayBuffer not enabled, Android browsers, and on devices with less than 4 logical processors available
      // @ts-ignore
      if (
        (!mediaStream.isSupportMultipleVideos() &&
          typeof OffscreenCanvas === "function") ||
        /android/i.test(navigator.userAgent)
      ) {
        // start video - video will render automatically on HTML Video Element if MediaStreamTrackProcessor is supported
        mediaStream
          .startVideo({
            videoElement: elements.selfVideo(),
            mirrored: false,
            captureWidth: cords.w,
            captureHeight: cords.h,
          })
          .then(() => {
            // if MediaStreamTrackProcessor is not supported
            // @ts-ignore
            if (!(typeof MediaStreamTrackProcessor === "function")) {
              // render video on HTML Canvas Element
              mediaStream
                .renderVideo(
                  elements.selfCanvas(),
                  zmClient.getCurrentUserInfo().userId,
                  cords.w,
                  cords.h,
                  cords.x,
                  cords.y,
                  2
                )
                .then(() => {
                  updateVideoState({
                    isCanvasUsed: true,
                    isVideoOn: true,
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              updateVideoState({
                isCanvasUsed: false,
                isVideoOn: true,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
        // desktop Chrome, Edge, and Firefox with SharedArrayBuffer enabled, and all other browsers
      } else {
        // start video
        mediaStream
          .startVideo()
          .then(() => {
            // render video on HTML Canvas Element
            mediaStream
              .renderVideo(
                elements.selfCanvas(),
                zmClient.getCurrentUserInfo().userId,
                cords.w,
                cords.h,
                cords.x,
                cords.y,
                2
              )
              .then(() => {
                updateVideoState({
                  isCanvasUsed: true,
                  isVideoOn: true,
                });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      await stopMyVideo();
    }
  };

  const handleAudio = () => {
    if (!zoomReady) {
      toast.error(t("zoom_not_init"));
      return;
    }

    if (!videoCallState.isAudioOn) {
      mediaStream
        .unmuteAudio()
        .then((res) => {
          console.log("Audio unmute", res);
          updateVideoState({ isAudioOn: true });
        })
        .catch((err) => {
          console.log("Error while unmute audio", err);
        });
    } else {
      mediaStream
        .muteAudio()
        .then((res) => {
          updateVideoState({ isAudioOn: false });
        })
        .catch((err) => {
          console.log("Error while audio off", err);
        });
    }
  };

  const handleShareScreen = async () => {
    if (!zoomReady) {
      toast.error(t("zoom_not_init"));
      return;
    }

    if (videoCallState.isDoctorSharingScreen) {
      toast.error(
        t("dr_screen_share")
      );
      return;
    }

    if (!videoCallState.isSharingScreen) {
      // @ts-ignore
      if (typeof MediaStreamTrackProcessor === "function") {
        //await stopMyVideo();
        //await stopDoctorVideo();

        // @ts-ignore
        await mediaStream.startShareScreen(elements.screenShareVideo());
        updateVideoState({ isSharingScreen: true });
      } else {
        await mediaStream.startShareScreen(elements.screenShareCanvas());
        updateVideoState({ isSharingScreen: true });
      }
    } else {
      await mediaStream.stopShareScreen();
      updateVideoState({ isSharingScreen: false });
    }
  };

  const handleTabChange = (event: any) => {
    console.log(event);
  };

  const onEndVidoCall = () => {
    setSessionLeaveConfirm(true);
  };

  const handleConfirmSessionEnd = () => {
    zmClient.leave().then((res) => {
      router.push(`/me/appointment/details/${appointmentId}`);
      setSessionLeaveConfirm(false);
    });
  };

  const onConfirmModalCls = () => {
    setSessionLeaveConfirm(false);
  };

  const getCounterDate = () => {
    let existingStorageVdoDetail: any = localStorage.getItem("videoCallDetail");
    existingStorageVdoDetail = existingStorageVdoDetail
      ? JSON.parse(existingStorageVdoDetail)
      : null;
    if (
      existingStorageVdoDetail &&
      appointmentDetail?.appointmentNumber === existingStorageVdoDetail?.appNo
    ) {
      const existingStartTimeArr =
        existingStorageVdoDetail?.startTime?.split(":");
      if (existingStartTimeArr?.length) {
        const actDiffHourInSec =
          (moment().get("hours") - existingStartTimeArr[0]) * 60 * 60;
        const actDiffMinInSec =
          (moment().get("minutes") - existingStartTimeArr[1]) * 60;
        const actDiffSec = moment().get("seconds") - existingStartTimeArr[2];
        return moment()
          .add(
            Number(appointmentDetail?.timeSlotDuration) * 60 -
              (actDiffHourInSec + actDiffMinInSec + actDiffSec),
            "s"
          )
          .valueOf();
      } else {
        return moment()
          .add(Number(appointmentDetail?.timeSlotDuration) * 60, "s")
          .valueOf();
      }
    } else {
      return moment()
        .add(Number(appointmentDetail?.timeSlotDuration) * 60, "s")
        .valueOf();
    }
  };

  return (
    <>
      {sessionLeaveConfirm && (
        <ConfirmModal
          show={sessionLeaveConfirm}
          onClose={onConfirmModalCls}
          info={t("leave_confirm_session")}
          title={t("leave_session")}
          onConfirm={handleConfirmSessionEnd}
        />
      )}
      <div className="VideocallBgcov">
        <div className="container">
          <div className="VideocallInerdata">
            <div className="VideocallInerLeft">
              <div className="VideocallBoxmain">
                <div className="VideocallBoxTop">
                  <p># {appointmentDetail?.appointmentNumber}</p>
                  <h3>
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <ellipse
                        cx="10.6205"
                        cy="11.2613"
                        rx="10.4643"
                        ry="10.6402"
                        fill="white"
                        fill-opacity="0.63"
                      />
                      <ellipse
                        cx="10.6216"
                        cy="11.2613"
                        rx="3.96921"
                        ry="4.03592"
                        fill="#EB5757"
                      />
                    </svg>
                    {Number(appointmentDetail?.timeSlotDuration) > 0 && (
                      <Countdown
                        date={getCounterDate()}
                        onStart={() => {
                          let existingStorageVdoDetail: any =
                            localStorage.getItem("videoCallDetail");
                          existingStorageVdoDetail = existingStorageVdoDetail
                            ? JSON.parse(existingStorageVdoDetail)
                            : null;
                          if (
                            !existingStorageVdoDetail ||
                            appointmentDetail?.appointmentNumber !==
                              existingStorageVdoDetail?.appNo
                          ) {
                            localStorage.setItem(
                              "videoCallDetail",
                              JSON.stringify({
                                appNo: appointmentDetail?.appointmentNumber,
                                startTime: moment().format("HH:mm:ss"),
                              })
                            );
                          }
                        }}
                        intervalDelay={0}
                        renderer={(props) => {
                          return Number(appointmentDetail?.timeSlotDuration) >
                            60 ? (
                            <div>
                              {props.hours}:{props.minutes}:{props.seconds} Left{" "}
                            </div>
                          ) : (
                            <div>
                              {props.minutes}:{props.seconds} Left{" "}
                            </div>
                          );
                        }}
                        onComplete={() => {
                          localStorage.removeItem("videoCallDetail");
                          handleConfirmSessionEnd();
                        }}
                      />
                    )}
                  </h3>
                  {/* <h6>26 Aug 2022, 11:12 AM</h6> */}
                  <h6>
                    {moment(appointmentDetail?.appointmentDateTime).format(
                      "DD MMM YYYY, hh:mm A"
                    )}
                  </h6>
                </div>
                <div className="VideocallBoxMid">
                  <video
                    id="self-view-video"
                    width="650"
                    height="400"
                    className={
                      videoCallState.isDoctorVideoOn ? "small-video-box" : ""
                    }
                    style={
                      !videoCallState.isSharingScreen &&
                      !videoCallState.isDoctorSharingScreen &&
                      videoCallState.isVideoOn &&
                      !videoCallState.isCanvasUsed
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  ></video>
                  <canvas
                    id="self-view-canvas"
                    width="650"
                    height="400"
                    className={
                      videoCallState.isDoctorVideoOn ? "small-video-box" : ""
                    }
                    style={
                      !videoCallState.isSharingScreen &&
                      !videoCallState.isDoctorSharingScreen &&
                      videoCallState.isVideoOn &&
                      videoCallState.isCanvasUsed
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  ></canvas>
                  <canvas
                    id="participants-canvas"
                    width="650"
                    height="400"
                    style={
                      !videoCallState.isSharingScreen &&
                      !videoCallState.isDoctorSharingScreen &&
                      videoCallState.isDoctorVideoOn
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  ></canvas>
                  <canvas
                    id="participants-screen-canvas"
                    width="650"
                    height="400"
                    style={
                      !videoCallState.isSharingScreen &&
                      videoCallState.isDoctorSharingScreen
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  ></canvas>
                  <video
                    id="screen-share-video"
                    width="650"
                    height="400"
                    style={
                      videoCallState.isSharingScreen &&
                      !videoCallState.isCanvasUsed
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  ></video>
                  <canvas
                    id="screen-share-canvas"
                    width="650"
                    height="400"
                    style={
                      videoCallState.isSharingScreen &&
                      videoCallState.isCanvasUsed
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  ></canvas>
                </div>
                <div className="VideocallBoxBot">
                  <a onClick={handleShareScreen}>
                    <Image
                      src={
                        videoCallState.isSharingScreen
                          ? ShareScreenStopIcon.src
                          : ShareScreenIcon.src
                      }
                      alt="Share Screen"
                      width={40}
                      height={40}
                    />
                    <span>Share Screen</span>
                  </a>
                  <a onClick={handleVideo}>
                    <Image
                      src={
                        videoCallState.isVideoOn
                          ? VideoCallIcon.src
                          : VideoCallStopIcon.src
                      }
                      alt="Video"
                      width={40}
                      height={40}
                    />
                    <span>{t("video")}</span>
                  </a>
                  <a onClick={handleAudio}>
                    <Image
                      src={
                        videoCallState.isAudioOn ? MicIcon.src : MicMuteIcon.src
                      }
                      alt="Mic"
                      width={40}
                      height={40}
                    />
                    <span>{t("mic")}</span>
                  </a>
                  <Button className="VideoEndcallbtn" onClick={onEndVidoCall}>
                    {t("end_call_t")}
                  </Button>
                </div>
              </div>
            </div>
            <div className="VideocallInerRight">
              <div className="InfoandChatbox">
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                  <Nav variant="pills" className="InfoadChatboxLink">
                    <Nav.Item>
                      <Nav.Link eventKey="first">{t("basic_info")}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="second">{t("chat")}</Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content className="basicandchatboxCov">
                    <Tab.Pane eventKey="first">
                      <div className="Vidcallinfobox">
                        <div className="Vidcallinfosettop">
                          <h3>{appointmentDetail?.patient?.fullName}</h3>
                          <p>
                            {appointmentDetail?.patient?.gender === "M"
                              ? "Male"
                              : "Female"}{" "}
                            |{" "}
                            {
                              moment(appointmentDetail?.patient?.birthDate)
                                .fromNow()
                                .split(" ")[0]
                            }{" "}
                            {t("years")}
                          </p>
                          <p>
                            +{appointmentDetail?.patient?.phoneCode}{" "}
                            {appointmentDetail?.patient?.mobileNumber}
                          </p>
                          <p> {appointmentDetail?.patient?.email}</p>
                          <p>{appointmentDetail?.patient?.uniqueId}</p>
                        </div>
                        <div className="VidcallinfosetSymp">
                          <h3>{t("Symptoms")}</h3>
                          <p>
                            {" "}
                            {appointmentDetail?.appointmentSymptoms
                              ?.map((x) => x.name)
                              ?.join(", ")}
                          </p>
                        </div>
                        {appointmentDetail?.healthRecords?.length > 0 && (
                          <div className="VidcallinfosetHeaReco">
                            <h3>{t("helth_records")}</h3>
                            {appointmentDetail.healthRecords.map(
                              (healthRecord: any, i: number) =>
                                healthRecord.appointmentHelathRecordFiles?.map(
                                  (rec, j: number) => (
                                    <div
                                      className="VidcallsetHeaRecoList"
                                      key={`health-record-${i}-${j}`}
                                    >
                                      <IoDocumentText />
                                      <span>{rec.name}</span>
                                      <a
                                        href={rec.filePath}
                                        rel="noreferrer"
                                        target="_blank"
                                      >
                                        <IoEyeSharp />
                                      </a>
                                    </div>
                                  )
                                )
                            )}
                          </div>
                        )}
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                      <ZoomChat
                        chatDetails={{
                          chatClient,
                          liveChats,
                          doctorDetails: {
                            doctorId: doctorUser?.userId,
                            profilePic:
                              appointmentDetail?.doctorAppointmentDetails
                                ?.photoPath,
                            name: appointmentDetail?.doctorAppointmentDetails
                              ?.fullName,
                          },
                          patientDetails: {
                            patientId: patientUser?.userId,
                            profilePic: currentUser?.photoPath,
                            name: currentUser?.fullName,
                          },
                        }}
                      />
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoCall;
