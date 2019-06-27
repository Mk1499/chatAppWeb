import React, { Component } from 'react';
import "./style.css";
// import * as JWT from 'jwt-decode';
import "./plugin.js";
import decode from 'jwt-decode';
import $ from 'jquery';

export default class Chat extends Component {

	constructor(props) {
		super(props);
		let decoded = decode(localStorage.getItem("MK14ChatToken"));
		// alert(decoded.uid);
		this.state = {
			url: "http://localhost:3005/",
			// url:"https://mk14chatserver.herokuapp.com/",
			currentUser: {
				username: "",
				email: "",

			},
			contacts: [],
			searchResult:[],
			newFriendsSearch: [],

		}
		// let url = "https://mk14chatserver.herokuapp.com/friends/"
		// let url = "http://localhost:3005/friends/"
		console.log(this.state.url)
		fetch(`${this.state.url}friends/${decoded.uid}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},

		})
			.then(response => {
				if (response.status === 200) {
					response.json().then(json => {
						// console.log(json.friends[0].friends);
						this.setState({ contacts: json.friends[0].friends })
					});
				}
			})
	}

	componentDidMount() {
		try {
			let decoded = decode(localStorage.getItem("MK14ChatToken"));
			this.setState({ currentUser: decoded })
			console.log(decoded);
		} catch (err) {
			this.props.history.push(`/login`)
		}
	}

	// search for friends on change input field
	friendSearch = (e) => {

		fetch(`${this.state.url}searchFriends/${e.target.value}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		}).then(response => {
			if (response.status === 200) {
				response.json().then(json => {
					// console.log(json.friends[0].friends);
					this.setState({ searchResult: json.users })
				});
			}
		}).then(() => {
			console.log(this.state.contacts);
			this.setState({
				newFriendsSearch : this.state.searchResult.filter((user)=>{
					console.log(`User : ${user.username} , state : ${this.state.contacts.includes(user._id)}`)
					let found = false ;
					for(let i=0 ; i < this.state.contacts.length ; i++){
						if(this.state.contacts[i]._id === user._id){
							found = true ; 
						}
					} 
					if (!found)
						return user ;
				})
			})
		})
	}

	// on click on + button to add user to current user friends list

	addFriend = (id,username,email,e) => { 
		e.target.disabled = true ; 
		// alert(e.target.id);
		let newFriend = {
			id: id,
			username: username,
			email: email
		}
		let decoded = decode(localStorage.getItem("MK14ChatToken"));
		fetch(`${this.state.url}addFriend/${decoded.uid}/${id}`,{
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		}).then(response => {
			if(response.status === 200){
				console.log('newFriend', newFriend)
				this.setState({
					contacts: [...this.state.contacts , newFriend]
				})
			}
		})
	}

	render() {
		return (

			<div id="frame">
				<div id="sidepanel" className="col-sm-5">
					<div id="profile">
						<div className="wrap">
							<img id="profile-img" src="http://emilcarlsson.se/assets/mikeross.png" className="online" alt="" />
							<p>{this.state.currentUser.username}</p>
							<i className="fa fa-chevron-down expand-button" aria-hidden="true"></i>
							<div id="status-options">
								<ul>

									<li id="status-online" className="active"><span className="status-circle"></span> <p>Online</p></li>
									<li id="status-away"><span className="status-circle"></span> <p>Away</p></li>
									<li id="status-busy"><span className="status-circle"></span> <p>Busy</p></li>
									<li id="status-offline"><span className="status-circle"></span> <p>Offline</p></li>
								</ul>
							</div>
							<div id="expanded">
								<label ><i className="fa fa-facebook fa-fw" aria-hidden="true"></i></label>
								<input name="twitter" type="text" />
								<label ><i className="fa fa-twitter fa-fw" aria-hidden="true"></i></label>
								<input name="twitter" type="text" />
								<label ><i className="fa fa-instagram fa-fw" aria-hidden="true"></i></label>
								<input name="twitter" type="text" />
							</div>
						</div>
					</div>
					<div id="search">
						<label ><i className="fa fa-search" aria-hidden="true"></i></label>
						<input type="text" placeholder="Search contacts..." />
					</div>
					<div id="contacts">
						<ul>
						

							{this.state.contacts.map((contact) => {
								return (
									<li key={contact._id} className="active contact">
										<div className="wrap">
											<span className="contact-status online"></span>
											<img src="http://emilcarlsson.se/assets/louislitt.png" alt="" />
											<div className="meta">
												<p className="name">{contact.username}</p>
												<p className="preview">{contact.email}</p>
											</div>
										</div>
									</li>
								);
							})}




						</ul>
					</div>
					<div id="bottom-bar">
						<button id="addcontact"><i className="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Add friend</span></button>
						{/* <button id="settings"><i className="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Settings</span></button> */}
					</div>

					{/* Add Friends */}
					<div className="animated addFriend">
						<div className="search">
							<label><i className="fa fa-search" aria-hidden="true"></i></label>
							<input type="text" id="friendSearch" onChange={this.friendSearch} placeholder="Type Friend Email or Username" />
						</div>
						<div id="contacts">
							<ul>


								{this.state.newFriendsSearch.map((user) => {
									return (
										<li key={user._id} className="contact">
											<div className="wrap">
												<span className="contact-status online"></span>
												<img src="http://emilcarlsson.se/assets/louislitt.png" alt="" />
												<button className="btn btn-warning addBtn"
												 onClick={(e)=>this.addFriend(user._id,user.username,user.email,e)}
												 id={user._id}
												 username={user.username}
												 email={user.email}
												  >+</button>
												<div className="meta">
													<p className="name">{user.username}</p>
													<p className="preview">{user.email}</p>
												

												</div>
											</div>
										</li>
									);
								})}




							</ul>
						</div>
						<button id="closeAddFriends" className=" btn btn-gold close">X</button>
					</div>

				</div>
				<div className="content col-sm-7">
					<div className="contact-profile">
						<img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
						<p>Harvey Specter</p>
						<div className="social-media">
							<i className="fa fa-facebook" aria-hidden="true"></i>
							<i className="fa fa-twitter" aria-hidden="true"></i>
							<i className="fa fa-instagram" aria-hidden="true"></i>
						</div>
					</div>
					<div className="messages">
						<ul>
							<li className="sent">
								<img src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
								<p>How the hell am I supposed to get a jury to believe you when I am not even sure that I do?!</p>
							</li>
							<li className="replies">
								<img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
								<p>When you're backed against the wall, break the god damn thing down.</p>
							</li>
							<li className="replies">
								<img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
								<p>Excuses don't win championships.</p>
							</li>
							<li className="sent">
								<img src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
								<p>Oh yeah, did Michael Jordan tell you that?</p>
							</li>
							<li className="replies">
								<img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
								<p>No, I told him that.</p>
							</li>
							<li className="replies">
								<img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
								<p>What are your choices when someone puts a gun to your head?</p>
							</li>
							<li className="sent">
								<img src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
								<p>What are you talking about? You do what they say or they shoot you.</p>
							</li>
							<li className="replies">
								<img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
								<p>Wrong. You take the gun, or you pull out a bigger one. Or, you call their bluff. Or, you do any one of a hundred and forty six other things.</p>
							</li>
						</ul>
					</div>
					<div className="message-input">
						<div className="wrap">
							<input type="text" placeholder="Write your message..." />
							<i className="fa fa-paperclip attachment" aria-hidden="true"></i>
							<button className="submit"><i className="fa fa-paper-plane" aria-hidden="true"></i></button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
