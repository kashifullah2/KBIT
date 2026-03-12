import React from 'react';
import { Outlet } from 'react-router-dom';

const CVBuilderRoot: React.FC = () => {
  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <Outlet />
    </div>
  );
};

export default CVBuilderRoot;
