import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "antd";
import { setSavedCity } from "../../redux/features/assignedCase/assignedCasesSlice";
import { banks } from "./banks";

const { Option } = Select;

const BankHomePage = () => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const savedCity = useSelector((state) => state.assignedCases.savedCity);

  const isBJGUser =
    ["Bhopal", "Gwalior", "Jabalpur"].includes(user?.assignedCity) &&
    !["SuperAdmin", "Admin"].includes(user?.role);

  useEffect(() => {
    if (isBJGUser && !["Bhopal", "Gwalior", "Jabalpur"].includes(savedCity)) {
      dispatch(setSavedCity(user?.assignedCity || "Bhopal"));
    }
  }, [isBJGUser, savedCity, user, dispatch]);

  banks.sort((a, b) => a.name.localeCompare(b.name));

  const filteredBanks = useMemo(() => {
    return banks.filter((bank) =>
      bank.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className='min-h-screen bg-gray-50 py-10 px-4'>
      {isBJGUser && (
        <div className='max-w-md mx-auto mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center gap-2'>
          <label className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
            Select City for Bank Case Creation
          </label>
          <Select
            value={savedCity || user?.assignedCity || "Bhopal"}
            onChange={(val) => dispatch(setSavedCity(val))}
            className='w-full'
            size='large'
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
