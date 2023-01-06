# Tekana-eWallet

> Tekana-eWallet is a revamped a world wide solution that should be used by anyone around the world to transfer money to friends, families, etc..

Tekana-eWallet is composed of different modules, to begin with, let's try to share a short overview of the whole system:

## Modules

1. User module

This module handles users authentication and authorization. user module is generic which means the platform can support users of different types, For the time being Tekana-eWallet supports three roles super admins, admins and customers.

- A user with super admin has a full access to the whole system.
- Admins are like super admins modurators, they can do limited operations on the system.
- Customers are the reason why Tekana-eWallet is built! They can do alot such as registering in the paltform, creating wallets, depositing and transferring funds to other customers, just to name few!

2. Wallet module

In this module, customers can manage their wallets, currently tekana-eWallet supports two types of wallets, RWF and USD based wallets, a customer can own either one or both.

3.  Transactions module

Now, a a customer has a wallet, in this module, a customer can deposit, transfer funds to other customers and view all made transactions.

4.  Managment module

This is a module that is accessed by the internal team of Tekan-eWallet, as the module says, it actually allows tekana-eWallet adminstrators to manage everything happening in the system.

## Core technologies Used

- [NestJs](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Fastify](https://www.fastify.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma ORM](https://www.prisma.io/)

## Getting Started

In below sections, you'll get access to:

- 🚧 The staging environment of Tekana-eWallet to play around with documentation
- 🦴 Local environment setup of Tekana-eWallet system
- 📈 The strategy used to re-design the existing legacy application to a brand new solution so called: "Tekana-eWallet"

## 🚧 Tekana e-Wallet staging environment

**No Extra configuration needed**

- Hit this [url](https://rssb.onrender.com/docs), you'll be taken to the RESTful API docs, **note**: Since we're using free hosting service, it might delay up to 30 secs bacause, the hosting provider puts it in idle state when it's not being used. Just bare with us!

## 🦴 Local environment setup of Tekana-eWallet system

**Extra configuration needed on a machine**

In case you want to run this project locally on your machine, you can go through below steps:

1. Running Tekana-eWallet without docker

   First install below tools:

   - [Nodejs](https://nodejs.org/en/)
   - [Yarn](https://yarnpkg.com/)
   - [PostgreSQL](https://www.postgresql.org/)

Secondly, run `git clone https://github.com/hakoemmy/Tekana-eWallet.git ` in your terminal then open cloned project in your favorite IDE or editor.

Thirdly, run `yarn install`, it will install all project dependencies, before starting the project, copy all env variables in `.env.dev ` that is localed in root project and create `.env` file then replace it with your real values, such valid databe host, username and password.

Then, run `yarn prisma migrate dev` to run database migrations.

Finally run, `yarn start:dev` to sping up the dev environment, it will open up local env on port 3000 and you can access docs under: `http://localhost:3000/docs`

2. Running Tekana-eWallet with docker

   **Extra configuration needed on a machine**

   Firstly, install [docker](https://www.docker.com) on you machine. Then

   - Run `docker compose up` in your terminal and it will open up url in browser on port: `8000` and access docs under: `http://localhost:8000/docs`

3. Running unit tests

- Hit `yarn test` to run the unit tests

## 📈 Strategy

### Mission

> The mission is to rebuild from scratch a back-end solution for a legacy platform that serves 1 million customers around the world.

Below are step by step strategy, I'd go through to revamp the legacy system, first of all, I'd use iterative/agile strategy because with this strategy, you receive a value early in the process and it increases as the replacement progresses.

- Step 1: Define the goals

  - I'd examine how the existing legacy platform meets or doesn't meet customer needs/ problems or in general user stories.

- Step 2: Establish scope:

  - Priotize the user stories that should be solved aligning with iterative strategy.

- Step 3: Craft requirement:

  - I'd write an initial SRS(software requirement specification) here to engage the team and make it clear what's expected of them
  - In this stage, I'd develop an approach, and choose new architecture, technologies, frameworks, languages, and microservices. Assign product owners, scrum masters, designers, developers, and testers.
  - Basing on the stragy mission, I'd choose typescript programming language to be used across the teams. Backend team would use NestJs/Fastify alongside PostgreSQL with Prisma ORM, web team would use ReactJs/Redux, mobile team would use React Native/Redux. My choice with this would be worth it because whenever a team is using same programming language and it's top notch one, it makes it easier to collaborate where possible.

  - During deployment, in order to achieve 1+ million users target, I'd recommend hosting our products on containized platform that runs on top of kubernates which is a good solution that could be scaled up or down anytime there is a need.

- Step 4: Development phase

  - In this phase, I'd engage project managers and UI/UX designers to build user stories and mockups respectively and follow development plans in time-boxed sprints

  - During development, both front-end and backend teams would be advised to follow the software development pratices while implementing user stories by wrting code such as:

    1. Enhancing Code Readability:

       I'd advise teams to write professional code that is clean and modular, easily readable, as well as logically structured into modules and functions. By using modules that make code more efficient, reusable, and organized.

    2. Code refactoring:

       In order to create a high-quality program, devoting time to refactor code is essential. In the long run, refactoring will speed up the development time, and make the software engineering process much smoother.

    3. Using version control(git):

       One of good thing of version control system, numerous developers can work independently to add/remove features or make changes to a single project, without impacting other member’s work and much more... This would be a must have engineering pratice to follow during this modernazition.

    4. Testing code and functionality:

    Here, all teams(backend and frontend) would be required to write both unit and integration tests for their codebase, also QA team would carry out their test cases for every feature delievered in every sprint.

    5. The KISS, YAGNI and DRY Principle must be obeyed:

       - The “Keep It Simple, Silly”(KISS) ensures that your code has high maintainability so that you should be able to go back and debug it easily, without wasting time and effort.

       - “You Aren’t Gonna Need It”(YAGNI) emphasizes, it’s always a good idea to avoid coding something that you don’t need “right now.” You can always add it later if circumstances change.

       - The DRY (Don’t Repeat Yourself) Principle aims at reducing repetition and redundancies within the software engineering process. This is achieved by replacing repetitions with abstractions or by grouping code into functions.

- Step 5: Test and deliver

In this stage, QA test after each user story or each major development step by identifying any bugs or impediments to progress. Tracking changes toward a smooth rollout of the completed application fully integrated and connected.

- Step 6: Deployment phase

After testing the iteration and agreeing on acceptance test, in this stage DevOps team would host product using the approach defined in the requirement and send it to beta then later production.

- Step 6: Training and support

This phase is really needed and it's planned well during development, a QA/helper center should be prepared beforehand so that when the product is released, customers will beable to use the product easily.

## Author

[Emmanuel HAKORIMANA](https://github.com/hakoemmy)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENCE.md) file for details

## Acknowledgments

- [Rwanda Social Security Board(RSSB)](https://www.rssb.rw/)
