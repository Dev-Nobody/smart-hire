import React from "react";
import { Button } from "antd";

const AppButton = ({ text, color, onClick }) => {
  return (
    <Button
      style={{
        backgroundColor: color || "#1890ff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
      }}
      onClick={onClick}
    >
      {text || "Default Button"}{" "}
    </Button>
  );
};

export default AppButton;
