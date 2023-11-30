import React from "react";
import { Button } from "react-bootstrap";
import { FaUserMd, FaRegHospital } from "react-icons/fa";
import { Doctorsimges } from "../../../public/assets";
import Image from "next/image";
import Link from "next/link";
import { useTranslate } from "../../../commonModules/translate";

function JoinOurTeam() {
  const t = useTranslate();
  return (
    <>
      <div className="jointeam-cover">
        <div className="CustContainer">
          <div className="jointeam-set">
            <div className="row">
              <div className="col-lg-6 col-md-12">
                <div className="jointeam-left">
                  <h2>{t('join_our_team')}</h2>
                  <p>
                    {t('register_your_friend')}
                  </p>
                  <div className="dochosp-btn">
                    <Link href="/join-as-doctor">
                      <Button>
                        <FaUserMd />
                        {t('join_as_doctor')}
                      </Button>
                    </Link>
                    <Link href="/join-as-hospital">
                      <Button className="joinhos-btn">
                        <FaRegHospital />
                        {t('join_as_hospital')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="jointeam-right">
                  <Image src={Doctorsimges} alt="Doctorsimges" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default JoinOurTeam;
