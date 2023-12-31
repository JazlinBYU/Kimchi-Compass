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
          <CDBBtn flat color="dark" className="p-2">
            <CDBIcon fab icon="facebook-f" />
          </CDBBtn>
          <CDBBtn flat color="dark" className="mx-3 p-2">
            <CDBIcon fab icon="twitter" />
          </CDBBtn>
          <CDBBtn flat color="dark" className="p-2">
            <CDBIcon fab icon="instagram" />
          </CDBBtn>
        </CDBBox>
      </CDBBox>
    </div>
  );
};

export default Footer;
