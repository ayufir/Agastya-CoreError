import React, { useState } from "react";
import { Form, Button, Card, Col, Row } from "react-bootstrap";

const PostmortemObservation = ({ onDataChange }) => {
  const [formData, setFormData] = useState({
    observation1: "",
    observation2: "",
    observation3: "",
    observation4: "",
    observation5: "",
    observation6: "",
    observation7: "",
    observation8: "",
    observation9: "",
    observation10: "",
    observation11: "",
    observation12: "",
    observation13: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onDataChange(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Card>
        <Card.Body>
          <Row className='mb-3'>
            <Col md={12}>
              <Form.Group controlId='observation1'>
                <Form.Label>Observation and Remarks</Form.Label>
                <textarea
                  name='observation1'
                  value={formData.observation1}
                  onChange={handleChange}
                  className='form-control'
                  rows='3'
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className='mb-3'>
            <Col md={6}>
              <Form.Group controlId='observation2'>
                <Form.Label>1.</Form.Label>
                <textarea
                  name='observation2'
                  value={formData.observation2}
                  onChange={handleChange}
                  className='form-control'
                  rows='3'
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId='observation3'>
                <Form.Label>2.</Form.Label>
                <textarea
                  name='observation3'
                  value={formData.observation3}
                  onChange={handleChange}
                  className='form-control'
                  rows='3'
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className='mb-3'>
            <Col md={6}>
              <Form.Group controlId='observation4'>
                <Form.Label>3.</Form.Label>
                <textarea
                  name='observation4'
                  value={formData.observation4}
                  onChange={handleChange}
                  className='form-control'
                  rows='3'
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId='observation5'>
                <Form.Label>4.</Form.Label>
                <textarea
                  name='observation5'
                  value={formData.observation5}
                  onChange={handleChange}
                  className='form-control'
                  rows='3'
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className='mb-3'>
            <Col md={6}>
              <Form.Group controlId='observation6'>
                <Form.Label>5.</Form.Label>
                <textarea
                  name='observation6'
                  value={formData.observation6}
                  onChange={handleChange}
                  className='form-control'
                  rows='3'
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId='observation7'>
                <Form.Label>6.</Form.Label>
                <textarea
                  name='observation7'
                  value={formData.observation7}
                  onChange={handleChange}
                  className='form-control'
                  rows='3'
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className='mb-3'>
            <Col md={6}>
              <Form.Group controlId='observation8'>
                <Form.Label>7.</Form.Label>
                <textarea
                  name='observation8'
                  value={formData.observation8}
                  onChange={handleChange}
                  className='form-control'
                  rows='3'
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId='observation9'>
                <Form.Label>8.</Form.Label>
                <textarea
                  name='observation9'
                  value={formData.observation9}
                  onChange={handleChange}
                  className='form-control'
                  rows='3'
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className='mb-3'>
            <Col md={6}>
              <Form.Group controlId='observation10'>
                <Form.Label>9.</Form.Label>
                <textarea
                  name='observation10'
                  value={formData.observation10}
                  onChange={handleChange}
                  className='form-control'
                  rows='3'
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId='observation11'>
                <Form.Label>10.</Form.Label>
                <textarea
                  name='observation11'
                  value={formData.observation11}
                  onChange={handleChange}
                  className='form-control'
                  rows='3'
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className='mb-3'>
            <Col md={6}>
              <Form.Group controlId='observation12'>
                <Form.Label>11.</Form.Label>
                <textarea
                  name='observation12'
                  value={formData.observation12}
                  onChange={handleChange}
                  className='form-control'
                  rows='3'
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId='observation13'>
                <Form.Label>12.</Form.Label>
                <textarea
                  name='observation13'
                  value={formData.observation13}
                  onChange={handleChange}
                  className='form-control'
                  rows='3'
                />
              </Form.Group>
            </Col>
          </Row>

          {/* <Button variant="primary" type="submit">
            Submit
          </Button> */}
        </Card.Body>
      </Card>
    </Form>
  );
};

export default PostmortemObservation;
