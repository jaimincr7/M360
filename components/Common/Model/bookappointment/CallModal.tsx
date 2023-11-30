import React from "react";
import "./callmodalstyle.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Doclist2 } from "../../../../public/assets";
import Image from "next/image";

function CallModal(props: { show: boolean; onHide: any }) {
  return (
    <>
      <Modal
        {...props}
        // backdrop="static"
        // keyboard={false}
        centered
        className="CustModalComcovermain CallmodalBoxCovset"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="Callactionbtncovbox">
            <Image src={Doclist2} alt="" />
            <p>Dr. Bruno Schaub</p>
            <Button>
              <svg
                width="55"
                height="55"
                viewBox="0 0 55 55"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="55" height="55" rx="27.5" fill="#F82834" />
                <path
                  d="M21.8427 29.2765C22.3332 28.9596 22.4652 28.4528 22.5843 28.0063C22.7052 27.548 22.8092 26.5506 23.2392 26.3493C25.5207 25.3986 28.4552 25.2931 30.7358 26.2577C31.1742 26.4642 31.2837 27.463 31.4093 27.9235C31.5305 28.3696 31.6693 28.8756 32.1598 29.1986C32.601 29.4884 34.8248 29.7551 35.5114 29.7495C35.9645 29.7462 36.322 29.6362 36.582 29.4162C37.5231 28.5526 37.3268 26.3408 37.2156 25.876C37.0442 24.8191 36.2245 24.0043 34.7858 23.4611C31.045 21.8786 22.947 21.943 19.1557 23.495C18.4321 23.7574 17.8657 24.0927 17.4607 24.4977C17.0644 24.8939 16.8222 25.3574 16.7382 25.88C16.6412 26.2406 16.4456 28.5517 17.4051 29.4455C17.6611 29.6618 18.0207 29.7745 18.4714 29.7812C19.1586 29.7925 21.4037 29.5631 21.8427 29.2765Z"
                  fill="white"
                />
              </svg>
            </Button>
            <Button>
              <svg
                width="55"
                height="55"
                viewBox="0 0 55 55"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="55" height="55" rx="27.5" fill="#00D261" />
                <path
                  d="M32.1144 24.7235C31.6238 25.0404 31.4919 25.5472 31.3728 25.9937C31.2518 26.452 31.1479 27.4494 30.7179 27.6507C28.4363 28.6014 25.5018 28.7069 23.2212 27.7423C22.7828 27.5358 22.6733 26.537 22.5477 26.0765C22.4265 25.6304 22.2877 25.1244 21.7972 24.8014C21.3561 24.5116 19.1322 24.2449 18.4457 24.2505C17.9925 24.2538 17.635 24.3638 17.375 24.5838C16.4339 25.4474 16.6302 27.6592 16.7415 28.124C16.9129 29.1809 17.7326 29.9957 19.1713 30.5389C22.912 32.1214 31.0101 32.057 34.8013 30.505C35.5249 30.2426 36.0914 29.9073 36.4963 29.5023C36.8926 29.1061 37.1349 28.6426 37.2188 28.12C37.3158 27.7594 37.5114 25.4482 36.5519 24.5545C36.2959 24.3382 35.9363 24.2254 35.4856 24.2188C34.7984 24.2075 32.5534 24.4369 32.1144 24.7235Z"
                  fill="white"
                />
              </svg>
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CallModal;
