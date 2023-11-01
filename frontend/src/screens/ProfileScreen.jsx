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
      <Col md={6} className="mt-4">
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

      <Col md={6} className="text-center mt-4">
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
