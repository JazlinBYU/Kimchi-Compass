import React from "react";
import { CDBBtn, CDBIcon, CDBBox } from "cdbreact";
import "../index.css";
export const Footer = () => {
  return (
    <div id="footer">
      <CDBBox
        display="flex"
        justifyContent="between"
        alignItems="center"
        className="mx-auto py-4 flex-wrap"
        style={{ width: "80%" }}>
        <CDBBox display="flex" alignItems="center">
          <a href="/" className="d-flex align-items-center p-0 text-dark">
            <span className="ms-4 h2 mb-0 font-weight-bold-">
              Kimchi-compass
            </span>
          </a>
          <small className="ms-2">
            &copy; Jazlin Yu, 2023. All rights reserved.
          </small>
        </CDBBox>
        <CDBBox display="flex">
          <a
            href="https://www.instagram.com/yujazlin/"
            target="_blank"
            rel="noopener noreferrer">
            <CDBBtn flat color="dark" className="p-2">
              <CDBIcon fab icon="instagram" />
            </CDBBtn>
          </a>
          <a
            href="https://www.linkedin.com/in/jazzfunction/"
            target="_blank"
            rel="noopener noreferrer">
            <CDBBtn flat color="dark" className="mx-3 p-2" src="">
              <CDBIcon fab icon="linkedin" />
            </CDBBtn>
          </a>
          <a
            href="https://github.com/JazlinBYU"
            target="_blank"
            rel="noopener noreferrer">
            <CDBBtn flat color="dark" className="p-2">
              <CDBIcon fab icon="github" />
            </CDBBtn>
          </a>
        </CDBBox>
      </CDBBox>
    </div>
  );
};

export default Footer;
