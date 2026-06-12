import React, { useState } from 'react';

const SurroundingDetails = ({ extractedData, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "Residential",
    locality: "Low",
    siteDevelopment: "Under Developed",
    proximityToAmenities: "2-5 Km.",
    railwayStation: "10 TO 15 Km.",
    busStop: "3-4 Km.",
    closeVicinity: "NEAR RAM TEMPLE",
    distanceFromCityCenter: "15 Kms",
    roadCondition: "Average",
    physicalApproach: "CLEAR",
    legalApproach: "CLEAR",
    otherFeatures: "No",
  });

  React.useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const loc = p.location_details || {};
      const accom = p.accommodation_details || {};

      setFormData((prev) => ({
        ...prev,
        type: p.property_type || extractedData.type || prev.type,
        locality: loc.type_of_locality || extractedData.locality || prev.locality,
        siteDevelopment: loc.site_development || extractedData.siteDevelopment || prev.siteDevelopment,
        proximityToAmenities: loc.proximity_to_civic_amenities || extractedData.proximityToAmenities || prev.proximityToAmenities,
        railwayStation: loc.railway_station || extractedData.railwayStation || prev.railwayStation,
        busStop: loc.bus_stop || extractedData.busStop || prev.busStop,
        closeVicinity: loc.landmark || extractedData.closeVicinity || prev.closeVicinity,
        distanceFromCityCenter: loc.distance_from_city_center || extractedData.distanceFromCityCenter || prev.distanceFromCityCenter,
        roadCondition: loc.condition_of_approach_road || extractedData.roadCondition || prev.roadCondition,
        physicalApproach: loc.physical_approach || extractedData.physicalApproach || prev.physicalApproach,
        legalApproach: loc.legal_approach || extractedData.legalApproach || prev.legalApproach,
        otherFeatures: p.encumbrance || extractedData.otherFeatures || prev.otherFeatures,
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
        <h4 className="text-lg font-semibold">SURROUNDING & LOCALITY DETAILS</h4>
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
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <Input label="Type:" name="type" value={formData.type} onChange={handleChange} />
            <Input label="Locality:" name="locality" value={formData.locality} onChange={handleChange} />
            <Input label="Site is (Dev, Under Dev):" name="siteDevelopment" value={formData.siteDevelopment} onChange={handleChange} />
            <Input label="Proximity to civic amenities/public transport:" name="proximityToAmenities" value={formData.proximityToAmenities} onChange={handleChange} />
            <Input label="Railway Station:" name="railwayStation" value={formData.railwayStation} onChange={handleChange} />
            <Input label="Bus Stop:" name="busStop" value={formData.busStop} onChange={handleChange} />
            <Input label="Distance from City Center:" name="distanceFromCityCenter" value={formData.distanceFromCityCenter} onChange={handleChange} />
            <Input label="Road Condition & Width:" name="roadCondition" value={formData.roadCondition} onChange={handleChange} />
            <Input label="Physical approach (site visit):" name="physicalApproach" value={formData.physicalApproach} onChange={handleChange} />
            <Input label="Legal approach (documents):" name="legalApproach" value={formData.legalApproach} onChange={handleChange} />
          </div>

          <div className="mb-4">
            <Input
              label="Close Vicinity/Landmark:"
              name="closeVicinity"
              value={formData.closeVicinity}
              onChange={handleChange}
              fullWidth
            />
          </div>

          <div>
            <Input
              label="Any board/notice/mortgage/court order present:"
              name="otherFeatures"
              value={formData.otherFeatures}
              onChange={handleChange}
              fullWidth
            />
          </div>
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
  <div className={fullWidth ? 'col-span-2' : ''}>
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

export default SurroundingDetails;
