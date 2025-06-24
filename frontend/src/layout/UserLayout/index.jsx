import NavbarComponent from "@/Components/Navbar";
import React from "react";

function UserLayout({ children }) {
  return (
    <div>
      <NavbarComponent />
      {children}
    </div>
  );
}

export default UserLayout;
