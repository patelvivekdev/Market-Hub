import Loader from "../../components/Loader";
import Message from "../../components/Message";
import React from "react";
import { Button, Table } from "react-bootstrap";
import { FaCheck, FaEdit, FaTimes, FaTrash } from "react-icons/fa";

import {
  useGetUsersQuery,
} from '../../slices/usersApiSlice';

const UserListScreen = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();


  return (
    <>
      <h1>Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                {user.userType === 'Client' ? (
                  <td>{user?.profile?.clientName}</td>
                ) : user.userType === 'Vendor' ? (
                  <td>{user?.profile?.vendorName}</td>
                ) : user.userType === 'Admin' ? (
                  <td>{user?.profile?.adminName}</td>
                ) : null}
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.userType === "Admin" ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {!user.isAdmin && (
                    <>

                      <Button variant='light' className='btn-sm' style={{ marginRight: '10px' }}>
                        <FaEdit />
                      </Button>
                      <Button
                        variant='danger'
                        className='btn-sm'
                      >
                        <FaTrash style={{ color: 'white' }} />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
