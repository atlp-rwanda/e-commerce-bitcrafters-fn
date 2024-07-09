import { renderHook, act } from "@testing-library/react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  CheckoutFormValues,
  useCheckoutSubmit,
} from "../../components/CheckoutSubmit";
import useAxiosClient from "../../hooks/AxiosInstance";
import { FormikHelpers } from "formik";

jest.mock("react-toastify");
jest.mock("react-router-dom");
jest.mock("../../hooks/AxiosInstance");

global.URL.createObjectURL = jest.fn();

describe("useCheckoutSubmit", () => {
  const mockNavigate = jest.fn();
  const mockPost = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAxiosClient as jest.Mock).mockReturnValue({ post: mockPost });
  });

  const createMockFormikHelpers = (): FormikHelpers<CheckoutFormValues> => ({
    setSubmitting: jest.fn(),
    setStatus: jest.fn(),
    setErrors: jest.fn(),
    setTouched: jest.fn(),
    setValues: jest.fn(),
    setFieldValue: jest.fn(),
    setFieldError: jest.fn(),
    setFieldTouched: jest.fn(),
    validateForm: jest.fn(),
    validateField: jest.fn(),
    resetForm: jest.fn(),
    submitForm: jest.fn(),
    setFormikState: jest.fn(),
  });

  it("should filter out mobile money number for credit card payment", async () => {
    const mockValues = {
      fullName: "GUY MAX",
      phoneNumber: "1234567890",
      country: "Rwanda",
      streetAddress: "123 Main St",
      town: "Kigali",
      email: "guy@example.com",
      deliveryDate: "2025-12-31",
      paymentMethod: "creditCard",
      mobileMoneyNumber: "0781234567",
    };

    mockPost.mockResolvedValueOnce({ data: "Success" });

    const { result } = renderHook(() => useCheckoutSubmit());
    const mockFormikHelpers = createMockFormikHelpers();

    await act(async () => {
      await result.current(mockValues, mockFormikHelpers);
    });

    expect(mockPost).toHaveBeenCalledWith(
      "/checkout",
      expect.not.objectContaining({
        mobileMoneyNumber: "0781234567",
      }),
    );
  });

  it("should filter out credit card details for mobile money payment", async () => {
    const mockValues = {
      fullName: "GUY MAX",
      phoneNumber: "1234567890",
      country: "Rwanda",
      streetAddress: "123 Main St",
      town: "Kigali",
      email: "guy@example.com",
      deliveryDate: "2025-12-31",
      paymentMethod: "mobileMoney",
      mobileMoneyNumber: "0781234567",
    };

    mockPost.mockResolvedValueOnce({ data: "Success" });

    const { result } = renderHook(() => useCheckoutSubmit());
    const mockFormikHelpers = createMockFormikHelpers();

    await act(async () => {
      await result.current(mockValues, mockFormikHelpers);
    });

    expect(mockPost).toHaveBeenCalledWith(
      "/checkout",
      expect.not.objectContaining({
        cardNumber: "4111111111111111",
        cardHolderName: "Maxime Guy",
        expiryDate: "2025-12-31",
        cvv: "123",
      }),
    );
  });

  it("should navigate to mobile money page after successful submission", async () => {
    const mockValues = {
      fullName: "GUY MAX",
      phoneNumber: "1234567890",
      country: "Rwanda",
      streetAddress: "123 Main St",
      town: "Kigali",
      email: "guy@example.com",
      deliveryDate: "2025-12-31",
      paymentMethod: "mobileMoney",
      mobileMoneyNumber: "0781234567",
    };

    mockPost.mockResolvedValueOnce({ data: "Success" });

    const { result } = renderHook(() => useCheckoutSubmit());
    const mockFormikHelpers = createMockFormikHelpers();

    jest.useFakeTimers();

    await act(async () => {
      await result.current(mockValues, mockFormikHelpers);
      jest.runAllTimers();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/mobileMoney");
    jest.useRealTimers();
  });
  it("should navigate to credit card page after successful submission", async () => {
    const mockValues = {
      fullName: "GUY MAX",
      phoneNumber: "1234567890",
      country: "Rwanda",
      streetAddress: "123 Main St",
      town: "Kigali",
      email: "guy@example.com",
      deliveryDate: "2025-12-31",
      paymentMethod: "creditCard",
    };

    mockPost.mockResolvedValueOnce({
      data: {
        order: {
          id: "123456",
        },
      },
    });

    const { result } = renderHook(() => useCheckoutSubmit());
    const mockFormikHelpers = createMockFormikHelpers();

    jest.useFakeTimers();

    await act(async () => {
      await result.current(mockValues, mockFormikHelpers);
      jest.runAllTimers();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/payment/123456");

    jest.useRealTimers();
  });

  it("should handle and display error message on submission failure", async () => {
    const mockValues = {
      fullName: "GUY MAX",
      phoneNumber: "1234567890",
      country: "Rwanda",
      streetAddress: "123 Main St",
      town: "Kigali",
      email: "guy@example.com",
      deliveryDate: "2025-12-31",
      paymentMethod: "mobileMoney",
      mobileMoneyNumber: "0781234567",
    };

    mockPost.mockRejectedValueOnce(new Error("API Error"));

    const { result } = renderHook(() => useCheckoutSubmit());
    const mockFormikHelpers = createMockFormikHelpers();

    await act(async () => {
      await result.current(mockValues, mockFormikHelpers);
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Checkout failed. Please try again.",
    );
  });

  it("should handle submission error", async () => {
    const mockValues = {
      fullName: "GUY MAX",
      phoneNumber: "1234567890",
      country: "Rwanda",
      streetAddress: "123 Main St",
      town: "Kigali",
      email: "guy@example.com",
      deliveryDate: "2025-12-31",
      paymentMethod: "mobileMoney",
      mobileMoneyNumber: "0781234567",
    };

    mockPost.mockRejectedValueOnce(new Error("API Error"));

    const { result } = renderHook(() => useCheckoutSubmit());
    const mockFormikHelpers = createMockFormikHelpers();

    await act(async () => {
      await result.current(mockValues, mockFormikHelpers);
    });

    expect(mockPost).toHaveBeenCalledWith(
      "/checkout",
      expect.objectContaining(mockValues),
    );
    expect(toast.error).toHaveBeenCalledWith(
      "Checkout failed. Please try again.",
    );
    expect(mockFormikHelpers.setSubmitting).toHaveBeenCalledWith(false);
  });
});
