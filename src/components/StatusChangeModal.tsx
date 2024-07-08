import React, { useState, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import axiosClient from "../hooks/AxiosInstance";
import { toast } from "react-toastify";

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (userId: number, newStatus: string) => void;
  currentStatus: string;
  user: { name: string; id: number };
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative pb-5" ref={dropdownRef}>
      <div
        className="outline-none focus:outline-none shadow-[0_0_2px_rgba(0,0,0,0.9)] rounded p-2 w-full mt-2 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.charAt(0).toUpperCase() + value.slice(1)}
        <FaChevronDown
          className={`transition-transform duration-300 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
          {options.map((option) => (
            <div
              key={option}
              className={`p-2 cursor-pointer hover:bg-customGreen hover:text-white transition-colors duration-200 ${
                value === option ? "" : ""
              }`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  isOpen,
  onClose,
  onStatusChange,
  currentStatus,
  user,
}) => {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const client = axiosClient();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await client.patch(`/users/${user.id}/status`, {
        newStatus,
        description,
      });
      toast(`User status updated to ${newStatus} successfully and email sent`);
      onStatusChange(user.id, newStatus);
      onClose();
    } catch (err: any) {
      toast(
        err.response ? err.response.data.message : "Failed to update status",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black opacity-30" />
        <div className="bg-white rounded-lg max-w-md mx-auto p-4 z-20 relative">
          <div className="flex justify-center items-center">
            <button
              onClick={onClose}
              className={`absolute top-0 right-0 p-2 rounded ${
                isLoading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200"
              }`}
              aria-label="Close"
              disabled={isLoading}
            >
              <IoCloseSharp className="text-[20px]" />
            </button>
            <Dialog.Title className="text-lg font-bold pr-8">
              Change Status of{" "}
              <span className="text-customGreen font-semibold">
                {user.name}
              </span>
            </Dialog.Title>
          </div>
          <CustomSelect
            value={newStatus}
            onChange={setNewStatus}
            options={["active", "inactive"]}
          />
          {newStatus === "inactive" && (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Reason for deactivation"
              className="outline-none focus:outline-none shadow-[0_0_2px_rgba(0,0,0,0.9)] rounded p-2 w-full mt-2 text-xs"
              rows={3}
              disabled={isLoading}
            />
          )}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-black text-white p-2 rounded"
              disabled={(newStatus === "inactive" && !description) || isLoading}
            >
              {isLoading ? "Loading..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default StatusChangeModal;
