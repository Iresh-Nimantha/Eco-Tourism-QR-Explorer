'use client';
import { useEffect, useState } from 'react';

export default function EmailDisplay() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.success) {
          setEmail(data.user.email);
        }
      } catch (err) {
        console.error('Failed to fetch email:', err);
      }
    };

    fetchEmail();
  }, []);

  if (!email) return null;

  return (
    <div>
      Logged in as: <strong>{email}</strong>
    </div>
  );
}
