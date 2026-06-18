import React, { createContext, useContext, useState, ReactNode } from 'react';

const DataContext = createContext(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [agencies, setAgencies] = useState([
    {
      id: '2',
      name: 'Metro Bus Agency',
      email: 'agency@demo.com',
      phone: '+1234567890',
      address: '123 Transport St, City',
      approved: true,
      totalBuses: 15,
    },
    {
      id: '4',
      name: 'City Express',
      email: 'cityexpress@demo.com',
      phone: '+1234567891',
      address: '456 Express Ave, City',
      approved: false,
      totalBuses: 8,
    },
  ]);

  const [buses, setBuses] = useState([
    { id: 'bus1', agencyId: '2', busNumber: 'MB001', capacity: 45, type: 'AC' },
    { id: 'bus2', agencyId: '2', busNumber: 'MB002', capacity: 50, type: 'Sleeper' },
    { id: 'bus3', agencyId: '2', busNumber: 'MB003', capacity: 40, type: 'Non-AC' },
  ]);

  const [routes, setRoutes] = useState([
    {
      id: 'route1',
      agencyId: '2',
      agencyName: 'Metro Bus Agency',
      from: 'New York',
      to: 'Boston',
      departureTime: '08:00',
      arrivalTime: '12:00',
      price: 45,
      busId: 'bus1',
      availableSeats: 35,
      expiryDate: '2025-02-28',
      status: 'active',
    },
    {
      id: 'route2',
      agencyId: '2',
      agencyName: 'Metro Bus Agency',
      from: 'New York',
      to: 'Philadelphia',
      departureTime: '14:30',
      arrivalTime: '16:30',
      price: 25,
      busId: 'bus2',
      availableSeats: 42,
      expiryDate: '2025-03-15',
      status: 'active',
    },
    {
      id: 'route3',
      agencyId: '2',
      agencyName: 'Metro Bus Agency',
      from: 'Boston',
      to: 'Washington DC',
      departureTime: '10:00',
      arrivalTime: '18:00',
      price: 65,
      busId: 'bus3',
      availableSeats: 28,
      expiryDate: '2025-01-20',
      status: 'expired',
    },
  ]);

  const [bookings, setBookings] = useState([]);

  const approveAgency = (agencyId) => {
    setAgencies(prev => prev.map(agency => 
      agency.id === agencyId ? { ...agency, approved: true } : agency
    ));
  };

  const addRoute = (route) => {
    const newRoute = {
      ...route,
      id: `route${Date.now()}`,
    };
    setRoutes(prev => [...prev, newRoute]);
  };

  const addBus = (bus) => {
    const newBus = {
      ...bus,
      id: `bus${Date.now()}`,
    };
    setBuses(prev => [...prev, newBus]);
  };

  const bookTicket = (booking) => {
    const newBooking = {
      ...booking,
      id: `booking${Date.now()}`,
    };
    setBookings(prev => [...prev, newBooking]);
    
    // Update available seats
    setRoutes(prev => prev.map(route => 
      route.id === booking.routeId 
        ? { ...route, availableSeats: route.availableSeats - 1 }
        : route
    ));
  };

  const updateRoute = (routeId, updates) => {
    setRoutes(prev => prev.map(route => 
      route.id === routeId ? { ...route, ...updates } : route
    ));
  };

  return (
    <DataContext.Provider value={{
      agencies,
      routes,
      buses,
      bookings,
      approveAgency,
      addRoute,
      addBus,
      bookTicket,
      updateRoute,
    }}>
      {children}
    </DataContext.Provider>
  );
};