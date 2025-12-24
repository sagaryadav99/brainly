import * as React from "react";

const HamburgerMenu: React.FC<React.SVGProps<SVGElement>> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="25"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="#626266ff"
      strokeLinecap="round"
      strokeWidth="2"
      d="M4 18h16M4 12h16M4 6h16"
    ></path>
  </svg>
);

export default HamburgerMenu;
