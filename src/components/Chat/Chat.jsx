import React, { Component } from 'react';
import "./style.css";
// import * as JWT from 'jwt-decode';
import "./plugin.js";
// import {changeActiveFriend} from './plugin.js';
import decode from 'jwt-decode';
import $ from 'jquery';
import io from "socket.io-client";


const baseURL = "http://192.168.1.115:3005/";
const socket = io(baseURL);

// const baseURL = "https://mk14chatserver.herokuapp.com/"; 
export default class Chat extends Component {

	constructor(props) {
		super(props);

		this.state = {
			currentUser: {},
			activeFriend: {
				username: ""
			},
			contacts: [],
			searchResult: [],
			newFriendsSearch: [],
			chatID: "",
			activeChatMsgs: [],
			latestChats: [],
			searchingForContacts: false
		}


		socket.on('recieveMsg', data => {
			console.log("re",data)
			if (data.data.chatID === this.state.chatID) {
				let msg = {
					senderID: data.data.senderID,
					msgBody: data.data.msgBody
				}
				this.setState({
					activeChatMsgs: [...this.state.activeChatMsgs, msg]
				})
				// $("#msgs").scrollTop($("#msgs").height);
			}
		})



		// let url = "https://mk14chatserver.herokuapp.com/friends/"
		// let url = "http://localhost:3005/friends/"
	}

	componentDidMount() {
		console.log(baseURL)
		if (!localStorage.getItem("MK14ChatToken"))
			this.props.history.push(`/login`)
		else {

			var decoded = decode(localStorage.getItem("MK14ChatToken"));
			this.setState({ currentUser: decoded });
			console.log("Token Decoded : ", decoded);
			console.log("Current USer Data : ", this.state.currentUser);
			// get user constacts (friends)
			fetch(`${baseURL}friends/${decoded.uid}`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
				},

			})
				.then(response => {
					if (response.status === 200) {
						response.json().then(json => {
							// console.log(json.friends[0].friends);
							this.setState({
								contacts: json.friends[0].friends,
								activeFriend: json.friends[0].friends[0]
							})
						});
					}
				})

			// get latest user's chats 
			fetch(`${baseURL}latestChats/${decoded.uid}`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
				},
			}).then(res => res.json())
				.then(res => {
					if (res.code === 200) {
						this.setState({ latestChats: res.preChats })
					}
				})

			// start new Socket with Server 
			socket.on('connect', () => {
				console.log("MY Socket id is : ", socket.id);
				socket.emit("addOnlineUser", { userID: this.state.currentUser.uid })
			})
		}
	}



	orderNewChat = (activeFriend) => {

		// Get Previos messages of chat 
		fetch(`${baseURL}newChat`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				"Access-Control-Allow-Origin": "*"
			},

			body: JSON.stringify({
				users: [activeFriend._id, this.state.currentUser.uid]
			}),
		})
			.then(res => res.json())
			.then(res => {
				this.setState({
					chatID: res.chatID,
					activeChatMsgs: res.messages
				})
			})

			// start new socket connection 
			.then(() => {

				socket.emit('addActiveChat', { chatID: this.state.chatID });

			})
	}


	changeActiveFriend = (activeFriend, item) => {
		console.log(item.target);
		console.log("Active Friend Data : ", activeFriend)
		this.setState({ activeFriend, activeChatMsgs: [] })
		this.orderNewChat(activeFriend);

	}

	componentDidUpdate = () => {
		$("document").ready(() => {
			$(".contact").click(function () {
				$("li.contact").removeClass("active");
				// alert("Clicked")
				$(this).addClass('active');
			})
			// $("#msgs").scroll(() => console.log($("#msgs").scrollTop()))
		})
		console.log("Chat ID : ", this.state.chatID)
	}

	// search for friends on change input field
	friendSearch = (e) => {

		fetch(`${baseURL}searchFriends/${e.target.value}`, {
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
				newFriendsSearch: this.state.searchResult.filter((user) => {
					let found = false;
					for (let i = 0; i < this.state.contacts.length; i++) {
						if (this.state.contacts[i]._id === user._id || this.state.currentUser.uid === user._id) {
							found = true;
						}
					}
					if (!found)
						return user;
				})
			})
		})
	}

	// on click on + button to add user to current user friends list

	addFriend = (id, username, email, profileImg, e) => {
		e.target.disabled = true;
		// alert(e.target.id);
		let newFriend = {
			_id: id,
			username,
			email,
			profileImg
		}
		let decoded = decode(localStorage.getItem("MK14ChatToken"));
		fetch(`${baseURL}addFriend`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				"Access-Control-Allow-Origin": "*"
			},
			body: JSON.stringify({
				currentUserId: decoded.uid,
				newFriendId: id
			})
		}).then(response => {
			if (response.status === 200) {
				console.log('newFriend', newFriend)
				this.setState({
					contacts: [...this.state.contacts, newFriend]
				})
			}
		})
	}


	sendMessage = (e) => {
		e.preventDefault();
		if ($("#Msg").val() !== "") {

			this.setState({
				activeChatMsgs: [...this.state.activeChatMsgs, { senderID: this.state.currentUser.uid, msgBody: $("#Msg").val() }]
			})
			console.log("H : ", $("#msgs").height())
			console.log("H : ", $("body").height())

			$("#msgs").scrollTop($("#msgs").scrollHeight)


			// send message to database 
			fetch(`${baseURL}newMessage`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					"Access-Control-Allow-Origin": "*"
				},
				body: JSON.stringify({
					chatID: this.state.chatID,
					senderID: this.state.currentUser.uid,
					msgBody: $("#Msg").val()
				})
			}).then(() => $("#Msg").val(''))

			// send message to server socket 
			socket.emit("sendMsg", {
				receiverID: this.state.activeFriend._id,
				msgBody: $("#Msg").val(),
				chatID: this.state.chatID
			})
		}
	}


	switchSideView = (e) => {
		console.log(e.target.value)
		if (e.target.value === "") {
			this.setState({
				searchingForContacts: false
			})
		} else {
			this.setState({
				searchingForContacts: true
			})
		}
	}

	render() {
		return (

			<div id="frame">
				<div id="sidepanel" className="col-sm-5">
					<div id="profile">
						<div className="wrap">
							<img id="profile-img" src={this.state.currentUser.profileImg} className="online" alt="" />
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
						<input type="text" id="searchContacts" onChange={(e) => this.switchSideView(e)} placeholder="Search contacts..." />
					</div>
					<div id="contacts">
						<ul>

							{/* List Contacts */}
							{this.state.searchingForContacts ?

								this.state.contacts.map((contact) =>

									 contact.username.toLowerCase().includes( $("#searchContacts").val().toLowerCase()) ||contact.email.toLowerCase().includes( $("#searchContacts").val().toLowerCase()) ?

										<li key={contact._id} className="contact" onClick={(e) => this.changeActiveFriend(contact, e)}>
											<div className="wrap">
												<span className="contact-status online"></span>
												<img src={contact.profileImg} alt="" />
												<div className="meta">
													<p className="name">{contact.username}</p>
													<p className="preview">{contact.email}</p>
												</div>
											</div>
										</li>
										: null
								)

								:
								this.state.latestChats.map((chat) => {
									return (
										chat.users.map(user =>
											user._id !== this.state.currentUser.uid ?


												<li key={chat._id} className="contact" onClick={(e) => this.changeActiveFriend(user, e)}>
													<div className="wrap">
														<span className="contact-status online"></span>

														<img src={user.profileImg} alt="" />
														<div className="meta">
															<p className="name">{user.username}</p>

														</div>

													</div>
												</li>
												: null
										)
									);
								})

							}




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
												<img src={user.profileImg} alt="" />
												<button className="btn btn-warning addBtn"
													onClick={(e) => this.addFriend(user._id, user.username, user.email, user.profileImg, e)}
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
					{this.state.activeFriend ?
						<>
							<div className="contact-profile">
								<img src={this.state.activeFriend.profileImg} alt="" />
								<p>{this.state.activeFriend.username}</p>
								<div className="social-media">
									<i className="fa fa-facebook" aria-hidden="true"></i>
									<i className="fa fa-twitter" aria-hidden="true"></i>
									<i className="fa fa-instagram" aria-hidden="true"></i>
								</div>
							</div>
							<div className="messages" id="msgs">
								<ul>
									{this.state.activeChatMsgs ?
										this.state.activeChatMsgs.map((msg) =>

											<li className={this.state.currentUser.uid == msg.senderID ? "sent" : "replies"}
												key={msg._id}>
												<img src={this.state.currentUser.uid == msg.senderID ? this.state.currentUser.profileImg : this.state.activeFriend.profileImg} alt="" />
												<p>{msg.msgBody}</p>
											</li>

										)
										: null
									}
								</ul>
							</div>
							<div className="message-input">
								<div className="wrap">
									<form onSubmit={(e) => this.sendMessage(e)}>
										<input type="text" placeholder="Write your message..." id="Msg" />
										<i className="fa fa-paperclip attachment" aria-hidden="true"></i>
										<button className="submit"><i className="fa fa-paper-plane" aria-hidden="true"></i></button>
									</form>
								</div>
							</div>
						</>
						: null}
				</div>
			</div>
		)
	}
}
