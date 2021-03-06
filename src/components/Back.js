import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/Button.css";

const Back = ({ text, link }) => {
  return (
    <Link to={link || "/"}>
      <Button variant="light" className="back float-left">
        {text || "Back"}
      </Button>
    </Link>
  );
};

export default Back;
