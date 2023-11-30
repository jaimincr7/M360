import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { FiDownload } from "react-icons/fi";

import { AddNewAddressIcon } from "../../public/assets";
import UserProfileLayout from "../../layouts/userProfileLayout";
import AddAddressModal from "../../components/PatientDetails/Address/AddAddressModal";
import { CURRENT_USER } from "../../commonModules/localStorege";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import {
  deleteUserAddress,
  getUserAddresses,
  userAddressSelector,
} from "../../store/user/addressSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  customSelector,
  getAllCities,
  getAllCountries,
  getAllStates,
} from "../../store/custom/customSlice";
import { AppDispatch } from "../../utils/store";
import ConfirmModal from "../../components/Common/ConfirmModal";
import { toast } from "react-toastify";
import { useTranslate } from "../../commonModules/translate";

function ManageAddress() {
  const user = CURRENT_USER();
  const userAddressState = useAppSelector(userAddressSelector);
  const customDetails = useSelector(customSelector);

  const dispatch = useAppDispatch();
  console.log("Address state", userAddressState);
  useEffect(() => {
    dispatch(getUserAddresses(user.userId));
  }, []);

  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dltModal, setDltModal] = useState({
    show: false,
    selectedId: 0,
  });
  const [countryCodeLookups, setCountryCodeLookups] = useState([]);
  const [cityLookups, setCityLookups] = useState([]);
  const [stateLookups, setStateLookups] = useState([]);
  const [selectedData, setSelectedData] = useState({});

  const t = useTranslate();

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

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const onEditData = (data) => {
    setShow(true);
    setSelectedData(data);
  };

  const onAdd = () => {
    setSelectedData({});
    setShow(true);
  };

  const handleDlt = () => {
    setIsLoading(true);
    dispatch(deleteUserAddress(dltModal.selectedId))
      .then((res) => {
        if (res?.payload) {
          toast.success(t("address_remove_success"));
          dispatch(getUserAddresses(user.userId));
          onDltModalCls();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onDltModalCls = () => {
    setDltModal({
      selectedId: 0,
      show: false,
    });
  };
  return (
    <>
      {show && (
        <AddAddressModal
          show={show}
          onHide={() => handleClose()}
          lookups={{ cityLookups, countryCodeLookups, stateLookups }}
          editData={selectedData}
        />
      )}
      <div className="ManageAddressdataCov">
        <div className="ManageAddressdataTitle">
          <h1>{t("manage_addresses")}</h1>
        </div>
        <div className="ManageAddressdataIner">
          <Row>
            <Col md={6}>
              <div className="addressdataAddbox">
                <Button onClick={onAdd}>
                  <img src={AddNewAddressIcon.src} alt="" />
                  <p>+ {t("add_new_address")}</p>
                </Button>
              </div>
            </Col>
            {userAddressState.userAddressList &&
              userAddressState.userAddressList?.map((data) => (
                <Col md={6} key={`address-${data.userAddressId}`}>
                  <div className="addressboxdataCov DefualtAddress">
                    <div className="d-flex">
                      <h3>
                        {data.fullName} | +{data.phoneCode} {data.mobileNumber}
                      </h3>
                      {data.isDefaultAddress && (
                        <span className="defaultAddressLabel">{t("default")}</span>
                      )}
                    </div>
                    <p>
                      {data.address}, {data.ward},{data.city}, {data.district},{" "}
                      {data.state}
                    </p>
                    <a href="javascript:;" onClick={() => onEditData(data)}>
                      {t("edit")}
                    </a>
                    <a
                      href="javascript:;"
                      onClick={() => {
                        setDltModal({
                          show: true,
                          selectedId: data.userAddressId,
                        });
                      }}
                    >
                      {t("Delete")}
                    </a>
                  </div>
                </Col>
              ))}
          </Row>
        </div>
      </div>

      {dltModal.show && (
        <ConfirmModal
          show={dltModal.show}
          onClose={onDltModalCls}
          info={t("dlt_confirm")}
          title={t("Delete")}
          onConfirm={handleDlt}
          isDisabled={isLoading}
        />
      )}
    </>
  );
}

ManageAddress.PageLayout = UserProfileLayout;

export default ManageAddress;
