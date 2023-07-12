import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
	const [username, setUsername] = useState(null);

	useEffect(() => {
		fetch("http://localhost:4000/profile", {
			credentials: "include",
		}).then((response) => {
			response.json().then((userInfo) => {
				setUsername(userInfo.username);
			});
		});
	}, []);
	function logout() {
		fetch("http://localhost:4000/logout", {
			credentials: "include",
			method: "POST",
		});
		setUsername(null);
	}
	return (
		<header>
			<Link to='/' className='logo'>
				MyBlog
			</Link>
			{username && (
				<>
					<Link to='/create'>Create New Post</Link>
					<a onClick={logout}>Logout</a>
				</>
			)}
			{!username && (
				<nav>
					<Link to='/login'>Login</Link>
					<Link to='/register'>Register</Link>
				</nav>
			)}
		</header>
	);
};

export default Header;
