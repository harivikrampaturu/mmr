'use client';
import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Import your Firebase config
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Alert, Row, Col } from 'antd'; // Ant Design components

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // For loading state

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is already logged in, redirect to /admin
        router.push('/admin');
      }
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Successful registration, redirect to login
      router.push('/login');
    } catch (error) {
      setError(error.message);
      setLoading(false); // Stop loading on error
    }
  };

  return (
    <>
      <Row justify='center' align='middle' style={{ minHeight: '100vh' }}>
        <Col xs={22} sm={16} md={12} lg={8}>
          <Form
            layout='vertical'
            onFinish={handleSubmit}
            style={{
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)'
            }}
          >
            <Form.Item
              label='Email'
              name='email'
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email'
              />
            </Form.Item>

            <Form.Item
              label='Password'
              name='password'
              rules={[
                { required: true, message: 'Please input your password!' }
              ]}
            >
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
              />
            </Form.Item>

            {error && (
              <Alert
                message={error}
                type='error'
                showIcon
                style={{ marginBottom: '1rem' }}
              />
            )}

            <Form.Item>
              <Button type='primary' htmlType='submit' loading={loading} block>
                Register
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default Register;
