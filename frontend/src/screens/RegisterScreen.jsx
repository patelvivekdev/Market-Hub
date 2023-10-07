import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import axios from 'axios';
import { toast } from 'react-toastify';


const RegisterScreen = () => {
  // access the params passed in the url
  const { userType } = useParams();

  // check for userType ( Client, Vendor, Admin) are valid
  if (!['Client', 'Vendor', 'Admin'].includes(userType)) {
    window.location.href = '/login';
  }

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // User Profile details
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  // Vendor Profile details
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');


  // for isLoading state
  const [isLoading, setIsLoading] = useState(false);

  // for isError state
  const [isError, setIsError] = useState(false);

  // create helper method to show toast

  // set toast id
  const customId = "custom-id-yes";

  const showToast = (message) => {
    toast.error(message, {
      toastId: customId,
      autoClose: false,
      onOpen: () => {
        setIsError(true);
        setIsLoading(true);
      },
      onClose: clearLoadingState
    });
  }


  const submitHandler = async (e) => {
    // setIsLoading(true);
    e.preventDefault();
    // Check user input
    if (!username || !email || !password || !confirmPassword) {
      showToast('Please fill in all fields');
      return
    }

    // check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address');
      return
    }

    // check if email already exists
    try {
      const BASE_URL = 'https://market-hub.onrender.com/';
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        BASE_URL + '/users/check',
        { email },
        config
      );
    } catch (err) {
      // if email already exists
      if (err?.response?.status === 400) {
        showToast('Email already exists');
        return
      }
      // do nothing
    }

    // check password regex (at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number)
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
    if (!passwordRegex.test(password)) {
      showToast('Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number');
      return
    }

    // check if passwords match
    if (password !== confirmPassword) {
      showToast('Passwords do not match');
      return
    }

    if (!isError) {
      try {
        const BASE_URL = 'http://localhost:5000/api/v1';
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };

        const { data } = await axios.post(
          BASE_URL + '/users',
          {
            username, email, password, userType, profile: {
              name,
              address,
              phone,
            }
          },
          config
        );
        if (data) {
          setIsLoading(false);
          localStorage.setItem('userInfo', JSON.stringify(data));
          toast.success('User Registration successful', {
            onClose: () => {
              if (data.userType === 'Client') {
                window.location.href = '/Client';
              } else {
                window.location.href = '/Vendor';
              }
            }
          });
        }
        // window.location.href = '/login';
      } catch (err) {
        toast.error(err?.data?.message || err.error || 'Something went wrong while registering user');
      }
      finally {
        setIsLoading(false);
      }
    }
  };

  // When user click cancel button on toast message clear the loading state
  const clearLoadingState = () => {
    setIsError(false);
    setIsLoading(false);
  }

  return (
    <FormContainer>
      <h1>Register New {userType}</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='name'
            placeholder='Enter username'
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={
              (e) => setEmail(e.target.value)
            }
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby="passwordHelpBlock"
          ></Form.Control>
          <Form.Text id="passwordHelpBlock" muted>
            Your password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.
          </Form.Text>
        </Form.Group>
        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        {/* Based on userType different form should be shown */}
        {
          /* 
              userType: Client
              Client details: clientName, phone, address
           */
        }
        {userType === 'Client' && (
          <>
            <Form.Group className='my-2' controlId='name'>
              <Form.Label>{userType} Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className='my-2' controlId='address'>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type='address'
                placeholder='Enter address'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className='my-2' controlId='phone'>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type='phone'
                placeholder='Enter phone'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </>
        )}
        {
          /* 
              userType: Vendor
              Client details: vendorName, phone, address, description, website
           */
        }
        {userType === 'Vendor' && (
          <>
            <Form.Group className='my-2' controlId='name'>
              <Form.Label>{userType} Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className='my-2' controlId='address'>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type='address'
                placeholder='Enter address'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className='my-2' controlId='phone'>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type='number'
                max={10}
                placeholder='Enter phone'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className='my-2' controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='description'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className='my-2' controlId='website'>
              <Form.Label>Website</Form.Label>
              <Form.Control
                type='website'
                placeholder='Enter website'
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </>
        )}

        {/* userType: Admin  only admin can add other admin*/}
        {userType === 'Admin' && (
          <>
            <Form.Group className='my-2' controlId='address'>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type='address'
                placeholder='Enter address'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className='my-2' controlId='phone'>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type='phone'
                placeholder='Enter phone'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </>
        )}


        <Button disabled={isError} type='submit' variant='primary'>
          Register
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className='py-3'>
        <Col>
          Already have an account?{' '}
          <Link to='/login'>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
