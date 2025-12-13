import * as React from "react";

const FlowIcon: React.FC<React.SVGProps<SVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="800"
    height="800"
    viewBox="0 0 36 36"
    className="size-8"
    fill="oklch(54.6% 0.245 262.881)"
  >
    <path
      d="M9.8 18.8h16.4v3.08h1.6V17.2h-9V14h-1.6v3.2h-9v4.68h1.6z"
      className="clr-i-outline clr-i-outline-path-1"
    ></path>
    <path
      d="M14 23H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2M4 31v-6h10v6Z"
      className="clr-i-outline clr-i-outline-path-2"
    ></path>
    <path
      d="M32 23H22a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2m-10 8v-6h10v6Z"
      className="clr-i-outline clr-i-outline-path-3"
    ></path>
    <path
      d="M13 13h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H13a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2m0-8h10v6H13Z"
      className="clr-i-outline clr-i-outline-path-4"
    ></path>
    <path fill="none" d="M0 0h36v36H0z"></path>
  </svg>
);

export default FlowIcon;
