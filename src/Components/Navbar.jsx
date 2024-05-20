import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to={"/"}>Entity Form</Link>
        </li>
        <li>
          <Link to={"/list"}>Entity List</Link>
        </li>
        <li>
          <Link to={"/record-form"}>Entity Record Form</Link>
        </li>
      </ul>
    </div>
  );
};
