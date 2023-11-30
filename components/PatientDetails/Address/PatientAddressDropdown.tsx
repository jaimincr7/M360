import { FormikProps, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { CURRENT_USER } from "../../../commonModules/localStorege";
import {
  customSelector,
  getAllCities,
  getAllCountries,
  getAllStates,
} from "../../../store/custom/customSlice";
import { patientDetailsSelector } from "../../../store/patientDetails/patientDetailsSlice";
import {
  getUserAddresses,
  userAddressSelector,
} from "../../../store/user/addressSlice";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import AddAddressModal from "./AddAddressModal";
import { useTranslate } from "../../../commonModules/translate";

function PatientAddress() {
  const { values, setFieldValue }: FormikProps<any> = useFormikContext();
  const userAddressState = useAppSelector(userAddressSelector);
  const [addLookups, setAddLookups] = useState<any>([]);
  const t = useTranslate();

  useEffect(() => {
    if (userAddressState.userAddressList?.length) {
      const newLookups = [];
      const defaultAddress = userAddressState.userAddressList?.find(
        (ptnA: any) => ptnA.isDefaultAddress === true
      );
      if (defaultAddress && !values?.addressDetail?.value) {
        setFieldValue("addressDetail", {
          value: defaultAddress?.userAddressId?.toString(),
          label:
            defaultAddress?.address +
            ", " +
            defaultAddress?.ward +
            ", " +
            defaultAddress?.city +
            ", " +
            defaultAddress?.district,
        });
      }
      userAddressState.userAddressList?.map((ptnA: any) => {
        newLookups.push({
          value: ptnA?.userAddressId?.toString(),
          label:
            ptnA?.address +
            ", " +
            ptnA?.ward +
            ", " +
            ptnA?.city +
            ", " +
            ptnA?.district,
        });
      });
      setAddLookups(newLookups);
    }
  }, [userAddressState.userAddressList]);

  const animatedComponents = makeAnimated();

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const [countryCodeLookups, setCountryCodeLookups] = useState([]);
  const [cityLookups, setCityLookups] = useState([]);
  const [stateLookups, setStateLookups] = useState([]);
  const dispatch = useAppDispatch();
  const customDetails = useSelector(customSelector);

  useEffect(() => {
    dispatch(getUserAddresses(CURRENT_USER()?.userId));
  }, []);

  useEffect(() => {
    if (!customDetails.countries.countries?.length) dispatch(getAllCountries());
    if (!customDetails.cities.cities?.length) dispatch(getAllCities());
    if (!customDetails.states.states?.length) dispatch(getAllStates());
  }, []);

  useEffect(() => {
    if (customDetails.cities.cities?.length) {
      setCityLookups(
        customDetails.cities.cities.map((x) => ({
          value: x.cityId,
          label: x.name,
        }))
      );
    }
  }, [customDetails.cities.cities]);

  useEffect(() => {
    if (customDetails.states.states?.length) {
      setStateLookups(
        customDetails.states.states.map((x) => ({
          value: x.stateId,
          label: x.name,
        }))
      );
    }
  }, [customDetails.states.states]);

  useEffect(() => {
    if (customDetails.countries.countries?.length) {
      setCountryCodeLookups(
        customDetails.countries.countries.map((x) => ({
          value: x.phoneCode,
          label: `${x.code}  +${x.phoneCode}`,
          countryId: x.countryId,
          name: x.name,
        }))
      );
    }
  }, [customDetails.countries.countries]);

  return (
    <>
      {show && (
        <AddAddressModal
          show={show}
          onHide={() => handleClose()}
          editData={{}}
          lookups={{ countryCodeLookups, cityLookups, stateLookups }}
          onSubmit={(newAddId: number, data: any) => {
            if (data) {
              setFieldValue("addressDetail", {
                value: newAddId?.toString(),
                label:
                  data?.address + ", " + data?.city + ", " + data?.district,
              });
            }
          }}
        />
      )}

      <div className="patientdetialCard">
        <div className="SelectadderTitle">
          <h6>{t("select_address")}*</h6>
          <a href="javascript:void(0);" onClick={handleShow}>
            + {t("add_address")}
          </a>
        </div>
        <div className="SelectadderSelect">
          <Select
            components={animatedComponents}
            options={addLookups}
            classNamePrefix="react-select"
            value={values?.addressDetail}
            onChange={(val) => setFieldValue("addressDetail", val)}
          />
        </div>
      </div>
    </>
  );
}

export default PatientAddress;
