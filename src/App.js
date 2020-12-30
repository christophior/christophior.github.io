import React from 'react';
import { Icon } from 'react-icons-kit';
import { fileO as file } from 'react-icons-kit/fa/fileO';
import { github } from 'react-icons-kit/fa/github';
import { linkedin } from 'react-icons-kit/fa/linkedin';
import { envelope } from 'react-icons-kit/fa/envelope';
import { pencil } from 'react-icons-kit/fa/pencil';

const socials = [
	{
		url: '/resume',
		icon: file,
	},
	{
		url: 'http://github.com/christophior',
		icon: github,
	},
	{
		url: 'https://www.linkedin.com/in/christophior',
		icon: linkedin,
	},
	{
		url: 'mailto:chrisvillarreal1018@gmail.com',
		icon: envelope,
	},
	{
		url: 'http://blog.christophior.com',
		icon: pencil,
	},
];

const projects = [
	{
		title: 'Competitive Call of Duty mobile app',
		image: './assets/cod1.png',
		url: 'https://codcompetitive.christophior.com/',
	},
	{
		title: 'instashare mac app',
		image: './assets/instashare.png',
		url: 'http://instashare.christophior.com/',
	},
	{
		title: 'Score! Soccer mac app',
		image: './assets/score.png',
		url: 'https://gum.co/scoremacapp',
	},
	{
		title: 'XRP price tracker cli',
		image: './assets/xrp.png',
		url: '/xrpcli',
	},
];

const App = () => {
	return (
		<>
			<section className="sticky-top sticky-wrapper">
				<nav className="navbar navbar-expand-md navbar-dark fixed-top sticky-navigation">
					<button
						className="navbar-toggler navbar-toggler-right border-0 toggler"
						type="button"
						data-toggle="collapse"
						data-target="#navbarCollapse"
						aria-controls="navbarCollapse"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span data-feather="menu"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarCollapse">
						<ul className="navbar-nav ml-auto">
							{[
								{ name: 'Resume', url: '/resume' },
								{ name: 'Portfolio', url: '#work' },
								{ name: 'Contact', url: '#contact' },
							].map((link) => (
								<li className="nav-item">
									<a
										className="nav-link page-scroll"
										href={link.url}
									>
										{link.name}
									</a>
								</li>
							))}
						</ul>
					</div>
				</nav>
			</section>

			<section id="home">
				<div className="container">
					<div className="row vh-100">
						<div className="col-md-8 mx-auto my-auto text-center">
							<div className="avatar"></div>
							<h1 className="display-4 mb-5 text-white">
								Hi. I'm Chris Villarreal, a Software Engineer from
								Austin, Texas!
							</h1>
							<ul className="icons">
								{socials.map((s) => (
									<li>
										<a
											href={s.url}
											target="_blank"
											rel="noreferrer"
										>
											<Icon
												className="icons"
												icon={s.icon}
												size={24}
											/>
										</a>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</section>

			<section className="py-6" id="work">
				<div className="container">
					<div className="row">
						<div className="col-md-10 mx-auto">
							<h2>Things I've created</h2>
							<div className="row mt-5 projects">
								{projects.map((p, i) => (
									<div className="col-sm-6 mb-4">
										<div className="card">
											<a
												href="https://codcompetitive.christophior.com/"
												target="_blank"
												rel="noreferrer"
											>
												<img
													src={p.image}
													alt={`Work ${i + 1}`}
													className="card-img-top rounded"
												/>
											</a>
											<div className="card-body px-0">
												<h5>{p.title}</h5>
												<a
													href={p.url}
													target="_blank"
													rel="noreferrer"
													className="text-muted d-flex flex-row align-items-center"
												>
													view project
													<em
														className="ml-1"
														data-feather="arrow-right"
														with="16"
														height="16"
													></em>
												</a>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			<footer className="mb-5" id="contact">
				<div className="container">
					<hr className="my-5" />
					<div className="row">
						<div className="col-md-6 mx-auto text-center">
							<h2>Want to hire or work with me?</h2>
							<p className="text-muted lead">
								I am available for contract work.
							</p>
						</div>
					</div>
					<div className="row mt-5">
						<div className="col-md-8 mx-auto">
							<form
								action="https://formspree.io/chrisvillarreal1018@gmail.com"
								method="POST"
							>
								<input
									type="hidden"
									name="_subject"
									value="message via christophior.com"
								/>
								<div className="row">
									<div className="col-md-6">
										<div className="form-group">
											<input
												type="text"
												className="form-control"
												placeholder="Your name"
												name="name"
											/>
										</div>
									</div>
									<div className="col-md-6">
										<div className="form-group">
											<input
												type="email"
												className="form-control"
												placeholder="Your email address"
												name="email"
											/>
										</div>
									</div>
									<div className="col-12">
										<div className="form-group">
											<textarea
												name="message"
												rows="5"
												className="form-control"
												placeholder="What are you looking for?"
											></textarea>
										</div>
									</div>
								</div>
								<div className="text-center mt-3">
									<button
										type="submit"
										className="btn btn-outline-dark"
									>
										Send message
									</button>
								</div>
							</form>
						</div>
					</div>
					<div className="row mt-6">
						<div className="col-md-6 my-md-auto text-center text-md-left text-muted">
							&copy; {new Date().getFullYear()} christophior
						</div>
						<div className="col-md-6 mt-4 mt-md-0 text-center text-md-right">
							<ul className="list-inline social social-white-alt social-rounded social-sm mb-0">
								{socials.map((s) => (
									<li className="list-inline-item">
										<a
											href={s.url}
											target="_blank"
											rel="noreferrer"
										>
											<Icon icon={s.icon} size={14} />
										</a>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
};
export default App;
