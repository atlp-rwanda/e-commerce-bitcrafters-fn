import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newQuantity: number) => void;
  initialQuantity: number;
}

const UpdateCart: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialQuantity,
}) => {
  const [newQuantity, setNewQuantity] = useState<number>(initialQuantity);

  const handleSubmit = () => {
    onSubmit(newQuantity);
    onClose();
  };

  const handleCancel = () => {
    setNewQuantity(initialQuantity);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="fixed inset-0 bg-black opacity-30" />
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg max-w-md mx-auto p-4 z-20">
          <Dialog.Title className="text-lg font-bold">
            Update Quantity
          </Dialog.Title>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="mt-4">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                value={newQuantity}
                onChange={(e) => setNewQuantity(Number(e.target.value))}
                className="border rounded p-2 w-full mt-1"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                data-testid="modal-update-button"
                type="button"
                onClick={handleCancel}
                className="mr-2 bg-gray-200 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                data-testid="modal-cancel-button"
                type="submit"
                className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-500 ${
                  newQuantity <= 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={newQuantity <= 0}
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default UpdateCart;
