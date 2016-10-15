# Chat_Example
A basic chatting application.

# Project Summery
This application is a bare bones chatting application written in TypeScript targetting Nodejs. It leverages express for routing, jade (now pug) for rendering, socket.io for real time communication, and jquery for dom manipulation. It offers dynamic chat room creation using express namespaces, as well as a primitive username feature.

# Project Context
This application was written only a couple months after I started programming, over the summer of 2015. It was my first attempt at writing a web application, my first time using TypeScript, and first time using Nodejs. I had no knowledge of frontend frameworks, and no knowledge of production systems. As such, this project follows no best practices. All data is held in memory, no database is used. The CSS is fine tuned for a specific screen size, and would likely fail on any other. The utilization of namespaces to create rooms is not an optimal solution. No build tools or unit tests were used.

# Lesssons
I learned a lot from this project, as everything was new. I gained a lot of knowledge about Nodejs and the basics of a web application. I learned the basics of jquery. The most important lesson I learned from this project was how to build an application with no help or guidance. Before this project, the only coding I had done was in introductory Computer Science classes. That coding was limited in scope and heavily guided. This project was outside the scope of any class, so I determined the goals and set out to implement it without help. There were many problems that I solved and many small features that I implemented. Even though this application is far from web scale, I managed to deploy it on Open Shift. While this application may be unimpressive, it was an enjoyable project and a crucial learning experience in my early programming days.
