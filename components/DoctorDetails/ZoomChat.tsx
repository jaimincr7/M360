import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { TbSend } from "react-icons/tb";
import Image from "next/image";
import moment from "moment";
import { Formik } from "formik";
import InputControl from "../FormikControls/inputControl";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { ChatClient } from "@zoom/videosdk";
import { useTranslate } from "../../commonModules/translate";

interface ChatInfo {
  chatClient: typeof ChatClient;
  liveChats: any[];
  doctorDetails: {
    doctorId: number;
    profilePic: string;
    name: string;
  };
  patientDetails: {
    patientId: number;
    profilePic: string;
    name: string;
  };
}

function ZoomChat(props: { chatDetails: ChatInfo }) {
  type InitVal = {
    sendMsg: string;
  };

  const initVal: InitVal = {
    sendMsg: "",
  };
  const t = useTranslate();
  const validationSchema = Yup.object().shape({
    sendMsg: Yup.string().nullable().required(t("msg_required")),
  });

  const onSubmit = (values: InitVal, formikHelpers: any) => {
    const { sendMsg } = values;
    props.chatDetails.chatClient
      .send(sendMsg, props.chatDetails.doctorDetails.doctorId)
      .then((res: any) => {
        console.log(res, "chat send res");
        formikHelpers.resetForm();
      })
      .catch((err: any) => {
        console.log(err, "send err");
        toast.error(t("dr_is_not_connected"));
      });
  };

  return (
    <>
      <div className="chatboxMaincovBox">
        <div className="chatboxMaincovIner">
          <div className="chatboxDashb">
            {props.chatDetails.liveChats.map((chat) => {
              return chat.sender.userId ===
                props.chatDetails.doctorDetails.doctorId ? (
                <div className="userdrchtboxlist">
                  <div className="userdrchtlistImg">
                    <Image
                      src={props.chatDetails.doctorDetails.profilePic}
                      alt={props.chatDetails.doctorDetails.name}
                      height={40}
                      width={40}
                    />
                  </div>
                  <div className="userdrchtlistText">
                    <h6>{props.chatDetails.doctorDetails.name}</h6>
                    <h4>{chat.message}</h4>
                    <p>{chat.time}</p>
                  </div>
                </div>
              ) : (
                <div className="userdrchtboxlist">
                  <div className="userdrchtlistImg">
                    <Image
                      src="https://insmart-s3-storage.s3.ap-south-1.amazonaws.com/assets/images/no-image.jpg"
                      alt={props.chatDetails.patientDetails.name}
                      height={40}
                      width={40}
                    />
                  </div>
                  <div className="userdrchtlistText">
                    <h6>{props.chatDetails.patientDetails.name}</h6>
                    <h4>{chat.message}</h4>
                    <p>{chat.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="chatboxaction">
            <Formik
              initialValues={initVal}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <Form.Group className="Chatboxsendbox" controlId="">
                    <InputControl
                      name={"sendMsg"}
                      placeholder={t("write_msg_here")}
                    />
                    <Button type="submit">
                      {" "}
                      <TbSend />
                    </Button>
                  </Form.Group>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}

export default ZoomChat;
