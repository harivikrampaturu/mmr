import { auth } from '@/lib/firebase';
import { Button } from 'antd';
import { signOut } from 'firebase/auth';

export const Logout = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Handle successful logout (e.g., redirect to login)
    } catch (error) {
      // Handle logout errors (e.g., display error message)
    }
  };
  return <Button onClick={handleLogout}>Logout</Button>;
};
export default Logout;
