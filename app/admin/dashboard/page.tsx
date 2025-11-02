'use client';
import { useEffect, useState } from 'react';
import LogoutButton from '@/app/admin/dashboard/LogoutBtn'; 
import EmailDisplay from '@/app/admin/dashboard/Email';

export default function Page() {
 

  return (
    <div className="p-6 space-y-4">
      <div>Hello Admin</div>
      <div>Welcome to the admin dashboard</div>
     
      <LogoutButton />
      <EmailDisplay />
    </div>
  );
}
