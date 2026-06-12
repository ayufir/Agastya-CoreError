// import React, { useState } from 'react';

// const PropertyDetails = ({ onDataChange }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     onDataChange(prev => ({ ...prev, [name]: value }));
//   };

//   return (
//     <div className="mb-6 border border-gray-300 rounded-lg">
//       <div
//         className="p-4 bg-gray-800 text-white flex justify-between items-center cursor-pointer rounded-t-lg"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <h4 className="text-lg font-semibold">PROPERTY DETAILS</h4>
//         <button
//           type="button"
//           className="bg-white text-black px-3 py-1 rounded text-sm hover:bg-gray-200"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsOpen(!isOpen);
//           }}
//         >
//           {isOpen ? "Close" : "Edit"}
//         </button>
//       </div>

//       {isOpen && (
//         <div className="p-6 bg-gray-100 rounded-b-lg">
//           <section className="mb-6">
//             <h5 className="text-md font-semibold mb-4">Occupant</h5>
//             <div className="grid md:grid-cols-3 gap-4">
//               <Input label="Vacant/Occupied:" name="vacantOccupied" defaultValue="Occupied" onChange={handleChange} />
//               <Input label="Name of Occupant:" name="nameOfOccupant" defaultValue="SELF" onChange={handleChange} />
//               <Input label="Relation with applicant:" name="relationWithApplicant" defaultValue="SELF" onChange={handleChange} />
//             </div>
//           </section>

//           <section className="mb-6">
//             <div className="grid md:grid-cols-3 gap-4">
//               <Input label="Property Demarcation (Yes/No):" name="propertyDemarcation" defaultValue="YES" onChange={handleChange} />
//               <Input label="Property Identified (Yes/No):" name="propertyIdentified" defaultValue="YES" onChange={handleChange} />
//               <Input label="Property Identified through (Yes/No):" name="propertyIdentifiedThrough" defaultValue="CUSTOMER AND FOUR SIDE BOUNDARY" onChange={handleChange} />
//             </div>
//           </section>

//           <section className="mb-6">
//             <h5 className="text-md font-semibold mb-4">Building details</h5>
//             <div className="grid md:grid-cols-3 gap-4">
//               <Input label="Type of structure:" name="typeOfStructure" defaultValue="RCC" onChange={handleChange} />
//               <Input label="Land/Plot Area:" name="landPlotArea" defaultValue="900" onChange={handleChange} />
//               <Input label="No of Blocks if applicable:" name="noOfBlocks" defaultValue="Na" onChange={handleChange} />
//               <Input label="No of Units on floor:" name="noOfUnitsOnFloor" defaultValue="Na" onChange={handleChange} />
//               <Input label="No. of Floors:" name="noOfFloors" defaultValue="GROUND FLOOR+FF U/C" onChange={handleChange} />
//               <Input label="No. of Lifts:" name="noOfLifts" defaultValue="NA" onChange={handleChange} />
//               <Input label="Amenities Available (e.g. Swimming Pool, Club House, etc.):" name="amenitiesAvailable" defaultValue="Na" onChange={handleChange} />
//               <Input label="Delivery Agency:" name="deliveryAgency" defaultValue="Internal Road" onChange={handleChange} />
//             </div>
//           </section>

//           <section className="mb-6">
//             <h5 className="text-md font-semibold mb-4">Unit details</h5>
//             <div className="grid md:grid-cols-3 gap-4">
//               <Input label="Property located on Floor Number:" name="propertyFloorNumber" defaultValue="NA" onChange={handleChange} />
//               <Input label="No. of rooms:" name="noOfRooms" defaultValue="GF-2R+1K" onChange={handleChange} />
//               <Input label="Applicable area as per measurement:" name="applicableArea" defaultValue="900" onChange={handleChange} />
//               <Input label="Quality of construction:" name="qualityOfConstruction" defaultValue="GOOD" onChange={handleChange} />
//               <Input label="Exteriors:" name="exteriors" defaultValue="GOOD" onChange={handleChange} />
//               <Input label="Interiors:" name="interiors" defaultValue="GOOD" onChange={handleChange} />
//               <Input label="Age of the property:" name="ageOfProperty" defaultValue="14" onChange={handleChange} />
//               <Input label="Residual life:" name="residualLife" defaultValue="36" onChange={handleChange} />
//             </div>
//             <div className="mt-4">
//               <Input label="Remarks on view from property:" name="remarksOnView" defaultValue="Internal Road" onChange={handleChange} fullWidth />
//             </div>
//           </section>

//           <section className="mb-6">
//             <h5 className="text-md font-semibold mb-4">Sanction Plan Approval & Other Documents Details</h5>
//             <div className="grid md:grid-cols-3 gap-4">
//               <Input label="Sanctioned plans verified with approval no:" name="sanctionedPlans" defaultValue="NOT PROVIDED" onChange={handleChange} />
//               <Input label="Ownership type:" name="ownershipType" defaultValue="Freehold" onChange={handleChange} />
//               <Input label="Property documents verified:" name="propertyDocumentsVerified" defaultValue="YES" onChange={handleChange} />
//               <Input label="Is the property within Municipal Limits:" name="propertyWithinMunicipalLimits" defaultValue="NO (G.P)" onChange={handleChange} />
//               <Input label="Permissible usage allow as per master plan:" name="permissibleUsage" defaultValue="NA" onChange={handleChange} />
//               <Input label="Whether property under demolition list:" name="propertyUnderDemolition" defaultValue="Not to our knowledge" onChange={handleChange} />
//             </div>
//           </section>

//           <section>
//             <h5 className="text-md font-semibold mb-4">Floor Wise Area (in Sqft.)</h5>
//             <div className="grid md:grid-cols-3 gap-4">
//               <Input label="Basement Floor:" name="basementFloor" defaultValue="0" onChange={handleChange} />
//               <Input label="First Floor:" name="firstFloor" defaultValue="0" onChange={handleChange} />
//               <Input label="Second Floor:" name="secondFloor" defaultValue="0" onChange={handleChange} />
//               <Input label="Third Floor:" name="thirdFloor" defaultValue="0" onChange={handleChange} />
//               <Input label="Fourth Floor:" name="fourthFloor" defaultValue="0" onChange={handleChange} />
//               <Input label="Ground Floor:" name="groundFloor" defaultValue="0" onChange={handleChange} />
//               <Input label="Sanctioned/ Permissible/ area:" name="sanctionedPermissibleArea" onChange={handleChange} />
//               <Input label="Total Constructed in Sqft:" name="totalConstructed" onChange={handleChange} />
//               <Input label="Deviation:" name="deviation" onChange={handleChange} />
//             </div>
//           </section>
//         </div>
//       )}
//     </div>
//   );
// };

// const Input = ({ label, name, defaultValue, onChange, fullWidth = false }) => (
//   <div className={fullWidth ? 'col-span-3' : ''}>
//     <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//     <input
//       type="text"
//       name={name}
//       defaultValue={defaultValue}
//       onChange={onChange}
//       className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//     />
//   </div>
// );

// export default PropertyDetails;



import React, { useState, useEffect } from 'react';

const PropertyDetails = ({ extractedData, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    vacantOccupied: 'Occupied',
    nameOfOccupant: 'SELF',
    relationWithApplicant: 'SELF',
    propertyDemarcation: 'YES',
    propertyIdentified: 'YES',
    propertyIdentifiedThrough: 'CUSTOMER AND FOUR SIDE BOUNDARY',
    typeOfStructure: 'RCC',
    landPlotArea: '900',
    noOfBlocks: 'Na',
    noOfUnitsOnFloor: 'Na',
    noOfFloors: 'GROUND FLOOR+FF U/C',
    noOfLifts: 'NA',
    amenitiesAvailable: 'Na',
    deliveryAgency: 'Internal Road',
    propertyFloorNumber: 'NA',
    noOfRooms: 'GF-2R+1K',
    applicableArea: '900',
    qualityOfConstruction: 'GOOD',
    exteriors: 'GOOD',
    interiors: 'GOOD',
    ageOfProperty: '14',
    residualLife: '36',
    remarksOnView: 'Internal Road',
    sanctionedPlans: 'NOT PROVIDED',
    ownershipType: 'Freehold',
    propertyDocumentsVerified: 'YES',
    propertyWithinMunicipalLimits: 'NO (G.P)',
    permissibleUsage: 'NA',
    propertyUnderDemolition: 'Not to our knowledge',
    basementFloor: '0',
    firstFloor: '0',
    secondFloor: '0',
    thirdFloor: '0',
    fourthFloor: '0',
    groundFloor: '0',
    sanctionedPermissibleArea: '',
    totalConstructed: '',
    deviation: '',
  });

  React.useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const accom = p.accommodation_details || {};
      const propDet = p.property_details || {};
      const val = p.valuation_details || {};

      setFormData((prev) => ({
        ...prev,
        vacantOccupied: propDet.occupancy || extractedData.vacantOccupied || prev.vacantOccupied,
        nameOfOccupant: p.occupant_name || p.owner_name || extractedData.nameOfOccupant || prev.nameOfOccupant,
        relationWithApplicant: p.relationship_with_applicant || extractedData.relationWithApplicant || prev.relationWithApplicant,
        propertyDemarcation: propDet.property_demarcated || extractedData.propertyDemarcation || prev.propertyDemarcation,
        propertyIdentified: propDet.property_identification || extractedData.propertyIdentified || prev.propertyIdentified,
        propertyIdentifiedThrough: propDet.property_identification_through || extractedData.propertyIdentifiedThrough || prev.propertyIdentifiedThrough,
        typeOfStructure: accom.type_of_structure || extractedData.typeOfStructure || prev.typeOfStructure,
        landPlotArea: val.plot_area_physical || extractedData.landPlotArea || prev.landPlotArea,
        noOfUnitsOnFloor: propDet.no_of_units_on_each_floor || extractedData.noOfUnitsOnFloor || prev.noOfUnitsOnFloor,
        noOfFloors: propDet.no_of_floors_actual || extractedData.noOfFloors || prev.noOfFloors,
        noOfLifts: accom.lift_facility || extractedData.noOfLifts || prev.noOfLifts,
        amenitiesAvailable: accom.amenities || extractedData.amenitiesAvailable || prev.amenitiesAvailable,
        noOfRooms: accom.rooms_count || accom.flat_configuration || extractedData.noOfRooms || prev.noOfRooms,
        qualityOfConstruction: accom.quality_of_construction || extractedData.qualityOfConstruction || prev.qualityOfConstruction,
        exteriors: accom.exterior || extractedData.exteriors || prev.exteriors,
        interiors: accom.interior || extractedData.interiors || prev.interiors,
        ageOfProperty: accom.age_of_property || propDet.age_of_property || extractedData.ageOfProperty || prev.ageOfProperty,
        residualLife: accom.residual_age || propDet.residual_age || extractedData.residualLife || prev.residualLife,
        sanctionedPlans: p.approved_plan_details || extractedData.sanctionedPlans || prev.sanctionedPlans,
        ownershipType: accom.property_holding || extractedData.ownershipType || prev.ownershipType,
        propertyWithinMunicipalLimits: propDet.property_within_limit || extractedData.propertyWithinMunicipalLimits || prev.propertyWithinMunicipalLimits,
        sanctionedPermissibleArea: val.plot_area_plan || extractedData.sanctionedPermissibleArea || prev.sanctionedPermissibleArea,
        totalConstructed: val.total_built_up_area || extractedData.totalConstructed || prev.totalConstructed,
      }));
    }
  }, [extractedData]);

  const handleChange = (e) => {

    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
}
    const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div className="mb-6 border border-gray-300 rounded-lg">
      <div
        className="p-4 bg-gray-800 text-white flex justify-between items-center cursor-pointer rounded-t-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-lg font-semibold">PROPERTY DETAILS</h4>
        <button
          type="button"
          className="bg-white text-black px-3 py-1 rounded text-sm hover:bg-gray-200"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? "Close" : "Edit"}
        </button>
        
      </div>
      

      {isOpen && (
        <div className="p-6 bg-gray-100 rounded-b-lg">
          {/* Sections follow the same structure as before but use value and onChange */}
          <Section title="Occupant">
            <Input label="Vacant/Occupied:" name="vacantOccupied" value={formData.vacantOccupied} onChange={handleChange} />
            <Input label="Name of Occupant:" name="nameOfOccupant" value={formData.nameOfOccupant} onChange={handleChange} />
            <Input label="Relation with applicant:" name="relationWithApplicant" value={formData.relationWithApplicant} onChange={handleChange} />
          </Section>

          <Section>
            <Input label="Property Demarcation (Yes/No):" name="propertyDemarcation" value={formData.propertyDemarcation} onChange={handleChange} />
            <Input label="Property Identified (Yes/No):" name="propertyIdentified" value={formData.propertyIdentified} onChange={handleChange} />
            <Input label="Property Identified through:" name="propertyIdentifiedThrough" value={formData.propertyIdentifiedThrough} onChange={handleChange} />
          </Section>

          <Section title="Building details">
            <Input label="Type of structure:" name="typeOfStructure" value={formData.typeOfStructure} onChange={handleChange} />
            <Input label="Land/Plot Area:" name="landPlotArea" value={formData.landPlotArea} onChange={handleChange} />
            <Input label="No of Blocks if applicable:" name="noOfBlocks" value={formData.noOfBlocks} onChange={handleChange} />
            <Input label="No of Units on floor:" name="noOfUnitsOnFloor" value={formData.noOfUnitsOnFloor} onChange={handleChange} />
            <Input label="No. of Floors:" name="noOfFloors" value={formData.noOfFloors} onChange={handleChange} />
            <Input label="No. of Lifts:" name="noOfLifts" value={formData.noOfLifts} onChange={handleChange} />
            <Input label="Amenities Available:" name="amenitiesAvailable" value={formData.amenitiesAvailable} onChange={handleChange} />
            <Input label="Delivery Agency:" name="deliveryAgency" value={formData.deliveryAgency} onChange={handleChange} />
          </Section>

          <Section title="Unit details">
            <Input label="Property located on Floor Number:" name="propertyFloorNumber" value={formData.propertyFloorNumber} onChange={handleChange} />
            <Input label="No. of rooms:" name="noOfRooms" value={formData.noOfRooms} onChange={handleChange} />
            <Input label="Applicable area as per measurement:" name="applicableArea" value={formData.applicableArea} onChange={handleChange} />
            <Input label="Quality of construction:" name="qualityOfConstruction" value={formData.qualityOfConstruction} onChange={handleChange} />
            <Input label="Exteriors:" name="exteriors" value={formData.exteriors} onChange={handleChange} />
            <Input label="Interiors:" name="interiors" value={formData.interiors} onChange={handleChange} />
            <Input label="Age of the property:" name="ageOfProperty" value={formData.ageOfProperty} onChange={handleChange} />
            <Input label="Residual life:" name="residualLife" value={formData.residualLife} onChange={handleChange} />
            <Input label="Remarks on view from property:" name="remarksOnView" value={formData.remarksOnView} onChange={handleChange} fullWidth />
          </Section>

          <Section title="Sanction Plan Approval & Other Documents">
            <Input label="Sanctioned plans verified with approval no:" name="sanctionedPlans" value={formData.sanctionedPlans} onChange={handleChange} />
            <Input label="Ownership type:" name="ownershipType" value={formData.ownershipType} onChange={handleChange} />
            <Input label="Property documents verified:" name="propertyDocumentsVerified" value={formData.propertyDocumentsVerified} onChange={handleChange} />
            <Input label="Is the property within Municipal Limits:" name="propertyWithinMunicipalLimits" value={formData.propertyWithinMunicipalLimits} onChange={handleChange} />
            <Input label="Permissible usage:" name="permissibleUsage" value={formData.permissibleUsage} onChange={handleChange} />
            <Input label="Whether property under demolition list:" name="propertyUnderDemolition" value={formData.propertyUnderDemolition} onChange={handleChange} />
          </Section>

          <Section title="Floor Wise Area (in Sqft.)">
            <Input label="Basement Floor:" name="basementFloor" value={formData.basementFloor} onChange={handleChange} />
            <Input label="First Floor:" name="firstFloor" value={formData.firstFloor} onChange={handleChange} />
            <Input label="Second Floor:" name="secondFloor" value={formData.secondFloor} onChange={handleChange} />
            <Input label="Third Floor:" name="thirdFloor" value={formData.thirdFloor} onChange={handleChange} />
            <Input label="Fourth Floor:" name="fourthFloor" value={formData.fourthFloor} onChange={handleChange} />
            <Input label="Ground Floor:" name="groundFloor" value={formData.groundFloor} onChange={handleChange} />
            <Input label="Sanctioned/Permissible area:" name="sanctionedPermissibleArea" value={formData.sanctionedPermissibleArea} onChange={handleChange} />
            <Input label="Total Constructed in Sqft:" name="totalConstructed" value={formData.totalConstructed} onChange={handleChange} />
            <Input label="Deviation:" name="deviation" value={formData.deviation} onChange={handleChange} />
          </Section>
        </div>
      )}
      <div>
         <button
            type="submit"
            className="px-6 py-2 bg-gray-800 text-white font-medium rounded-md"
         onClick={handleSubmit} >
            Next
          </button>
      </div>
    </div>
    
  );
};

const Input = ({ label, name, value, onChange, fullWidth = false }) => (
  <div className={fullWidth ? 'col-span-3' : ''}>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
  
  
);

const Section = ({ title, children }) => (
  <section className="mb-6">
    {title && <h5 className="text-md font-semibold mb-4">{title}</h5>}
    <div className="grid md:grid-cols-3 gap-4">{children}</div>
  </section>



);

export default PropertyDetails;
