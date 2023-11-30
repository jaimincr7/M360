import React, { useEffect, useState } from "react";
import { WalletHistoryIcon } from "../../public/assets";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import UserProfileLayout from "../../layouts/userProfileLayout";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import {
  getAllWalletBalances,
  getWalletHistory,
  walletSelector,
} from "../../store/user/userWalletSlice";
import { CURRENT_USER } from "../../commonModules/localStorege";
import moment from "moment";
import NoRecordsFound from "../../components/NoRecordsFound";
import { WalletHistoryFilterOptions } from "../../utils/constant";
import { useTranslate } from "../../commonModules/translate";

function WalletHistory() {
  const currentUser = CURRENT_USER();
  const dispatch = useAppDispatch();
  const t = useTranslate();
  const userWallet = useAppSelector(walletSelector);
  const [selectedSortType, setSelectedSortType] = useState<any>(
    { ...WalletHistoryFilterOptions[0], label: t(WalletHistoryFilterOptions[0].label) }
  );

  useEffect(() => {
    dispatch(getAllWalletBalances(currentUser?.userId));
    // dispatch(getWalletHistory(currentUser?.userId));
  }, []);

  useEffect(() => {
    if (selectedSortType)
      dispatch(
        getWalletHistory({
          userId: currentUser?.userId,
          durationFilter: selectedSortType?.value,
        })
      );
  }, [selectedSortType]);

  const animatedComponents = makeAnimated();

  return (
    <>
      <div className="Wallethitorboxcov">
        <div className="InsmartwalletbalanceBox">
          <img src={WalletHistoryIcon.src} alt="" />
          <p>{t("insmart_wallet_balance")}</p>
          <h3>
            <span></span> {userWallet.walletAllBalance?.balance}
          </h3>
        </div>
        <div className="WallethitorboxTitle">
          <h1>{t("wallet_history")}</h1>

          <div className="montfltmaindahtlrec">
            <Select
              components={animatedComponents}
              classNamePrefix="react-select"
              options={WalletHistoryFilterOptions.map(i => ({...i, label: t(i.label)}))}
              value={selectedSortType}
              onChange={(e) => {
                setSelectedSortType(e);
              }}
            />
          </div>
        </div>
        <div className="WallethitorboxTablediv">
          {userWallet.walletHistory?.length ? (
            userWallet.walletHistory?.map((wlD) => (
              <div
                className="WallethitorTableIner"
                key={"history-record-" + wlD.walletHistoryId}
              >
                <div className="DateWellethittor">
                  <h3>
                    <span className="CurrencyTagcl">
                      {moment(wlD.createdAt).format("D")}
                    </span>{" "}
                    <br /> {moment(wlD.createdAt).format("MMM")},{" "}
                    {moment(wlD.createdAt).format("YYYY")}
                  </h3>
                </div>
                <div className="DataWellethittor">
                  <p>{wlD.transactionMessage}.</p>
                </div>
                <div className="AmountWellethittor">
                  <p
                    className={
                      wlD.creditDebit == "c" ? "CreditAmount" : "DebitAmount"
                    }
                  >
                    <span>₫</span> {wlD.amount}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <NoRecordsFound />
          )}
        </div>
      </div>
    </>
  );
}

WalletHistory.PageLayout = UserProfileLayout;
export default WalletHistory;
