import React from "react";
import { Card, Row, Col } from "react-bootstrap";

const AboutUs = () => {

	const teamMembers = [
		{ name: "Vivek Patel", github: "https://github.com/Vivek-0206k" },
		{ name: "Yatharth Shah", github: "https://github.com/Yatharth2001" },
		{ name: "Krunal Mangukiya", github: "https://github.com/justbekrunal" },
		{ name: "Om Italiya", github: "https://github.com/ompatel474747" },
		{ name: "Sheshankumar Patel", github: "https://github.com/Sheshan-Patel" },
	];

	return (
		<div className="mt-4">

			<p>
				Market Hub - Group 3 <br />
				PROG8750 - Capstone (Web Development) <br />
				23FALL - Section5
			</p>

			<h2>Our AIM</h2>
			<h4>About Market Hub</h4>
			<p>
				In this multi-vendor marketplace, we want to provide one place where multiple vendors can sell their products under one roof. Customers have ample options to buy from. As this can be used in any industry, we use computer parts as an example.
			</p>

			<h4>Goals</h4>
			<ul>
				<li>Our primary goal is to create a web application which bridges the gap between vendors and clients.is easy to use.</li>
				<li>Customers can select products from various vendors, enabling them to find the desired product within their budget.</li>
			</ul>

			<h4>Technology Description</h4>
			<p>
				<strong>Front-end:</strong> React, CSS (React Bootstrap) <br />
				<strong>Back-end:</strong> NodeJS with Express <br />
				<strong>Database:</strong> MongoDB
			</p>

			<h4>GitHub Links</h4>
			<Row>
				{teamMembers.map((member, index) => (
					<Col key={index} md={4} className="mb-4">
						<Card>
							<Card.Body>
								<Card.Title>{member.name}</Card.Title>
								<Card.Text>
									<a href={member.github} target="_blank" rel="noopener noreferrer">
										GitHub
									</a>
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row>
		</div>
	);
};

export default AboutUs;
