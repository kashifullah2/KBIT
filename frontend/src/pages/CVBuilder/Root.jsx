import React from 'react';
import { Outlet } from 'react-router-dom';

const CVBuilderRoot = () => {
  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <Outlet />
    </div>
  );
};

export default CVBuilderRoot;
