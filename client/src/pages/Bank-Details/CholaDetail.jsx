import React, { useState } from "react";

import PropertyLocation from "./Cholaa/PropertyLocation";
import Conditions from "./Cholaa/Conditions";
import Specifications from "./Cholaa/Specifications";
import StageConstruction from "./Cholaa/StageConstruction";
import Remarks from "./Cholaa/Remarks";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getDetailsById } from "../../redux/features/Banks/CholaBank/CholaThunks";
import DocumentUpload from "./Cholaa/DocumentUpload";
const CholaDetail = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [recommended, setRecommended] = useState(false);

  const components = {
    Location: { title: "LOCATION", content: <PropertyLocation />, icon: "📝" },
    conditions: { title: "CONDITIONS", content: <Conditions />, icon: "📝" },
    specifications: {
      title: "SPECIFICATIONS",
      content: <Specifications />,
      icon: "📋",
    },
    construction: {
      title: "CONSTRUCTION STAGE",
      content: <StageConstruction />,
      icon: "🏗️",
    },
    document: {
      title: "DOCUMENT UPLOAD",
      content: <DocumentUpload />,
      icon: "📎",
    },
    remarks: { title: "REMARKS", content: <Remarks />, icon: "💬" },
  };

  const userDetails = {
    mainApplicant: "MAMTA TYAGI",
    productType: "LAP Resale Independent House",
    applicationNumber: "60810631",
    applicationDate: "13/01/2025 06:46 PM",
    contact: "+91 98765 43210",
    email: "mamta.tyagi@example.com",
  };

  const dispatch = useDispatch();
  const { id } = useParams();

  const init = async (id) => {
    try {
      console.log(await dispatch(getDetailsById(id)), "Chola Detail Page");
      await dispatch(getDetailsById(id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      init(id);
    }
  }, [id]);

  return (
    <div className='container mx-auto mt-4 px-4'>
      <div className='flex flex-col md:flex-row gap-4'>
        {/* Left Column */}
        <div className='w-full md:w-1/4 space-y-4'>
          <div className='border shadow rounded overflow-hidden'>
            <div className='bg-gray-800 text-white flex justify-between items-center p-2'>
              <h5 className='text-sm'>APPLICANT DETAILS</h5>
              <span className='bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded'>
                ACTIVE
              </span>
            </div>
            <div className='p-3 text-sm'>
              <div className='mb-3'>
                <p className='text-gray-500 text-xs'>MAIN APPLICANT</p>
                <p className='font-semibold'>{userDetails.mainApplicant}</p>
              </div>
              <div className='mb-3'>
                <p className='text-gray-500 text-xs'>PRODUCT TYPE</p>
                <p>{userDetails.productType}</p>
              </div>
              <div className='mb-3'>
                <p className='text-gray-500 text-xs'>APPLICATION NUMBER</p>
                <p>{userDetails.applicationNumber}</p>
              </div>
              <div>
                <p className='text-gray-500 text-xs'>DATE OF APPLICATION</p>
                <p>{userDetails.applicationDate}</p>
              </div>
            </div>
          </div>

          {/* Section Navigation */}
          <div className='border shadow rounded overflow-hidden'>
            <div className='bg-gray-100 p-2'>
              <h5 className='text-sm font-medium'>Sections</h5>
            </div>
            <ul>
              {Object.entries(components).map(([key, { title, icon }]) => (
                <li
                  key={key}
                  onClick={() => setActiveComponent(key)}
                  className={`flex justify-between items-center px-3 py-2 cursor-pointer border-t text-sm ${
                    activeComponent === key
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span>
                    {icon} {title}
                  </span>
                  {activeComponent === key && (
                    <span className='text-xs bg-white text-gray-800 px-2 py-0.5 rounded'>
                      Active
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <div className='bg-gray-100 px-3 py-2 flex justify-between items-center'>
              <h6 className='text-sm font-medium'>Recommendation:</h6>
              <button
                className={`text-xs px-3 py-1 rounded ${
                  recommended
                    ? "bg-green-500 text-white"
                    : "border border-red-500 text-red-500"
                }`}
                onClick={() => setRecommended(!recommended)}
              >
                {recommended ? "YES" : "NO"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className='w-full md:w-3/4'>
          <div className='border shadow rounded overflow-hidden h-full'>
            <div className='bg-gray-100 p-3 flex justify-between items-center'>
              <h5 className='text-sm font-medium'>
                {activeComponent
                  ? components[activeComponent].title
                  : "Select a section"}
              </h5>
              {activeComponent && (
                <span className='bg-blue-200 text-blue-800 px-2 py-0.5 text-xs rounded'>
                  {components[activeComponent].icon}
                </span>
              )}
            </div>
            <div className='p-4'>
              {activeComponent ? (
                components[activeComponent].content
              ) : (
                <div className='text-center text-gray-400 py-10'>
                  <p>👈 Select a section from the sidebar</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CholaDetail;
