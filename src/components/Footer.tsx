import React from "react";

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} BitCrafters E-commerce App. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
