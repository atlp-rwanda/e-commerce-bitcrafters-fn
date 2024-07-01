import { render } from "@testing-library/react";
import DashLayout from "../layouts/DashLayout";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";

jest.mock("../components/SideNav", () => () => <div>SideNav</div>);
jest.mock("../components/Footer", () => () => <div>Footer</div>);
jest.mock("../views/admin/DashboardStats", () => () => (
  <div>DashboardStats</div>
));

describe("DashLayout", () => {
  it("renders DashLayout with SideNav, DashboardStats, Outlet, and Footer", () => {
    const { getByText } = render(
      <Router>
        <DashLayout />
      </Router>,
    );

    expect(getByText("SideNav")).toBeInTheDocument();
    expect(getByText("DashboardStats")).toBeInTheDocument();
    expect(getByText("Footer")).toBeInTheDocument();
  });
});
