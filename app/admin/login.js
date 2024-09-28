import { useState } from 'react';
import { useRouter } from 'next/router';
import { Input, Button, message } from 'antd';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      localStorage.setItem('loggedIn', 'true');
      router.push('/admin');
    } else {
      message.error('Invalid username or password');
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-80'>
        <h2 className='text-xl font-bold mb-4'>Login</h2>
        <Input
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='mb-4'
        />
        <Input.Password
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='mb-4'
        />
        <Button type='primary' onClick={handleLogin} block>
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
