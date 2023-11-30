import React, { useState, useMemo, useContext, useEffect } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";

import { BiUpload } from "react-icons/bi";
import { BsFillFileEarmarkTextFill } from "react-icons/bs";
import { IoIosCloseCircle } from "react-icons/io";
import { useDropzone } from "react-dropzone";
import { useAppDispatch } from "../../../utils/hooks";
import { RegisterDRContext } from "../../../pages/join-as-doctor";
import {
  createDoctor,
  ICreateDoctor,
} from "../../../store/doctorList/doctorListSlice";
import { DoctorFileType } from "../../../utils/constant";
import { toast } from "react-toastify";
import commonService from "../../../services/commonService";
import { useRouter } from "next/router";
import { useTranslate } from "../../../commonModules/translate";

function DoctorBasicDetails() {
  const registerDrContext: any = useContext(RegisterDRContext);
  const {
    setCurrentStep,
    values,
    resetForm,
    setFieldValue,
    countryCodeLookups,
    errors,
  } = registerDrContext;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showError, setShowError] = useState<boolean>(false);
  const [isRecordCreating, setIsRecordCreating] = useState<boolean>(false);
  const t = useTranslate();

  const {
    acceptedFiles: acceptedLicenseFiles,
    getRootProps: licenseRootProps,
    getInputProps: licenseInputProps,
    fileRejections: licenseFileRejections,
  } = useDropzone({
    multiple: true,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/PNG": [".PNG"],
      "image/jpg": [".jpg"],
      "image/JPG": [".JPG"],
      "image/jpeg": [".jpeg"],
      "image/JPEG": [".JPEG"],
    },
    maxSize: 2 * 1024 * 1024,
  });

  const {
    acceptedFiles: acceptedDocFiles,
    getRootProps: documentRootProps,
    getInputProps: documentInputProps,
    fileRejections: documentFileRejections,
  } = useDropzone({
    multiple: true,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/PNG": [".PNG"],
      "image/jpg": [".jpg"],
      "image/JPG": [".JPG"],
      "image/jpeg": [".jpeg"],
      "image/JPEG": [".JPEG"],
    },
    maxSize: 5 * 1024 * 1024,
  });

  useEffect(() => {
    if (acceptedLicenseFiles?.length) {
      const newFiles = values?.licenseFile?.length
        ? [...values?.licenseFile, ...acceptedLicenseFiles]
        : [...acceptedLicenseFiles];
      if (newFiles?.length > 2) {
        toast.error(
          t("exceeded_only_2_allowed")
        );
      } else {
        let maxSize = 2 * 1024 * 1024;
        newFiles?.forEach((element) => {
          maxSize -= element.size;
        });
        if (maxSize > 0) {
          setFieldValue("licenseFile", acceptedLicenseFiles);
        } else {
          toast.error(t("file_size_less_than_2mb"));
        }
      }
    }
  }, [acceptedLicenseFiles]);

  useEffect(() => {
    if (acceptedDocFiles?.length) {
      const newFiles = values?.documentFile?.length
        ? [...values?.documentFile, ...acceptedDocFiles]
        : [...acceptedDocFiles];
      if (newFiles?.length > 5) {
        toast.error(
          t("exceeded_only_5_allowed")
        );
      } else {
        let maxSize = 5 * 1024 * 1024;
        newFiles?.forEach((element) => {
          maxSize -= element.size;
        });
        if (maxSize > 0) {
          setFieldValue("documentFile", newFiles);
        } else {
          toast.error(t("file_size_less_than_5mb"));
        }
      }
    }
  }, [acceptedDocFiles]);

  useEffect(() => {
    if (documentFileRejections?.length) {
      const newErrors: any[] = [];
      documentFileRejections.forEach((element) => {
        if (element.errors?.length) {
          const code = element.errors[0].code;
          if (!newErrors.find((x) => x.code === code))
            newErrors.push({
              code,
              message:
                code === "file-too-large"
                  ? t("file_size_less_than_5mb")
                  : code === "file-invalid-type"
                  ? t("only_pdf")
                  : element.errors[0].message,
            });
        }
      });
      toast.error(newErrors.map((x) => x.message).toString());
    }
  }, [documentFileRejections]);

  useEffect(() => {
    if (licenseFileRejections?.length) {
      const newErrors: any[] = [];
      licenseFileRejections.forEach((element) => {
        if (element.errors?.length) {
          const code = element.errors[0].code;
          if (!newErrors.find((x) => x.code === code))
            newErrors.push({
              code,
              message:
                code === "file-too-large"
                  ? t("file_size_less_than_2mb")
                  : code === "file-invalid-type"
                  ?t("only_pdf")
                  : element.errors[0].message,
            });
        }
      });
      toast.error(newErrors.map((x) => x.message).toString());
    }
  }, [licenseFileRejections]);

  const onRqsToJoin = () => {
    const {
      fullName,
      userName,
      emailAddress,
      phoneCode,
      mobileNumber,
      dateOfBirth,
      gender,
      licenseNumber,
      bioGraphy,
      languages,
      addressLine1,
      ward,
      district,
      city,
      state,
      documentFile,
      licenseFile,
      docImg,
    } = values;
    let newErrors: string[] = [];
    if (!documentFile?.length) {
      newErrors.push(t("add_doc_files"));
    }
    if (!licenseFile?.length) {
      newErrors.push(t("add_lic_file"));
    }
    if (newErrors?.length) {
      setShowError(true);
      // toast.error(newErrors.join(', ') + '.')
    } else {
      setIsRecordCreating(true);
      const payloadDetail: { fileName: string; fileType: number }[] = [];
      const totalFiles: any[] = [];

      documentFile.forEach((element) => {
        payloadDetail.push({
          fileName: element.name,
          fileType: DoctorFileType.Document,
        });
        totalFiles.push(element);
      });
      licenseFile.forEach((element) => {
        payloadDetail.push({
          fileName: element.name,
          fileType: DoctorFileType.License,
        });
        totalFiles.push(element);
      });
      payloadDetail.push({
        fileName: docImg.name,
        fileType: DoctorFileType.Certificate,
      });
      totalFiles.push(docImg);

      try {
        commonService.getFileUploadDetails(payloadDetail).then(async (res) => {
          const fileDataRecords: {
            doctorId: number;
            name: string;
            filePath: string;
            doctorFileType: number;
          }[] = [];
          if (res?.data) {
            let index = 0;
            for await (const fileUploadRes of res.data?.fileUploads) {
              const { uploadUrl, fileHttpUrl } = fileUploadRes;
              await commonService
                .uploadFile(uploadUrl, totalFiles[index])
                .then((res) => {
                  if (res && res.status === 200 && res.ok) {
                    fileDataRecords.push({
                      doctorId: 0,
                      name: payloadDetail[index].fileName.toString(),
                      doctorFileType: payloadDetail[index].fileType,
                      filePath: fileHttpUrl,
                    });
                  }
                });
              index++;
            }
            if (fileDataRecords?.length > 0) {
              const photoPathObj: any = fileDataRecords.pop();
              const payload: ICreateDoctor = {
                namePrefix: "Dr",
                fullName,
                userName,
                email: emailAddress,
                countryId: phoneCode.countryId,
                phoneCode: phoneCode.value,
                mobileNumber,
                birthDate: dateOfBirth,
                gender: gender.value,
                address: addressLine1,
                ward,
                district,
                cityId: city.value,
                stateId: state.value,
                licenseNumber,
                biography: bioGraphy,
                photoPath: photoPathObj.filePath, ///
                languages: languages.map((x: any) => ({ languageId: x.value })),
                files: fileDataRecords,
              };
              dispatch(createDoctor(payload))
                .then((res) => {
                  if (res?.payload?.isSuccess) {
                    toast.success(
                      t("reg_done_success")
                    );
                    setCurrentStep();
                    resetForm();
                    setFieldValue("phoneCode", countryCodeLookups[0]);
                    router.push("/");
                  }
                })
                .finally(() => {
                  setIsRecordCreating(false);
                });
            }
          }
        });
      } catch (error) {
        setIsRecordCreating(false);
        toast.error(t("went_wrong"));
      }
    }
  };

  const onRemoveFile = (isForLicense: boolean, index: number) => {
    let existingFiles = isForLicense
      ? values?.licenseFile
      : values?.documentFile;
    existingFiles = existingFiles ? existingFiles : [];
    existingFiles = existingFiles?.filter((x: any, i: number) => index !== i);
    setFieldValue(
      isForLicense ? "licenseFile" : "documentFile",
      existingFiles?.length ? existingFiles : null
    );
  };
  return (
    <>
      <div className="ComsetmodlaForm">
        <Row>
          <Col md={4}>
            <div className="UploadFormdataBox uploadDocumDrset">
              <div
                className={`drop-mainset ${
                  errors?.licenseFile && showError ? "errorBorder" : ""
                }`}
                {...licenseRootProps({})}
              >
                <div className="drop-updata">
                  <input {...licenseInputProps()} name={"licenseFile"} />
                  <h5>
                    <BiUpload /> <span>{t("upload_liscense")}*</span>
                  </h5>
                </div>
              </div>
              {errors?.licenseFile && showError && (
                <div style={{ color: "red" }}>{errors?.licenseFile}</div>
              )}
              {values?.licenseFile?.length > 0 &&
                values?.licenseFile?.map((x: any, index: number) => (
                  <div
                    className="UplodeddatalistoCov"
                    title={x?.name}
                    key={`license-file-${index}`}
                  >
                    <h3>
                      <BsFillFileEarmarkTextFill /> {x?.name}
                      <a
                        href="javascript:;"
                        onClick={() => onRemoveFile(true, index)}
                      >
                        <IoIosCloseCircle />
                      </a>
                    </h3>
                  </div>
                ))}
            </div>
          </Col>
          <Col md={4}>
            <div className="UploadFormdataBox uploadDocumDrset">
              <div
                className={`drop-mainset ${
                  errors?.documentFile && showError ? "errorBorder" : ""
                }`}
                {...documentRootProps({})}
              >
                <div className="drop-updata">
                  <input {...documentInputProps()} name={"documentFile"} />
                  <h5>
                    <BiUpload /> <span>{t('uploaddocument')}*</span>
                  </h5>
                </div>
              </div>
              {errors?.documentFile && showError && (
                <div style={{ color: "red" }}>{errors?.documentFile}</div>
              )}
              {values?.documentFile?.length > 0 &&
                values?.documentFile?.map((x: any, index: number) => (
                  <div
                    className="UplodeddatalistoCov"
                    title={x?.name}
                    key={`license-file-${index}`}
                  >
                    <h3>
                      <BsFillFileEarmarkTextFill /> {x?.name}
                      <a
                        href="javascript:;"
                        onClick={() => onRemoveFile(false, index)}
                      >
                        <IoIosCloseCircle />
                      </a>
                    </h3>
                  </div>
                ))}
            </div>
          </Col>

          <Col md={12}>
            <div className="ComsetBtnSavebox">
              <Button
                type="button"
                onClick={onRqsToJoin}
                disabled={isRecordCreating}
              >
                {t("request_to_join")}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default DoctorBasicDetails;
