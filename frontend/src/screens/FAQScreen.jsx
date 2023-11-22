import React, { useState } from 'react';
import { Form, Accordion, Row, Col } from 'react-bootstrap';

const FAQScreen = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');

	const questionsAnswers = [
		{ question: "How do I place an order?", answer: "You can place an order by adding items to your cart and proceeding to checkout.", category: "Ordering" },
		{ question: "What payment methods are accepted?", answer: "We accept various payment methods including credit cards, Stripe, and others.", category: "Payment" },
		{ question: "How do I track my order?", answer: "You can track your order by logging into your account and viewing your order history.", category: "Ordering" },
		{ question: "How do I cancel an order?", answer: "Currently Only admin can cancel order. Please contact admin with our contact us page", category: "Ordering" },
	];

	const filteredFAQs = questionsAnswers.filter(qa => {
		const matchesSearchTerm = qa.question.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory = selectedCategory === '' || qa.category === selectedCategory;
		return matchesSearchTerm && matchesCategory;
	});

	const categories = [...new Set(questionsAnswers.map(qa => qa.category))];

	return (
		<>
			<h1 className='text-center'>Frequently Asked Questions</h1>
			<Row>
				<Col md={3}>
					<h3>Filter</h3>
					<Form.Group>
						<Form.Control
							as='select'
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
						>
							<option key='All' value=''>Select Category</option>
							{categories.map((category) => (
								<option key={category} value={category}>{category}</option>
							))}
						</Form.Control>
					</Form.Group>
				</Col>

				<Col md={9}>
					<Form.Control
						type="text"
						placeholder="Search FAQs..."
						onChange={(e) => setSearchTerm(e.target.value)}
						className="my-3"
					/>

					<Accordion>
						{filteredFAQs.map((qa, index) => (
							<Accordion.Item key={index} eventKey={index.toString()}>
								<Accordion.Header>
									{qa.question}
								</Accordion.Header>
								<Accordion.Body>
									{qa.answer}
								</Accordion.Body>
							</Accordion.Item>
						))}
					</Accordion>
				</Col>
			</Row>
		</>
	);
};

export default FAQScreen;
