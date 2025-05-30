'use client';

import { useState } from 'react';
import { CustomerManagementClient } from './CustomerManagementClient';

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [communications, setCommunications] = useState([]);

    return (
      <CustomerManagementClient
      initialCustomers={customers}
      initialServiceHistory={serviceHistory}
      initialCommunications={communications}
      />
    );
} 