import React, { useState } from "react";

const DeclarationForm = ({ onNext }) => {
  const [formData, setFormData] = useState({
    reportStatus: "POSITIVE",
    certification:
      "We certify that the above report is accurate and current to the best of our knowledge.",
    declaration: "I hereby declare that:",
    visitedDate: "23.07.2024",
    noInterest: "I have no direct or indirect interest in the property valued.",
    informationTrue:
      "The information furnished in the report is true and correct to the best of my knowledge and belief.",
    constructionSafe:
      "In our view the work being done for construction/extension/improvement in the dwelling unit does not endanger the residents in the dwelling unit and the structure of the building is safe & suitable for the aforesaid work in the dwelling unit.",
    googleMapAttached: "Google map copy attached here with.",
    landAreaMatching:
      "The land area in sale deed / agreement is matching with the area considered for valuation.",
    name: "sourabh",
    signature: "sourabh",
    applicantName: "MR. SUMER SINGH YADAV S/O. SHRI BAL KRISHAN",
    applicantAppNo: "GG1262723",
    applicantAddress:
      "PLOT NO. 91, PART OF KH NO. 288/1/2/1/1, 288/1/2/3, PH NO. 21, RNM-02, VIKASKHAND PHANDA, WARD NO. 67, GRAM KHEJDA BARAMAD, TEHSIL HUZUR DIST BHOPAL MP-",
    photos: "no provide",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form Data:", formData);
    onNext(formData);
    // You can add your submission logic here
  };

  return (
    <div className=' mx-auto p-4'>
      <form
        onSubmit={handleSubmit}
        className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
      >
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='reportStatus'
          >
            Report Status
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='reportStatus'
            type='text'
            name='reportStatus'
            value={formData.reportStatus}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='certification'
          >
            Certification
          </label>
          <textarea
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='certification'
            name='certification'
            rows='3'
            value={formData.certification}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='declaration'
          >
            Declaration
          </label>
          <textarea
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='declaration'
            name='declaration'
            rows='3'
            value={formData.declaration}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='visitedDate'
          >
            Date of Visit
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='visitedDate'
            type='text'
            name='visitedDate'
            value={formData.visitedDate}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='noInterest'
          >
            No Interest Declaration
          </label>
          <textarea
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='noInterest'
            name='noInterest'
            rows='3'
            value={formData.noInterest}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='informationTrue'
          >
            Information True Declaration
          </label>
          <textarea
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='informationTrue'
            name='informationTrue'
            rows='3'
            value={formData.informationTrue}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='constructionSafe'
          >
            Construction Safety Declaration
          </label>
          <textarea
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='constructionSafe'
            name='constructionSafe'
            rows='3'
            value={formData.constructionSafe}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='googleMapAttached'
          >
            Google Map Attached Declaration
          </label>
          <textarea
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='googleMapAttached'
            name='googleMapAttached'
            rows='3'
            value={formData.googleMapAttached}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='landAreaMatching'
          >
            Land Area Matching Declaration
          </label>
          <textarea
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='landAreaMatching'
            name='landAreaMatching'
            rows='3'
            value={formData.landAreaMatching}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='name'
          >
            Name
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='name'
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='signature'
          >
            Signature & Stamp
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='signature'
            type='text'
            name='signature'
            value={formData.signature}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='applicantName'
          >
            Applicant Name
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='applicantName'
            type='text'
            name='applicantName'
            value={formData.applicantName}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='applicantAppNo'
          >
            Applicant App No
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='applicantAppNo'
            type='text'
            name='applicantAppNo'
            value={formData.applicantAppNo}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='applicantAddress'
          >
            Applicant Address
          </label>
          <textarea
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='applicantAddress'
            name='applicantAddress'
            rows='3'
            value={formData.applicantAddress}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='photos'
          >
            Photos
          </label>
          <textarea
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='photos'
            name='photos'
            rows='3'
            value={formData.photos}
            onChange={handleChange}
          />
        </div>
        <div className='flex items-center justify-between'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            type='submit'
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeclarationForm;
