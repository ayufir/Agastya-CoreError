import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExtendedValuationById } from "../../redux/features/Banks/sundaram/sundaramThunks";
import { useParams } from "react-router-dom";
import { Tabs } from "antd";
import PlanApprovalDetails from "./sundaramHome/PlanApprovalDetails";
import CharacterSticsDetails from "./sundaramHome/CharacterSticsDetails";
import ValuationDetails from "./sundaramHome/ValuationDetails";
import DocumentDetails from "./sundaramHome/DocumentDetails";
import Submission from "./sundaramHome/Submission";

const { TabPane } = Tabs;

const SundaramHomeDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const data = useSelector((state) => state.sundaramBank);

  useEffect(() => {
    if (id) {
      dispatch(fetchExtendedValuationById(id));
    }
  }, [id, dispatch]);

  return (
    <div className='p-6 bg-white rounded-xl shadow-md'>
      <h2 className='text-2xl font-semibold text-center mb-6'>
        Sundaram Home Report
      </h2>
      <Tabs defaultActiveKey='1' tabBarGutter={24} type='line'>
        <TabPane tab='Plan Approval' key='1'>
          <div className='mt-4'>
            <PlanApprovalDetails />
          </div>
        </TabPane>

        <TabPane tab='Characteristics' key='2'>
          <div className='mt-4'>
            <CharacterSticsDetails />
          </div>
        </TabPane>
        <TabPane tab='Valuation' key='3'>
          <div className='mt-4'>
            <ValuationDetails />
          </div>
        </TabPane>
        <TabPane tab='Images' key='4'>
          <div className='mt-4'>
            <DocumentDetails />
          </div>
        </TabPane>
        <TabPane tab='Submission' key='5'>
          <div className='mt-4'>
            <Submission />
          </div>
        </TabPane>

        {/* Add more TabPane blocks here for additional components */}
      </Tabs>
    </div>
  );
};

export default SundaramHomeDetails;
