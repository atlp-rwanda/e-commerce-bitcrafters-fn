import React from "react";
import { Dialog } from "@headlessui/react";

interface RoleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newRole: string) => void;
  currentRole: string;
  setNewRole: (role: string) => void;
}

const RoleChangeModal: React.FC<RoleChangeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentRole,
}) => {
  const [newRole, setRole] = React.useState(currentRole);

  const handleSave = () => {
    onSave(newRole);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black opacity-30" />
        <div className="bg-white rounded-lg max-w-md mx-auto p-4 z-20">
          <Dialog.Title className="text-lg font-bold">Change Role</Dialog.Title>
          <select
            value={newRole}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="admin">Admin</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
          <div className="mt-4 flex justify-end">
            <button onClick={onClose} className="mr-2 bg-gray-200 p-2 rounded">
              Close
            </button>
            <button
              onClick={handleSave}
              className="bg-black text-white p-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default RoleChangeModal;
