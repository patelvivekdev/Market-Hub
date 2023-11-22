import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { Editor } from '@tinymce/tinymce-react';

const ContactUsScreen = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		message: '',
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData);
	};

	return (
		<FormContainer>
			<h1>Contact Us</h1>
			<Form onSubmit={handleSubmit}>
				<Form.Group className='my-2' controlId='formName'>
					<Form.Label>Name</Form.Label>
					<Form.Control
						type='text'
						name='name'
						value={formData.name}
						onChange={handleChange}
						placeholder='Your Name'
						required
					/>
				</Form.Group>

				<Form.Group className='my-2' controlId='formEmail'>
					<Form.Label>Email</Form.Label>
					<Form.Control
						type='email'
						name='email'
						value={formData.email}
						onChange={handleChange}
						placeholder='Your Email'
						required
					/>
				</Form.Group>

				<Form.Group className='my-2' controlId='formMessage'>
					<Form.Label>Message</Form.Label>
					<Editor
						name='message'
						apiKey='2k8tgskw5zt09s14emwqguv4u825fdflceueh1v9id1r1ytv'
						value={formData.message}
						onEditorChange={(value) => setFormData({ ...formData, message: value })}
						init={{
							height: 300,
							menubar: false,
							plugins: [
								'advlist autolink lists link image charmap print preview anchor',
								'searchreplace visualblocks code fullscreen',
								'insertdatetime media table paste code help wordcount',
							],
							toolbar:
								`undo redo | formatselect | bold italic backcolor | 
								alignleft aligncenter alignright alignjustify | 
								bullist numlist outdent indent | removeformat | help`,
							content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
						}}
					/>
				</Form.Group>

				<Button variant='primary' type='submit'>
					Send Message
				</Button>
			</Form>
		</FormContainer>
	);
};

export default ContactUsScreen;
