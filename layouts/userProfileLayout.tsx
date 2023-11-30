import React from "react";
import Sidebar from "../components/Common/Sidebar";

function UserProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="SettingsMainBgcov">
        <div className="container">
          <div className="UserSettingsMaincov">
            <div className="UsersettiLeftSide">
              <Sidebar />
            </div>
            <div className="UsersettiRightData">
              <div className="CardBoxProfSeting">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfileLayout;
