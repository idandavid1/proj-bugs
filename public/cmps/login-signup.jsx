import { userService } from "../services/user.service.js"
import { LoginSignUpForm } from "./login-signup-form.jsx"

const { useState } = React

export function LoginSignUp({ onChangeLoginStatus }) {
    const [isSignUp, setIsSignUp] = useState(false)

    function onLogin(credentials) {
        userService.login(credentials)
        .then(onChangeLoginStatus)
        .catch((err) => console.log('err:', err))
    }

    function onSingUp(credentials) {
        userService.signup(credentials)
        .then(onChangeLoginStatus)
        .catch((err) => console.log('err:', err))
    }

    return <div className="login-bug">
            <LoginSignUpForm onLogin={onLogin} onSingUp={onSingUp} isSignUp={isSignUp}/>
            <button onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Already a member? Login' : 'New user? Signup here'}</button>
        </div >
}
