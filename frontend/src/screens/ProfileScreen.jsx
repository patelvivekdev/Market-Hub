import React, { useEffect, useState } from "react";
import { Col, Row, Image } from "react-bootstrap";
import { useSelector } from "react-redux";

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    setName(userInfo.fullName);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.fullName]);

  return (
    <Row>
      <Col md={5} className="mt-4">
        <h2>User Profile</h2>

        <Row className="mb-3">
          <Col md={3} className="fw-bold">Name:</Col>
          <Col md={9}>{name}</Col>
        </Row>

        <Row className="mb-3">
          <Col md={3} className="fw-bold">Email:</Col>
          <Col md={9}>{email}</Col>
        </Row>

        <Row className="mb-3">
          <Col md={3} className="fw-bold">Role:</Col>
          <Col md={9}>{userInfo.userType}</Col>
        </Row>
      </Col>

      {
        userInfo.userType === "Vendor" && (
          <Col md={4} className="mt-4">
            <h2>Vendor Profile</h2>
            <Row className="mb-3">
              <Col md={3} className="fw-bold">Company Address:</Col>
              <Col md={9}>{userInfo.profile?.address}</Col>
            </Row>

            <Row className="mb-3">
              <Col md={3} className="fw-bold">Company Phone:</Col>
              <Col md={9}>{userInfo.profile?.phone}</Col>
            </Row>

            <Row className="mb-3">
              <Col md={3} className="fw-bold">Company website:</Col>
              <Col md={9}>{userInfo.profile?.website}</Col>
            </Row>
          </Col>
        )
      }

      {
        userInfo.userType === "Client" && (
          <Col md={4} className="mt-4">
            <h2>Client Profile</h2>
            <Row className="mb-3">
              <Col md={3} className="fw-bold">Address:</Col>
              <Col md={9}>{userInfo.profile?.address}</Col>
            </Row>

            <Row className="mb-3">
              <Col md={3} className="fw-bold">Phone:</Col>
              <Col md={9}>{userInfo.profile?.phone}</Col>
            </Row>
          </Col>
        )
      }

      <Col md={3} className="text-center mt-4">
        <Image
          src={userInfo.profile?.profilePic}
          alt={userInfo.fullName}
          roundedCircle
          style={{ width: "200px", height: "200px" }}
        />
      </Col>
    </Row>
  );
};

export default ProfileScreen;
