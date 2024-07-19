import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor, act, } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { ToastContainer, toast } from "react-toastify";
import Profile from "../views/UserProfile";
import useAxiosClient from "../hooks/AxiosInstance";
import { AxiosInstance } from "axios";
import userEvent from "@testing-library/user-event";
import * as yup from 'yup';



global.URL.createObjectURL = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  Link: ({ children, to }: { children: React.ReactNode, to: string }) => <a href={to}>{children}</a>,
}));


jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
  ToastContainer: () => null,
}));
jest.mock("../hooks/AxiosInstance");
jest.mock("react-icons/ci", () => ({
  CiEdit: () => <div data-testid="edit-icon" />,
}));
jest.mock("../components/Logout", () => () => (
  <div data-testid="logout-component">Logout</div>
));
jest.mock("react-icons/tb", () => ({
  TbMinusVertical: () => <div data-testid="minus-vertical-icon" />,
}));
jest.mock("react-icons/io5", () => ({
  IoEyeOutline: () => <div data-testid="eye-outline-icon" />,
  IoEyeOffOutline: () => <div data-testid="eye-off-outline-icon" />,
}));
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

const mockStore = configureStore([]);

describe("Profile Component", () => {
  let store: ReturnType<typeof mockStore>;
  let mockedAxiosClient: jest.Mocked<AxiosInstance>;


    const mockProfileData = {
      username: "testuser",
      gender: "male",
      birthdate: "1990-01-01",
      preferredLanguage: "English",
      preferredCurrency: "USD",
      phoneNumber: "0781234567",
      homeAddress: "123 Test St",
      billingAddress: "456 Bill St",
    };

    beforeEach(() => {
    localStorage.clear();
    store = mockStore({
      auth: {
        authToken: "mock-token",
      },
    });

    mockedAxiosClient = {
      get: jest.fn(),
      patch: jest.fn(),
    } as unknown as jest.Mocked<AxiosInstance>;

    (useAxiosClient as jest.Mock).mockReturnValue(mockedAxiosClient);
    });
    
  it("validates username with minimum length", async () => {
    const schema = yup.object().shape({
      username: yup.string().min(3, "Username must be at least 3 characters"),
    });

    await expect(schema.validate({ username: "ab" })).rejects.toThrow(
      "Username must be at least 3 characters",
    );
    await expect(schema.validate({ username: "abc" })).resolves.toBeTruthy();
  });

  it("validates gender with oneOf", async () => {
    const schema = yup.object().shape({
      gender: yup.string().oneOf(["male", "female"]),
    });

    await expect(schema.validate({ gender: "male" })).resolves.toBeTruthy();
    await expect(schema.validate({ gender: "female" })).resolves.toBeTruthy();
    await expect(schema.validate({ gender: "other" })).rejects.toThrow();
  });

  it("validates phone number format", async () => {
    const schema = yup.object().shape({
      phoneNumber: yup
        .string()
        .matches(
          /^(078|079|072|073)\d{7}$/,
          "Please provide a valid phone number starting with 078/079/072/073",
        ),
    });

    await expect(
      schema.validate({ phoneNumber: "0781234567" }),
    ).resolves.toBeTruthy();
    await expect(
      schema.validate({ phoneNumber: "0791234567" }),
    ).resolves.toBeTruthy();
    await expect(
      schema.validate({ phoneNumber: "0721234567" }),
    ).resolves.toBeTruthy();
    await expect(
      schema.validate({ phoneNumber: "0731234567" }),
    ).resolves.toBeTruthy();
    await expect(
      schema.validate({ phoneNumber: "0701234567" }),
    ).rejects.toThrow();
    await expect(
      schema.validate({ phoneNumber: "07812345" }),
    ).rejects.toThrow();
  });

  it("allows empty strings for optional fields", async () => {
    const schema = yup.object().shape({
      birthdate: yup.string(),
      preferredLanguage: yup.string(),
      preferredCurrency: yup.string(),
      homeAddress: yup.string(),
      billingAddress: yup.string(),
    });

    await expect(
      schema.validate({
        birthdate: "",
        preferredLanguage: "",
        preferredCurrency: "",
        homeAddress: "",
        billingAddress: "",
      }),
    ).resolves.toBeTruthy();
  });

  it("validates the entire profile schema", async () => {
    const schema = yup.object().shape({
      username: yup.string().min(3, "Username must be at least 3 characters"),
      gender: yup.string().oneOf(["male", "female"]),
      birthdate: yup.string(),
      preferredLanguage: yup.string(),
      preferredCurrency: yup.string(),
      phoneNumber: yup
        .string()
        .matches(
          /^(078|079|072|073)\d{7}$/,
          "Please provide a valid phone number starting with 078/079/072/073",
        ),
      homeAddress: yup.string(),
      billingAddress: yup.string(),
    });

    const validProfile = {
      username: "testuser",
      gender: "male",
      birthdate: "1990-01-01",
      preferredLanguage: "English",
      preferredCurrency: "USD",
      phoneNumber: "0781234567",
      homeAddress: "123 Test St",
      billingAddress: "456 Bill St",
    };

    await expect(schema.validate(validProfile)).resolves.toBeTruthy();

    const invalidProfile = {
      ...validProfile,
      username: "ab",
      gender: "other",
      phoneNumber: "0701234567",
    };

    await expect(schema.validate(invalidProfile)).rejects.toThrow();
  });

  // uncovered lines ...
    it("revokes object URL on unmount when imagePreview exists", async () => {
      (useAxiosClient as jest.Mock).mockReturnValue({
        get: jest.fn().mockResolvedValue({
          data: {
            username: "testuser",
            email: "test@example.com",
            gender: "male",
            birthdate: "1990-01-01",
            preferredLanguage: "English",
            preferredCurrency: "USD",
            phoneNumber: "0781234567",
            homeAddress: "123 Test St",
            billingAddress: "456 Bill St",
            profileImageUrl: "https://example.com/profile.jpg",
          },
        }),
      });

      const mockRevokeObjectURL = jest.fn();
      URL.revokeObjectURL = mockRevokeObjectURL;

      const mockCreateObjectURL = jest.fn().mockReturnValue("fake-object-url");
      URL.createObjectURL = mockCreateObjectURL;

      let unmount: () => void;

      await act(async () => {
        const { unmount: unmountFn } = render(
          <Router>
            <Profile />
          </Router>,
        );
        unmount = unmountFn;
      });

      const editButton = document.querySelector("button");
      if (editButton) {
        fireEvent.click(editButton);
      }

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      if (fileInput) {
        const file = new File(["dummy content"], "test.png", {
          type: "image/png",
        });
        fireEvent.change(fileInput, { target: { files: [file] } });
      }

      act(() => {
        unmount();
      });

      expect(mockRevokeObjectURL).toHaveBeenCalledWith("fake-object-url");
    });
 
  
it("appends image to formData when profileImage is set", async () => {
  mockedAxiosClient.get.mockResolvedValue({ data: mockProfileData });
  mockedAxiosClient.patch.mockResolvedValue({
    status: 200,
    data: mockProfileData,
  });

  render(
    <Provider store={store}>
      <Profile />
    </Provider>,
  );

  await waitFor(() => {
    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText("Edit Profile"));

  const file = new File(["dummy content"], "test.png", { type: "image/png" });
  const fileInput = document.getElementById(
    "profile-image-upload",
  ) as HTMLInputElement;

  await act(async () => {
    await userEvent.upload(fileInput, file);
  });

  fireEvent.click(screen.getByText("Save Changes"));

  await waitFor(() => {
    expect(mockedAxiosClient.patch).toHaveBeenCalled();
    const patchCall: any = mockedAxiosClient.patch.mock.calls[0];
    expect(patchCall[1].get("image")).toBeTruthy();
  });

  expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
});

it("displays error toast when profile update fails", async () => {
  mockedAxiosClient.get.mockResolvedValue({ data: mockProfileData });
  mockedAxiosClient.patch.mockResolvedValue({ status: 400 });

  render(
    <Provider store={store}>
      <Profile />
      <ToastContainer />
    </Provider>,
  );

  await waitFor(() => {
    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText("Edit Profile"));
  fireEvent.click(screen.getByText("Save Changes"));

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith("Failed to update profile");
  });
});

it("sets isEditing to true when Edit Profile button is clicked", async () => {
  mockedAxiosClient.get.mockResolvedValue({ data: mockProfileData });

  render(
    <Provider store={store}>
      <Profile />
    </Provider>,
  );

  await waitFor(() => {
    expect(screen.getByDisplayValue("testuser")).toBeInTheDocument();
  });

  const usernameField = screen.getByDisplayValue("testuser");
  expect(usernameField).toBeDisabled();

  const editButton = screen.getByText("Edit Profile");
  fireEvent.click(editButton);

  await waitFor(() => {
    expect(usernameField).not.toBeDisabled();
  });
});
  test("does not redirect if AUTH_TOKEN is in localStorage", async () => {
    localStorage.setItem("AUTH_TOKEN", "fake-token");
    const mockNavigate = jest.fn();
    jest
      .spyOn(require("react-router-dom"), "useNavigate")
      .mockImplementation(() => mockNavigate);

    render(
      <Router>
        <Profile />
      </Router>,
    );

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });


  it("handles profile fetch error", async () => {
    mockedAxiosClient.get.mockRejectedValue(new Error("Fetch failed"));

    render(
      <Provider store={store}>
        <Profile />
        <ToastContainer />
      </Provider>,
    );

  });

  it("allows editing profile and handles successful update", async () => {
    mockedAxiosClient.get.mockResolvedValue({ data: mockProfileData });
    mockedAxiosClient.patch.mockResolvedValue({
      status: 200,
      data: { ...mockProfileData, username: "newusername" },
    });

    render(
      <Provider store={store}>
        <Profile />
        <ToastContainer />
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Edit Profile")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Edit Profile"));
    expect(screen.getByText("Save Changes")).toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue("testuser"), {
      target: { value: "newusername" },
    });
    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(mockedAxiosClient.patch).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        "Profile updated successfully",
      );
    });
  });

  it("handles profile update error", async () => {
    mockedAxiosClient.get.mockResolvedValue({ data: mockProfileData });
    mockedAxiosClient.patch.mockRejectedValue(new Error("Update failed"));

    render(
      <Provider store={store}>
        <Profile />
        <ToastContainer />
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Edit Profile")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Edit Profile"));
    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Something went wrong!");
    });
  });

  it("enables editing when Edit Profile is clicked", async () => {
    mockedAxiosClient.get.mockResolvedValue({ data: mockProfileData });

    render(
      <Provider store={store}>
        <Profile />
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Edit Profile")).toBeInTheDocument();
    });

    const editButton = screen.getByText("Edit Profile");
    fireEvent.click(editButton);

    await waitFor(() => {
      const usernameField = screen.getByDisplayValue("testuser");
      expect(usernameField).not.toBeDisabled();
    });
  });
it("updates profileImage state when a file is selected", async () => {
  mockedAxiosClient.get.mockResolvedValue({ data: mockProfileData });

  render(
    <Provider store={store}>
      <Profile />
    </Provider>,
  );

  await waitFor(() => {
    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
  });

  const editButton = screen.getByText("Edit Profile");
  fireEvent.click(editButton);

  const file = new File(["dummy content"], "test.png", {
    type: "image/png",
  });

  const fileInput = document.getElementById(
    "profile-image-upload",
  ) as HTMLInputElement;
  expect(fileInput).toBeInTheDocument();

  await act(async () => {
    await userEvent.upload(fileInput, file);
  });

  expect(fileInput.files).toHaveLength(1);
  expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
});
  it("cancels editing", async () => {
    mockedAxiosClient.get.mockResolvedValue({ data: mockProfileData });

    render(
      <Provider store={store}>
        <Profile />
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Edit Profile")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Edit Profile"));
    expect(screen.getByText("Cancel")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
  });
  
it("renders logout component", async () => {
  mockedAxiosClient.get.mockResolvedValue({ data: mockProfileData });

  render(
    <Provider store={store}>
      <Router>
        <Profile />
      </Router>
    </Provider>,
  );

  await waitFor(() => {
    expect(screen.getByText("My profile")).toBeInTheDocument();
  });

  const logoutComponent = screen.getByTestId("logout-component");
  expect(logoutComponent).toBeInTheDocument();
  expect(logoutComponent).toHaveTextContent("Logout");
});
});
