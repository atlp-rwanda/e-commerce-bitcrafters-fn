import { useState } from 'react';
import {  ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosClient from '../../hooks/AxiosInstance';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (optionName: string) => void;
}
interface Collection {
  name: string;
  description: string;
  id?: string
}

const CreateCollection: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [optionName, setOptionName] = useState('');
  const [optionDescription, setOptionDescription] = useState('');
  const axiosClient = useAxiosClient();
  if (!isOpen) return null;
  const addNewCollection = async (collection: Collection)=>{
    try{
        await axiosClient.post("/collections", collection);
    }catch(error){
      toast.error("Error creating Collection Try again");
    }

  }
  const handleSave = () => {
    if (optionName.trim()) {
      onSave(optionName);
      onSave(optionDescription);
      setOptionName('');
      setOptionDescription('');
      addNewCollection({
        name: optionName,
        description: optionDescription
      })
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[50%]">
        <h2 className="text-xl mb-4">Add New Collection</h2>
        <label className="text-xl mb-4 block">Name</label>
        <input
          type="text"
          className="border border-gray-300 rounded-md px-2 py-1 w-full mb-4"
          value={optionName}
          onChange={(e) => setOptionName(e.target.value)}
          placeholder="Collection name"
        />
        <label className="text-xl mb-4 block">Description</label>
        <textarea
          className="border border-gray-300 rounded-md px-2 py-1 w-full mb-4"
          value={optionDescription}
          onChange={(e) => setOptionDescription(e.target.value)}
          placeholder="Describe your collection"
        />
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
            onClick={onClose}
          >
            <span className='w-50rem'>Cancel</span>
          </button>
          <button
            className="px-4 py-2 bg-black text-white rounded-md"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateCollection;
