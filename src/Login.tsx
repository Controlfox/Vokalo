import {useState} from "react"

const Login = () => {
    const [name, setName] = useState("");

    const handleLogin = () => {
        if(name.trim()) {
            localStorage.setItem("username", name);
            alert("Välkommen " + name);
        }
        else {
            alert("Var god ange ditt namn");
        }
    };

    return (
        <div className="login-container">
            <h2>Logga in</h2>
            <input
                type="text"
                placeholder="Skriv ditt namn"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleLogin}>
                Logga in
            </button>
        </div>
    );
};

export default Login;