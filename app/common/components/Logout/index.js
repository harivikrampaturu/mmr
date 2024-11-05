// components/Logout.js
import { auth } from '@/lib/firebase';
import { Button } from 'antd';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import axiosApi from '@/utils/axios';

const Logout = () => {
  const router = useRouter(); // Use Next.js router for navigation

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Call your logout API to clear the cookie using Axios
      await axiosApi.post('/api/logout');

      // Redirect to login page after successful logout
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Optionally, handle any logout errors here
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default Logout;
