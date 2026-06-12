import React, { useState, useEffect } from "react";
import { Input, Checkbox, Radio, Button, Card } from "antd";
import { ChevronDown, ChevronUp } from "lucide-react";

const SurroundingAmenitiesForm = ({ onNext, isEdit }) => {
  const [formData, setFormData] = useState({
    airport: false,
    busStop: false,
    metroStation: false,
    railwayStation: false,
    rickshawStop: false,
    college: false,
    hospital: false,
    mail: false,
    placeOfWorship: false,
    school: false,
    superMarket: false,
    infraSurroundings: "",
    accessRoad: "",
    other: "",
    amenitiesImage: null,
  });

  useEffect(() => {
    if (isEdit) {
      setFormData(isEdit);
    }
  }, [isEdit]);

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked || e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, amenitiesImage: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData); // Pass the data to the parent component's onNext function
  };

  return (
    <div className="w-full p-4">
      {/* Toggle Header */}
      <div
        className="flex items-center justify-between bg-red-800 text-white p-4 rounded-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-semibold">Surrounding Amenities</h2>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </div>

      {/* Collapsible Form */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <Card
            title="Public Transport in 1Km Vicinity"
            className="w-full lg:w-[48%]"
          >
            <div className="flex flex-wrap gap-4">
              {[
                "airport",
                "busStop",
                "metroStation",
                "railwayStation",
                "rickshawStop",
              ].map((item, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <Checkbox
                    name={item}
                    checked={formData[item]}
                    onChange={handleChange}
                  />
                  <span className="capitalize">
                    {item.replace(/([A-Z])/g, " $1")}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="Other Amenities in 1Km Vicinity"
            className="w-full lg:w-[48%]"
          >
            <div className="flex flex-wrap gap-4">
              {[
                "college",
                "hospital",
                "superMarket",
                "mail",
                "placeOfWorship",
                "school",
              ].map((item, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <Checkbox
                    name={item}
                    checked={formData[item]}
                    onChange={handleChange}
                  />
                  <span className="capitalize">
                    {item.replace(/([A-Z])/g, " $1")}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Infra Surroundings" className="w-full lg:w-[48%]">
            <Radio.Group
              onChange={handleChange}
              value={formData.infraSurroundings}
              name="infraSurroundings"
            >
              {["Developed", "Developing", "Under Developed"].map(
                (option, index) => (
                  <div className="mb-2" key={index}>
                    <Radio value={option}>{option}</Radio>
                  </div>
                )
              )}
            </Radio.Group>
          </Card>

          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-1/2">
              <label className="font-medium">Width of Access Road(s):</label>
              <Input
                name="accessRoad"
                value={formData.accessRoad}
                onChange={handleChange}
                className="border-0 border-b w-full"
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="font-medium">Any Other?</label>
              <Input
                name="other"
                value={formData.other}
                onChange={handleChange}
                className="border-0 border-b w-full"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="font-medium">Upload Amenities Image:</label>
            <Input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full"
            />
            <small className="text-gray-500">JPEG, JPG, PNG (Max 500 KB)</small>
          </div>

          <div className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-red-800 hover:bg-red-700"
            >
              Save & Next
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SurroundingAmenitiesForm;
