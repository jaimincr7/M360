import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDropzone } from "react-dropzone";
import { BsFillFileEarmarkPlusFill, BsInfoCircleFill } from "react-icons/bs";
import { FaFilePrescription, FaFolderPlus } from "react-icons/fa";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { FormikProps, useFormikContext } from "formik";
import { AiFillFile } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { CURRENT_USER } from "../../../commonModules/localStorege";
import { UploadFile } from "../../../public/assets";
import { symptomsListSelector } from "../../../store/symptomsList/symptomsListSlice";
import {
  getUserHealthRecords,
  userHealthRecordSelector,
} from "../../../store/user/userHealthRecordSlice";
import {
  HealthRecordType,
  HealthRecordUploadFileType,
} from "../../../utils/constant";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import commonService from "../../../services/commonService";
import {
  createUserHealthRecord,
  IHealthRecordFileType,
} from "../../../store/user/userDetailsSlice";
import { useTranslate } from "../../../commonModules/translate";

function HealthRecord(props: any) {
  const { isForModal, onComplete, durationVal } = props;
  const { values, setFieldValue }: FormikProps<any> = useFormikContext();
  const dispatch = useAppDispatch();
  const currentUser = CURRENT_USER();
  const symptoms = useAppSelector(symptomsListSelector);
  const healthRecordsSlice = useAppSelector(userHealthRecordSelector);
  const [healthRecordLookups, setHealthRecordLookups] = useState<any[]>([]);
  const [symptomsLookups, setSymptomsLookups] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isHealthRecordCreating, setIsHealthRecordCreating] =
    useState<boolean>(false);

  const t = useTranslate();

  useEffect(() => {
    if (!isForModal)
      dispatch(
        getUserHealthRecords({ userId: currentUser?.userId, duration: 0 })
      );
  }, []);

  useEffect(() => {
    if (symptoms?.data?.symptomsList?.length) {
      setSymptomsLookups(
        symptoms.data.symptomsList.map((smp) => ({
          value: smp?.symptomId,
          label: smp?.name,
        }))
      );
    }
  }, [symptoms?.data?.symptomsList]);

  useEffect(() => {
    if (healthRecordsSlice?.userHealthRecordList?.userHealthRecords?.length) {
      setHealthRecordLookups(
        healthRecordsSlice.userHealthRecordList.userHealthRecords.map((x) => ({
          value: x.userHealthRecordId,
          label: x.name,
        }))
      );
    }
  }, [healthRecordsSlice?.userHealthRecordList?.userHealthRecords]);

  const animatedComponents = makeAnimated();
  const onDrop = (acceptedFiles: any) => {
    const acceptedFileExt = acceptedFiles?.map((x) =>
      x.name?.split(".")?.pop()?.toString()?.toLowerCase()
    );
    const filteredExt = acceptedFileExt.filter(function (obj) {
      return ["jpg", "jpeg", "png", "pdf"].indexOf(obj) == -1;
    });
    if (filteredExt?.length) {
      toast.error(t("png_jpg_jpeg_pdf_download"));
    } else {
      const existingFiles: any[] = [...uploadedFiles].concat(acceptedFiles);
      setUploadedFiles(existingFiles);
    }
  };

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/png": [".png"],
      "image/PNG": [".PNG"],
      "image/jpg": [".jpg"],
      "image/JPG": [".JPG"],
      "image/jpeg": [".jpeg"],
      "image/JPEG": [".JPEG"],
      "application/pdf": [".pdf"],
    },
    // maxSize: 2 * 1024 * 1024,
  });

  useEffect(() => {
    if (fileRejections?.length) {
      const newErrors: any[] = [];
      fileRejections.forEach((element) => {
        if (element.errors?.length) {
          const code = element.errors[0].code;
          if (!newErrors.find((x) => x.code === code))
            newErrors.push({
              code,
              message:
                code === "file-too-large"
                  ? t("file_size_less_than_2mb")
                  : code === "file-invalid-type"
                    ? t("png_jpg_jpeg_pdf_download")
                    : element.errors[0].message,
            });
        }
      });
      toast.error(newErrors.map((x) => x.message).toString());
    }
  }, [fileRejections]);

  const onDeleteUploadedFile = (index: number) => {
    const existingFiles: any[] = [...uploadedFiles];
    existingFiles.splice(index, 1);
    setUploadedFiles(existingFiles);
  };

  const onFileUpload = () => {
    if (values?.recordName) {
      setIsHealthRecordCreating(true);
      const payloadDetail: { fileName: string; fileType: number }[] = [];
      uploadedFiles.forEach((element) => {
        if (element.type === "application/pdf") {
          payloadDetail.push({
            fileName: element.name,
            fileType: HealthRecordUploadFileType.PDF,
          });
        } else {
          payloadDetail.push({
            fileName: element.name,
            fileType: HealthRecordUploadFileType.Image,
          });
        }
      });
      try {
        commonService.getFileUploadDetails(payloadDetail).then(async (res) => {
          const fileDataForHealthRecord: IHealthRecordFileType[] = [];
          if (res?.data) {
            let index = 0;
            for await (const fileUploadRes of res.data?.fileUploads) {
              const { uploadUrl, fileHttpUrl } = fileUploadRes;
              await commonService
                .uploadFile(uploadUrl, uploadedFiles[index])
                .then((res) => {
                  if (res && res.status === 200 && res.ok) {
                    fileDataForHealthRecord.push({
                      name: payloadDetail[index].fileName.toString(),
                      fileType: payloadDetail[index].fileType,
                      filePath: fileHttpUrl,
                    });
                  }
                });
              index++;
            }
            if (fileDataForHealthRecord?.length > 0) {
              dispatch(
                createUserHealthRecord({
                  name: values.recordName,
                  remark: values.remark,
                  userId: currentUser.userId,
                  healthRecordType: values.healthRecordFileType, // Report, prescription, other
                  files: fileDataForHealthRecord,
                })
              )
                .then((createHealthRes) => {
                  if (createHealthRes.payload?.isSuccess) {
                    toast.success(t("health_record_create_success"));
                    dispatch(
                      getUserHealthRecords({
                        userId: currentUser?.userId,
                        duration: durationVal ? durationVal : 0,
                      })
                    );
                    if (!isForModal) {
                      setFieldValue("recordName", "");
                      setFieldValue("remark", "");
                      setFieldValue(
                        "healthRecordFileType",
                        HealthRecordType.Report
                      );
                      setUploadedFiles([]);
                      setFieldValue("healthRecordType", "existing");
                      setFieldValue("healthRecord", [
                        {
                          value: createHealthRes.payload.data,
                          label: values.recordName,
                        },
                      ]);
                    } else {
                      onComplete();
                    }
                    setIsHealthRecordCreating(false);
                  }
                })
                .finally(() => {
                  setIsHealthRecordCreating(false);
                });
            }
          }
        });
      } catch (error) {
        setIsHealthRecordCreating(false);
        toast.error(t("went_wrong"));
      }
    } else {
      toast.error(t("record_name_required"));
    }
  };

  return (
    <>
      {/* <TPAVerificationCode show={show} onHide={() => handleClose()} /> */}
      <div className={isForModal ? "" : "patientdetialCard"}>
        {!isForModal && (
          <>
            <h6>{t("HealthRecord")}</h6>
            <div className="healthrecodeCov">
              <>
                {["radio"].map((type: any) => (
                  <div key={`default-${type}`} className="healthrecodelist">
                    <div
                      className="healthrecodeIn RigthBorderrbbtn"
                      onClick={() => {
                        setFieldValue("healthRecordType", "existing");
                        setFieldValue("recordName", "");
                        setFieldValue("remark", "");
                        setUploadedFiles([]);
                        setFieldValue(
                          "healthRecordFileType",
                          HealthRecordType.Report
                        );
                      }}
                    >
                      <Form.Check
                        className="custChboxcov"
                        inline
                        label={t("existing_record")}
                        name="group2"
                        type={type}
                        id={`inline-${type}-3`}
                        checked={values.healthRecordType === "existing"}
                      />
                    </div>
                    <div
                      className="healthrecodeIn"
                      onClick={() => {
                        setFieldValue("healthRecordType", "new");
                        setFieldValue("healthRecord", "");
                      }}
                    >
                      <Form.Check
                        className="custChboxcov"
                        inline
                        label={t("new_health_record")}
                        name="group2"
                        type={type}
                        id={`inline-${type}-4`}
                        checked={values.healthRecordType === "new"}
                      />
                    </div>
                  </div>
                ))}
              </>
            </div>
          </>
        )}

        {/* Existing Record Form Start */}
        {/* <div className="RemasltsmptBox">
                    <div className="FormComSelectSet">
                        <Select
                            components={animatedComponents}
                            options={option3}
                            classNamePrefix="react-select"
                            defaultValue={option3[0]}
                        />
                    </div>
                    <div className="FormComInputSet">
                        <Form.Group className="Compastdetauilsmain" controlId="">
                            <Form.Control type="" placeholder="Remark" />
                        </Form.Group>
                    </div>
                    <div className="FormComSelectSet">
                        <Select
                            components={animatedComponents}
                            options={option2}
                            classNamePrefix="react-select"
                            defaultValue={option2[0]}
                        />
                    </div>
                    <div className="findbtnnumbernotecov">
                        <p><a href=""><BsInfoCircleFill /></a> Select symtoms that best describe your health condition right now</p>
                    </div>
                </div> */}
        {/* Existing Record Form End */}

        {values.healthRecordType === "new" ? (
          <>
            <div className="formrecorsnmecov">
              <Form.Group className="Compastdetauilsmain" controlId="">
                <Form.Control
                  type=""
                  placeholder={t("record_name") + "*"}
                  name={"recordName"}
                  value={values?.recordName}
                  onChange={(e) => setFieldValue("recordName", e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="FormComInputSet mt-3">
              <Form.Group className="Compastdetauilsmain" controlId="">
                <Form.Control
                  type=""
                  placeholder={t("remark")}
                  name={"remark"}
                  value={values.remark}
                  onChange={(e) => setFieldValue("remark", e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="typerofrecode">
              <h4>{t("types_of_record")}</h4>
              <a
                href="javascript:;"
                className={
                  values?.healthRecordFileType === HealthRecordType.Report
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFieldValue("healthRecordFileType", HealthRecordType.Report)
                }
              >
                <FaFolderPlus />
                <span>{t("REPORT")}</span>
              </a>
              <a
                href="javascript:;"
                className={
                  values?.healthRecordFileType === HealthRecordType.Prescription
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFieldValue(
                    "healthRecordFileType",
                    HealthRecordType.Prescription
                  )
                }
              >
                <FaFilePrescription />
                <span>{t("Prescription")}</span>
              </a>
              <a
                href="javascript:;"
                className={
                  values?.healthRecordFileType === HealthRecordType.Other
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFieldValue("healthRecordFileType", HealthRecordType.Other)
                }
              >
                <BsFillFileEarmarkPlusFill />
                <span>{t("Other")}</span>
              </a>
            </div>

            <div className="UploadHealthrecov">
              <div className="drop-mainset" {...getRootProps({})}>
                <div className="drop-updata">
                  <input {...getInputProps()} />
                  <Image src={UploadFile} alt="uploadFile" />
                  <p>
                    {t("upload_health_record_here")}
                  </p>
                  <h4>{t("supports_file_type")}</h4>
                </div>

                {/* <img src={imagePrev} className="upldedimgsetcov" alt="" /> */}
              </div>
              {uploadedFiles?.map((x: any, i: number) => (
                <div className="uploadedRecordIner" key={`upload-img-${i}`}>
                  <p>
                    <AiFillFile />
                    {x.name}
                  </p>
                  <a
                    href="javascript:;"
                    onClick={() => onDeleteUploadedFile(i)}
                  >
                    <MdDelete />
                  </a>
                </div>
              ))}
              {!isForModal && (
                <Button
                  type="button"
                  onClick={onFileUpload}
                  disabled={
                    uploadedFiles?.length === 0 || isHealthRecordCreating
                  }
                >
                  {t("upload")}
                </Button>
              )}
            </div>
            {isForModal && (
              <div className="ComsetBtnSaveFull">
                <Button
                  onClick={onFileUpload}
                  disabled={
                    uploadedFiles?.length === 0 || isHealthRecordCreating
                  }
                >
                  {t("Submit")}
                </Button>
              </div>
            )}
            {/* <>
                    <div className="orlineset">
                        <p>OR</p>
                    </div>

                    <div className="uploadedRecordCov">
                        <h6>Uploaded Health Record from TPA Data base</h6>
                        <div className="uploadedRecordIner">
                            <p><BsFileEarmarkPdfFill /> Health Record.pdf</p>
                            <a href=""><MdDelete /></a>
                        </div>
                    </div>
                    <div className="patienthltrecodata">
                        <h6>Import Health Record from TPA Data base <a href=""><BsInfoCircleFill /></a></h6>
                        <Row>
                            <Col md={6}>
                                <div className="FormComInputSet FormComDateSet">
                                    <DatePicker
                                    selected={date}
                                    onChange={onChange}
                                    className="form-control"
                                /> 
                                    <IoCalendar />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className='FormComInputSet MobnumbInourset'>
                                    <div className='FormComCountrycodeSet'>
                                        <Select
                                            components={animatedComponents}
                                            options={countrycode}
                                            classNamePrefix="react-select"
                                            defaultValue={countrycode[0]}
                                        />
                                    </div>
                                    <Form.Group controlId="">
                                        <Form.Control type="" placeholder="Mobile Number*" />
                                    </Form.Group>
                                </div>
                            </Col>
                            <Col md={12}>
                                <div className="FormComInputSet">
                                    <Form.Group className="Compastdetauilsmain" controlId="">
                                        <Form.Control type="" placeholder="Case Number*" />
                                    </Form.Group>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div className="findbtnnumbernotecov">
                        <p><a href=""><BsInfoCircleFill /></a> Find the number in the SMS/email/Insmart app/Zalo OA</p>
                    </div>
                     <Button onClick={handleShow} className="VerifyHealthrecodbtn">Verify</Button>
                    </> */}
          </>
        ) : (
          <div className="FormComSelectSet">
            <Select
              components={animatedComponents}
              options={healthRecordLookups}
              classNamePrefix="react-select"
              value={values?.healthRecord}
              placeholder={t("select_heath_record") + "*"}
              onChange={(val) => setFieldValue("healthRecord", val)}
              isMulti
            />
          </div>
        )}
      </div>

      {!isForModal && (
        <div className="patientdetialCard">
          <h6>{t("Symptoms")}</h6>
          <div className="RemasltsmptBox">
            <div className="FormComSelectSet">
              <Select
                isMulti={true}
                components={animatedComponents}
                options={symptomsLookups}
                classNamePrefix="react-select"
                placeholder={t("select_symptoms") + '*'}
                onChange={(val) => setFieldValue("symptoms", val)}
              />
            </div>
            <div className="findbtnnumbernotecov">
              <p>
                <a href="javascript:;">
                  <BsInfoCircleFill />
                </a>{" "}
                {t("select_symptom_msg")}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HealthRecord;
