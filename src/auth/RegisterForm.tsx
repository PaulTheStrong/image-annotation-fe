import {useState} from "react";
import {Button, Form} from "react-bootstrap";

function RegisterForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(`Email: ${email}, Password: ${password}`);
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Form onSubmit={handleSubmit} className="p-4 rounded shadow">
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        style={{ borderRadius: "10px" }}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        style={{ borderRadius: "10px" }}
                    />
                </Form.Group>

                <Button variant="success" type="submit" className="mt-3 px-4 py-2">
                    Register
                </Button>
            </Form>
        </div>
    );
}

export default RegisterForm;
