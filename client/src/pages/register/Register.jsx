import React, { useRef, useState } from 'react';
import './register.scss';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';

export const Register = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const history = useHistory();

	const emailRef = useRef();
	const passwordRef = useRef();
	const usernameRef = useRef();

	const handleStart = () => {
		setEmail(emailRef.current.value);
	};
	const handleFinish = async (e) => {
		e.preventDefault();
		setPassword(passwordRef.current.value);
		setUsername(usernameRef.current.value);
		try {
			await axios.post('auth/register', { email, username, password });
			history.push('/login');
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<div className='register'>
			<div className='top'>
				<div className='wrapper'>
					<img
						src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png'
						alt=''
						className='logo'
					/>
					<button className='loginButton'>Sign In</button>
				</div>
			</div>
			<div className='container'>
				<h1>Unlimited movies, TV shows and more.</h1>
				<h2>Watch anytime. Cancel anytime.</h2>
				<p>
					Ready to watch? Enter your email to create or restart your
					membership.
				</p>
				{!email ? (
					<div className='input'>
						<input
							type='email'
							placeholder='email address'
							ref={emailRef}
						/>
						<button
							className='registerButton'
							onClick={handleStart}>
							Get Started
						</button>
					</div>
				) : (
					<form className='input'>
						<input
							type='username'
							placeholder='username'
							ref={usernameRef}
						/>
						<input
							type='password'
							placeholder='password'
							ref={passwordRef}
						/>
						<button
							className='registerButton'
							onClick={handleFinish}>
							Start
						</button>
					</form>
				)}
			</div>
		</div>
	);
};