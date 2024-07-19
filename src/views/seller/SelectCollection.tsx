import { useEffect, useState } from 'react';
import useAxiosClient from '../../hooks/AxiosInstance';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Option = {
  name: string;
  description: string;
  id?: string;
};
interface Collection {
  name: string;
  description: string;
  id?: string
}

const SelectCollection = () => {
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [collectionsStatus, setCollectionsStatus] = useState('loading');
  const axiosClient = useAxiosClient();

  useEffect(() => {
    const fetchCollections = async ()=>{
      try{
        const response = await axiosClient.get("/collections?limit=100");
        if(response.status ===200){
          setCollections(response.data.collections);
          setCollectionsStatus('succeeded')
        }  
      }catch(error){
        setCollectionsStatus('failed')
      }
    }
    fetchCollections();
  }, [axiosClient]);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>('Collections');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option.name);
    const collectionId = localStorage.getItem("collectionId")
    if(collectionId){
      localStorage.removeItem("collectionId")
      localStorage.setItem("collectionId", option.id as string)
    }else{
      localStorage.setItem("collectionId", option.id as string)
    }
    setIsOpen(false);
  };

  const renderOptions = () => {
    if (!Array.isArray(collections)) {
      return null;
    }
    switch (collectionsStatus) {
      case 'loading':
        return <div className="block px-4 py-2 text-sm text-gray-700">Loading collections...</div>;
      case 'succeeded':
        return (
          <div className="py-1" role="none">
            {collections.map((option) => (
              <a
                key={option?.id}
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 relative"
                role="menuitem"
                onClick={() => handleOptionSelect(option)}
              >
                {option.name}
              </a>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="relative text-left grid grid-cols-4 flex">
      <div className='col-span-4 sm:col-span-2'>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={toggleDropdown}
        >
          {selectedOption}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute z-50 right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          {renderOptions()}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default SelectCollection;
