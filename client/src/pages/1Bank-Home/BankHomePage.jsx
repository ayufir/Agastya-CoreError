import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "antd";
import { setSavedCity } from "../../redux/features/assignedCase/assignedCasesSlice";
import { banks } from "./banks";
import toast from "react-hot-toast";

const { Option } = Select;

const BankHomePage = () => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const savedCity = useSelector((state) => state.assignedCases.savedCity);

  useEffect(() => {
    if (user?.role?.toLowerCase() === "fieldofficer") {
      toast.error("You do not have permission to access this page");
      navigate("/field/dashboard");
    }
  }, [user, navigate]);

  const isBJGUser =
    ["Bhopal", "Gwalior", "Jabalpur", "Combined BJG"].includes(user?.assignedCity) &&
    !["SuperAdmin", "Admin"].includes(user?.role);

  useEffect(() => {
    dispatch(setSavedCity(""));
  }, [dispatch]);

  banks.sort((a, b) => a.name.localeCompare(b.name));

  const filteredBanks = useMemo(() => {
    return banks.filter((bank) =>
      bank.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleBankClick = (e) => {
    if (isBJGUser && !savedCity) {
      e.preventDefault();
      toast.error("Please select a city first before creating a case!");
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-10 px-4'>
      {isBJGUser && (
        <div className='max-w-md mx-auto mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center gap-2'>
          <label className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
            Select City for Bank Case Creation
          </label>
          <Select
            value={savedCity || undefined}
            onChange={(val) => dispatch(setSavedCity(val))}
            placeholder="Select City"
            className='w-full'
            size='large'
            allowClear
          >
            <Option value="Bhopal">Bhopal</Option>
            <Option value="Jabalpur">Jabalpur</Option>
            <Option value="Gwalior">Gwalior</Option>
          </Select>
        </div>
      )}

      <div className='max-w-md mx-auto mb-8'>
        <input
          type='text'
          placeholder='Search your bank...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center'>
        {filteredBanks.length > 0 ? (
          filteredBanks.map((bank, index) => (
            <Link
              to={`/bank/${bank.name.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={handleBankClick}
              key={index}
              className='bg-white flex flex-col items-center w-32 sm:w-36 md:w-40 p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out'
            >
              <img
                src={`assets/images/banks-img/${bank.logo}`}
                alt={bank.name}
                className='w-16 h-16 object-contain'
              />
              <p className='mt-3 text-sm font-medium text-gray-700 text-center'>
                {bank.name}
              </p>
            </Link>
          ))
        ) : (
          <p className='text-gray-500 col-span-full'>No banks found.</p>
        )}
      </div>
    </div>
  );
};

export default BankHomePage;
