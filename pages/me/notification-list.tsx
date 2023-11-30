import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { CancelAppointment } from "../../public/assets";
import BTable from "react-bootstrap/Table";
import { useTable, Column, useSortBy } from "react-table";
import { MdInfo } from "react-icons/md";

import UserProfileLayout from "../../layouts/userProfileLayout";
import { CURRENT_USER } from "../../commonModules/localStorege";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import {
  getUserNotificationList,
  notificationSelector,
} from "../../store/user/userNotificationSlice";
import moment from "moment";
import NoRecordsFound from "../../components/NoRecordsFound";
import { deleteUserNotification } from "../../store/user/userNotificationSlice";
import { toast } from "react-toastify";
import { useTranslate } from "../../commonModules/translate";

function NotificationList() {
  const user = CURRENT_USER();
  const notification = useAppSelector(notificationSelector);
  const dispatch = useAppDispatch();

  const t = useTranslate();
  interface dataInterface {
    col1: string;
    col2: string;
  }

  useEffect(() => {
    const params = {
      userId: user?.userId,
    };
    dispatch(getUserNotificationList(params));
  }, []);
  const data = React.useMemo(() => [], []);
  const columns = React.useMemo(() => [] as Column[], []);
  const { getTableProps, getTableBodyProps } = useTable(
    { columns, data },
    useSortBy
  );

  const clrAllNot = () => {
    dispatch(deleteUserNotification(-1)).then((res) => {
      if (res?.payload) {
        toast.success(t("notification_clear_success"));
        dispatch(getUserNotificationList({ userId: user?.userId }));
      }
    });
  };
  return (
    <>
      <div className="NotificationboxCov">
        <h1>{t("notification")}</h1>
        {notification.notificationList?.length > 0 && (
          <Button
            type="button"
            onClick={clrAllNot}
            disabled={notification.status ? true : false}
          >
            <img src={CancelAppointment.src} alt="Clear all" /> {t("clear_all")}
          </Button>
        )}
      </div>

      <div className="ComallTblcovlst maxHeight">
        <BTable
          striped
          bordered
          hover
          size="sm"
          {...getTableProps()}
          className="TableaminCust"
        >
          <thead>
            <tr>
              <th>{t("message")}</th>
              <th className="datetimenotifcov">{t("date_time")}</th>
            </tr>
          </thead>
          {notification.notificationList?.length > 0 && (
            <tbody {...getTableBodyProps()}>
              {notification.notificationList?.map((data) => (
                <tr key={`notification-${data.notificationId}`}>
                  <td className="notifdatacomset">
                    <p>{data.title}</p>
                    <span>
                      {data.description} <MdInfo />
                    </span>
                  </td>
                  <td>
                    {moment.utc(data.createdAt).local().format("DD MMM YYYY HH:mm")}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </BTable>
        {!notification?.notificationList?.length && <NoRecordsFound />}
      </div>
    </>
  );
}

NotificationList.PageLayout = UserProfileLayout;
export default NotificationList;
