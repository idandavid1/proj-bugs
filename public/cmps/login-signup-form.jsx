import { userService } from "../services/user.service.js"
const { useState } = React

export function LoginSignUpForm({ onLogin, onSingUp, isSignUp }) {
    const [credentials, setCredentials] = useState(userService.getEmptyCredentials())

    function handleChange({ target }) {
        const { name: field, value } = target
        setCredentials(prevCreds => ({ ...prevCreds, [field]: value }))
    }

    function handleSubmit(ev) {
        ev.preventDefault()
        isSignUp ? onSingUp(credentials) : onLogin(credentials)
    }

    return <form className="login-signUp-form" onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                value={credentials.username}
                placeholder="Username"
                onChange={handleChange}
                required
                autoFocus
            />
            <input
                type="password"
                name="password"
                value={credentials.password}
                placeholder="Password"
                onChange={handleChange}
                required
            />
            {isSignUp && <input
                type="text"
                name="fullname"
                value={credentials.fullname}
                placeholder="Fullname"
                onChange={handleChange}
                required
            />}
            <button>{isSignUp ? 'SignUp' : 'Login'}</button>
        </form>
}