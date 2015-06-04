import express = require("express");

export function index(req: express.Request, res: express.Response){
	res.render('chat_room1', {pageTitle: "Chat Room"});
};