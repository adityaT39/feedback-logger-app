import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  ListGroup,
  Badge,
  Navbar,
} from 'react-bootstrap';

function App() {
  // --- State ---
  const [feedback, setFeedback] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('General');

  // --- Fetch Feedback from Backend on Mount ---
  useEffect(() => {
    fetch('http://127.0.0.1:5000/get-feedback')
      .then((res) => res.json())
      .then((data) => setFeedback(data))
      .catch((err) => console.error('Error fetching feedback:', err));
  }, []);

  // --- Submit Feedback to Flask Backend ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message) return;

    const newFeedback = {
      name,
      message,
      type,
      date: new Date().toLocaleString(),
    };

    try {
      const res = await fetch('http://127.0.0.1:5000/submit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFeedback),
      });

      const data = await res.json();
      console.log('Server response:', data);

      if (res.ok) {
        setFeedback([newFeedback, ...feedback]);
        setName('');
        setMessage('');
        setType('General');
      } else {
        alert('Failed to submit feedback');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while submitting feedback.');
    }
  };

  // --- Badge Style Logic ---
  const getBadgeVariant = (type) => {
    switch (type) {
      case 'Bug': return 'danger';
      case 'Feature Request': return 'info';
      default: return 'secondary';
    }
  };

  // --- Render ---
  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand>Feedback Logger</Navbar.Brand>
        </Container>
      </Navbar>

      {/* Page Content */}
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            {/* Feedback Form */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title className="mb-3">Submit Your Feedback</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Feedback</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Your thoughts..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="General">General</option>
                      <option value="Bug">Bug</option>
                      <option value="Feature Request">Feature Request</option>
                    </Form.Select>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100">
                    Submit Feedback
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            {/* Feedback Display */}
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>All Feedback</Card.Title>
                {feedback.length === 0 ? (
                  <p className="text-muted mt-2">No feedback yet.</p>
                ) : (
                  <ListGroup variant="flush">
                    {feedback.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{item.name}</strong> — {item.message}
                            <div className="text-muted" style={{ fontSize: '0.8em' }}>
                              {item.date}
                            </div>
                          </div>
                          <Badge bg={getBadgeVariant(item.type)}>{item.type}</Badge>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;