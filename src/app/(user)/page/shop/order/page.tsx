"use client";

import ListOrder from '@/components/page/shop/order/listOrder';
import { Col, Row } from 'antd';
import React, { useState } from 'react'

const orderTabs = [
  { key: 'all', label: 'All Order' },
  { key: 'pending', label: 'Pending' },
  { key: 'shipping', label: 'To Ship' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const PageOrder = () => {
  const [orderType, setOrderType] = useState<string>("all");

  return (
    <div className='px-6 py-4 space-y-2 main-layout min-h-screen'>
      <Row className='bg-[#1C1B33] text-white rounded-xl overflow-hidden w-[80vw]'>
        {
          orderTabs.map((tab) => (
            <Col className="gutter-row" span={2} key={tab.key}>
              <div
                className={`text-center py-4 ${orderType === tab.key
                  ? 'bg-[#454B79] cursor-default'
                  : 'hover:bg-[#454B79] cursor-pointer'
                  }`}
                onClick={() => {
                  if (orderType !== tab.key) setOrderType(tab.key);
                }}
              >
                {tab.label}
              </div>
            </Col>
          ))
        }
      </Row>
      <ListOrder orderType={orderType} />
    </div>
  )
}

export default PageOrder