import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const UnitDetails = ({ isEdit, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Initialize state with all the fields
  const [formData, setFormData] = useState({
    groundFloorDetails: "",
    firstFloorDetails: "",
    secondFloorDetails: "",
    saleDeed: "",
    saleDeedDetails: "",
    sanctionedPlan: "",
    sanctionedPlanDetails: "",
    ccOc: "",
    ccOcDetails: "",
    agreementToSale: "",
    agreementToSaleDetails: "",
    mutationPossession: "",
    mutationPossessionDetails: "",
    taxReceipt: "",
    taxReceiptDetails: "",
    electricityBill: "",
    electricityBillDetails: "",
    conversion: "",
    conversionDetails: "",
    groundFloorArea: "",
    groundFloorPlanMatch: "",
    groundFloorDeviations: "",
    groundFloorRemarks: "",
    firstFloorArea: "",
    firstFloorPlanMatch: "",
    firstFloorDeviations: "",
    firstFloorRemarks: "",
    secondFloorArea: "",
    secondFloorPlanMatch: "",
    secondFloorDeviations: "",
    secondFloorRemarks: "",
    totalArea: "",
    totalPlanMatch: "",
    totalDeviations: "",
    totalRemarks: "",
    plotAreaDeed: "",
    plotRateDeed: "",
    plotValueDeed: "",
    plotAreaPhysical: "",
    plotRatePhysical: "",
    plotValuePhysical: "",
    carpetAreaPlan: "",
    carpetRatePlan: "",
    carpetValuePlan: "",
    carpetAreaMeasurement: "",
    carpetRateMeasurement: "",
    carpetValueMeasurement: "",
    builtUpAreaNorms: "",
    builtUpRateNorms: "",
    builtUpValueNorms: "",
    builtUpAreaMeasurement: "",
    builtUpRateMeasurement: "",
    builtUpValueMeasurement: "",
    superBuiltUpArea: "",
    superBuiltUpRate: "",
    superBuiltUpValue: "",
    carParkArea: "",
    carParkRate: "",
    carParkValue: "",
    amenitiesArea: "",
    amenitiesRate: "",
    amenitiesValue: "",
  });

  // Initialize formData when editing
  useEffect(() => {
    if (isEdit) {
      setFormData({
        groundFloorDetails: isEdit.groundFloorDetails || "",
        firstFloorDetails: isEdit.firstFloorDetails || "",
        secondFloorDetails: isEdit.secondFloorDetails || "",
        saleDeed: isEdit.saleDeed || "",
        saleDeedDetails: isEdit.saleDeedDetails || "",
        sanctionedPlan: isEdit.sanctionedPlan || "",
        sanctionedPlanDetails: isEdit.sanctionedPlanDetails || "",
        ccOc: isEdit.ccOc || "",
        ccOcDetails: isEdit.ccOcDetails || "",
        agreementToSale: isEdit.agreementToSale || "",
        agreementToSaleDetails: isEdit.agreementToSaleDetails || "",
        mutationPossession: isEdit.mutationPossession || "",
        mutationPossessionDetails: isEdit.mutationPossessionDetails || "",
        taxReceipt: isEdit.taxReceipt || "",
        taxReceiptDetails: isEdit.taxReceiptDetails || "",
        electricityBill: isEdit.electricityBill || "",
        electricityBillDetails: isEdit.electricityBillDetails || "",
        conversion: isEdit.conversion || "",
        conversionDetails: isEdit.conversionDetails || "",
        groundFloorArea: isEdit.groundFloorArea || "",
        groundFloorPlanMatch: isEdit.groundFloorPlanMatch || "",
        groundFloorDeviations: isEdit.groundFloorDeviations || "",
        groundFloorRemarks: isEdit.groundFloorRemarks || "",
        firstFloorArea: isEdit.firstFloorArea || "",
        firstFloorPlanMatch: isEdit.firstFloorPlanMatch || "",
        firstFloorDeviations: isEdit.firstFloorDeviations || "",
        firstFloorRemarks: isEdit.firstFloorRemarks || "",
        secondFloorArea: isEdit.secondFloorArea || "",
        secondFloorPlanMatch: isEdit.secondFloorPlanMatch || "",
        secondFloorDeviations: isEdit.secondFloorDeviations || "",
        secondFloorRemarks: isEdit.secondFloorRemarks || "",
        totalArea: isEdit.totalArea || "",
        totalPlanMatch: isEdit.totalPlanMatch || "",
        totalDeviations: isEdit.totalDeviations || "",
        totalRemarks: isEdit.totalRemarks || "",
        plotAreaDeed: isEdit.plotAreaDeed || "",
        plotRateDeed: isEdit.plotRateDeed || "",
        plotValueDeed: isEdit.plotValueDeed || "",
        plotAreaPhysical: isEdit.plotAreaPhysical || "",
        plotRatePhysical: isEdit.plotRatePhysical || "",
        plotValuePhysical: isEdit.plotValuePhysical || "",
        carpetAreaPlan: isEdit.carpetAreaPlan || "",
        carpetRatePlan: isEdit.carpetRatePlan || "",
        carpetValuePlan: isEdit.carpetValuePlan || "",
        carpetAreaMeasurement: isEdit.carpetAreaMeasurement || "",
        carpetRateMeasurement: isEdit.carpetRateMeasurement || "",
        carpetValueMeasurement: isEdit.carpetValueMeasurement || "",
        builtUpAreaNorms: isEdit.builtUpAreaNorms || "",
        builtUpRateNorms: isEdit.builtUpRateNorms || "",
        builtUpValueNorms: isEdit.builtUpValueNorms || "",
        builtUpAreaMeasurement: isEdit.builtUpAreaMeasurement || "",
        builtUpRateMeasurement: isEdit.builtUpRateMeasurement || "",
        builtUpValueMeasurement: isEdit.builtUpValueMeasurement || "",
        superBuiltUpArea: isEdit.superBuiltUpArea || "",
        superBuiltUpRate: isEdit.superBuiltUpRate || "",
        superBuiltUpValue: isEdit.superBuiltUpValue || "",
        carParkArea: isEdit.carParkArea || "",
        carParkRate: isEdit.carParkRate || "",
        carParkValue: isEdit.carParkValue || "",
        amenitiesArea: isEdit.amenitiesArea || "",
        amenitiesRate: isEdit.amenitiesRate || "",
        amenitiesValue: isEdit.amenitiesValue || "",
      });
    }
  }, [isEdit]);

  // Handle change in form data

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextClick = () => {
    onNext(formData);
    toast.success("Saved Successfully");
  };

  return (
    <div className='accordion-item mb-4'>
      <div
        className='accordion-header p-3 border rounded'
        style={{ backgroundColor: "#1E2939  ", cursor: "pointer" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='flex justify-between items-center text-white'>
          <h4 className='m-0'>Unit Details</h4>
          <button
            type='button'
            className='bg-white text-gray-800 font-semibold py-1 px-2 rounded'
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? "Close" : "Edit"}
          </button>
        </div>
      </div>
      {isOpen && (
        <div
          className='accordion-body p-3 border rounded mt-2'
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <div className='card-body'>
            <h5 className='mb-3'>Accommodation/Unit Details</h5>

            <div className='grid grid-cols-12 gap-4 mb-3'>
              <div className='col-span-12'>
                <table className='table table-bordered w-full'>
                  <thead>
                    <tr>
                      <th className='border px-4 py-2'>Building</th>
                      <th className='border px-4 py-2'>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='border px-4 py-2'>Ground Floor</td>
                      <td className='border px-4 py-2'>
                        <input
                          type='text'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='groundFloorDetails'
                          value={formData.groundFloorDetails}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className='border px-4 py-2'>FIRST FLOOR</td>
                      <td className='border px-4 py-2'>
                        <input
                          type='text'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='firstFloorDetails'
                          value={formData.firstFloorDetails}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className='border px-4 py-2'>SECOND FLOOR</td>
                      <td className='border px-4 py-2'>
                        <input
                          type='text'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='secondFloorDetails'
                          value={formData.secondFloorDetails}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h5 className='mb-3'>Document Availability</h5>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-6'>
                <div className='mb-3'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Sale Deed/Allotment Letter
                  </label>
                  <select
                    className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                    name='saleDeed'
                    value={formData.saleDeed}
                    onChange={handleChange}
                  >
                    <option value='Fully Available'>Fully Available</option>
                    <option value='Partially Available'>
                      Partially Available
                    </option>
                    <option value='Not Available'>Not Available</option>
                    <option value='Not Applicable'>Not Applicable</option>
                  </select>
                </div>
                <div className='mb-3'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Details
                  </label>
                  <input
                    type='text'
                    className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                    name='saleDeedDetails'
                    value={formData.saleDeedDetails}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className='col-span-6'>
                <div className='mb-3'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Sanctioned Plan
                  </label>
                  <select
                    className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                    name='sanctionedPlan'
                    value={formData.sanctionedPlan}
                    onChange={handleChange}
                  >
                    <option value='Fully Available'>Fully Available</option>
                    <option value='Partially Available'>
                      Partially Available
                    </option>
                    <option value='Not Available'>Not Available</option>
                    <option value='Not Applicable'>Not Applicable</option>
                  </select>
                </div>
                <div className='mb-3'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Details
                  </label>
                  <input
                    type='text'
                    className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                    name='sanctionedPlanDetails'
                    value={formData.sanctionedPlanDetails}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-6'>
                <div className='mb-3'>
                  <label className='block text-sm font-medium text-gray-700'>
                    CC/OC
                  </label>
                  <select
                    className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                    name='ccOc'
                    value={formData.ccOc}
                    onChange={handleChange}
                  >
                    <option value='Fully Available'>Fully Available</option>
                    <option value='Partially Available'>
                      Partially Available
                    </option>
                    <option value='Not Available'>Not Available</option>
                    <option value='Not Applicable'>Not Applicable</option>
                  </select>
                </div>
                <div className='mb-3'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Details
                  </label>
                  <input
                    type='text'
                    className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                    name='ccOcDetails'
                    value={formData.ccOcDetails}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className='col-span-6'>
                <div className='mb-3'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Agreement to Sale
                  </label>
                  <select
                    className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                    name='agreementToSale'
                    value={formData.agreementToSale}
                    onChange={handleChange}
                  >
                    <option value='Fully Available'>Fully Available</option>
                    <option value='Partially Available'>
                      Partially Available
                    </option>
                    <option value='Not Available'>Not Available</option>
                    <option value='Not Applicable'>Not Applicable</option>
                  </select>
                </div>
                <div className='mb-3'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Details
                  </label>
                  <input
                    type='text'
                    className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                    name='agreementToSaleDetails'
                    value={formData.agreementToSaleDetails}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-6'>
                <div className='mb-3'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Mutation/Possession Letter
                  </label>
                  <select
                    className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                    name='mutationPossession'
                    value={formData.mutationPossession}
                    onChange={handleChange}
                  >
                    <option value='Fully Available'>Fully Available</option>
                    <option value='Partially Available'>
                      Partially Available
                    </option>
                    <option value='Not Available'>Not Available</option>
                    <option value='Not Applicable'>Not Applicable</option>
                  </select>
                </div>
                <div className='mb-3'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Details
                  </label>
                  <input
                    type='text'
                    className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                    name='mutationPossessionDetails'
                    value={formData.mutationPossessionDetails}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className='col-span-6'>
                <div className='mb-3'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Tax Receipt
                  </label>
                  <select
                    className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                    name='taxReceipt'
                    value={formData.taxReceipt}
                    onChange={handleChange}
                  >
                    <option value='Fully Available'>Fully Available</option>
                    <option value='Partially Available'>
                      Partially Available
                    </option>
                    <option value='Not Available'>Not Available</option>
                    <option value='Not Applicable'>Not Applicable</option>
                  </select>
                </div>
                <div className='mb-3'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Details
                  </label>
                  <input
                    type='text'
                    className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                    name='taxReceiptDetails'
                    value={formData.taxReceiptDetails}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-6'>
                <div className='mb-3'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Electricity Bill
                  </label>
                  <select
                    className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                    name='electricityBill'
                    value={formData.electricityBill}
                    onChange={handleChange}
                  >
                    <option value='Fully Available'>Fully Available</option>
                    <option value='Partially Available'>
                      Partially Available
                    </option>
                    <option value='Not Available'>Not Available</option>
                    <option value='Not Applicable'>Not Applicable</option>
                  </select>
                </div>
                <div className='mb-3'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Details
                  </label>
                  <input
                    type='text'
                    className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                    name='electricityBillDetails'
                    value={formData.electricityBillDetails}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className='col-span-6'>
                <div className='mb-3'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Conversion
                  </label>
                  <select
                    className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                    name='conversion'
                    value={formData.conversion}
                    onChange={handleChange}
                  >
                    <option value='Fully Available'>Fully Available</option>
                    <option value='Partially Available'>
                      Partially Available
                    </option>
                    <option value='Not Available'>Not Available</option>
                    <option value='Not Applicable'>Not Applicable</option>
                  </select>
                </div>
                <div className='mb-3'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Details
                  </label>
                  <input
                    type='text'
                    className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                    name='conversionDetails'
                    value={formData.conversionDetails}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <h5 className='mb-3 mt-4'>Built Up Area</h5>
            <div className='grid grid-cols-12 gap-4 mb-3'>
              <div className='col-span-12'>
                <table className='table table-bordered w-full'>
                  <thead>
                    <tr>
                      <th className='border px-4 py-2'>Floor</th>
                      <th className='border px-4 py-2'>As per Site</th>
                      <th className='border px-4 py-2'>As per Plan/FAR</th>
                      <th className='border px-4 py-2'>Deviations</th>
                      <th className='border px-4 py-2'>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='border px-4 py-2'>Ground Floor</td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='groundFloorArea'
                          value={formData.groundFloorArea}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <select
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='groundFloorPlanMatch'
                          value={formData.groundFloorPlanMatch}
                          onChange={handleChange}
                        >
                          <option value='Yes'>Yes</option>
                          <option value='No'>No</option>
                        </select>
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='text'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='groundFloorDeviations'
                          value={formData.groundFloorDeviations}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='text'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='groundFloorRemarks'
                          value={formData.groundFloorRemarks}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className='border px-4 py-2'>FIRST FLOOR</td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='firstFloorArea'
                          value={formData.firstFloorArea}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <select
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='firstFloorPlanMatch'
                          value={formData.firstFloorPlanMatch}
                          onChange={handleChange}
                        >
                          <option value='Yes'>Yes</option>
                          <option value='No'>No</option>
                        </select>
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='text'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='firstFloorDeviations'
                          value={formData.firstFloorDeviations}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='text'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='firstFloorRemarks'
                          value={formData.firstFloorRemarks}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className='border px-4 py-2'>SECOND FLOOR</td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='secondFloorArea'
                          value={formData.secondFloorArea}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='text'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='secondFloorPlanMatch'
                          value={formData.secondFloorPlanMatch}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='text'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='secondFloorDeviations'
                          value={formData.secondFloorDeviations}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='text'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='secondFloorRemarks'
                          value={formData.secondFloorRemarks}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className='border px-4 py-2'>Total</td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='totalArea'
                          value={formData.totalArea}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <select
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='totalPlanMatch'
                          value={formData.totalPlanMatch}
                          onChange={handleChange}
                        >
                          <option value='Yes'>Yes</option>
                          <option value='No'>No</option>
                        </select>
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='text'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='totalDeviations'
                          value={formData.totalDeviations}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='text'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='totalRemarks'
                          value={formData.totalRemarks}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h5 className='mb-3'>Detailing</h5>
            <div className='grid grid-cols-12 gap-4 mb-3'>
              <div className='col-span-12'>
                <table className='table table-bordered w-full'>
                  <thead>
                    <tr>
                      <th className='border px-4 py-2'>Item</th>
                      <th className='border px-4 py-2'>Area in Sqft</th>
                      <th className='border px-4 py-2'>Rate per Sqft</th>
                      <th className='border px-4 py-2'>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='border px-4 py-2'>Plot Area (in Deed)</td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='plotAreaDeed'
                          value={formData.plotAreaDeed}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='plotRateDeed'
                          value={formData.plotRateDeed}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='plotValueDeed'
                          value={formData.plotValueDeed}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className='border px-4 py-2'>
                        Plot Area (as per physical)
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='plotAreaPhysical'
                          value={formData.plotAreaPhysical}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='plotRatePhysical'
                          value={formData.plotRatePhysical}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='plotValuePhysical'
                          value={formData.plotValuePhysical}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className='border px-4 py-2'>
                        Carpet Area (as per plan)
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='carpetAreaPlan'
                          value={formData.carpetAreaPlan}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='carpetRatePlan'
                          value={formData.carpetRatePlan}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='carpetValuePlan'
                          value={formData.carpetValuePlan}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className='border px-4 py-2'>
                        Carpet Area (as per measurement)
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='carpetAreaMeasurement'
                          value={formData.carpetAreaMeasurement}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='carpetRateMeasurement'
                          value={formData.carpetRateMeasurement}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='carpetValueMeasurement'
                          value={formData.carpetValueMeasurement}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className='border px-4 py-2'>
                        Built Up Area (as per Norms)
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='builtUpAreaNorms'
                          value={formData.builtUpAreaNorms}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='builtUpRateNorms'
                          value={formData.builtUpRateNorms}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='builtUpValueNorms'
                          value={formData.builtUpValueNorms}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className='border px-4 py-2'>
                        Built Up Area (as per measurement)
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='builtUpAreaMeasurement'
                          value={formData.builtUpAreaMeasurement}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='builtUpRateMeasurement'
                          value={formData.builtUpRateMeasurement}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='builtUpValueMeasurement'
                          value={formData.builtUpValueMeasurement}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className='border px-4 py-2'>Super Built-Up Area</td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='superBuiltUpArea'
                          value={formData.superBuiltUpArea}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='superBuiltUpRate'
                          value={formData.superBuiltUpRate}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='superBuiltUpValue'
                          value={formData.superBuiltUpValue}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className='border px-4 py-2'>Car Park</td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='carParkArea'
                          value={formData.carParkArea}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='carParkRate'
                          value={formData.carParkRate}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='carParkValue'
                          value={formData.carParkValue}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className='border px-4 py-2'>Amenities</td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='amenitiesArea'
                          value={formData.amenitiesArea}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='amenitiesRate'
                          value={formData.amenitiesRate}
                          onChange={handleChange}
                        />
                      </td>
                      <td className='border px-4 py-2'>
                        <input
                          type='number'
                          className='w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                          name='amenitiesValue'
                          value={formData.amenitiesValue}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className='text-right mt-2'>
                <button
                  onClick={handleNextClick}
                  className='bg-[#1E2939]  text-white font-semibold px-6 py-2 rounded'
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitDetails;
