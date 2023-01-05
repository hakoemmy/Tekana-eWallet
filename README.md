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
- 📈 The strategy to re-design the existing legacy application to a brand new so called: "Tekana-eWallet"

## 🚧 Tekana e-Wallet staging environment

**No Extra configuration needed**

- Hit this [url](https://rssb.onrender.com/docs), you'll be taken to the RESTful API docs, **note**: Since we're using free hosting service, it might delay up to 30 secs bacause, the hosting provider puts it in idle state when it's not being used. Just bare with us!

- The APIs use

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

## Strategy

-

## Author

[Emmanuel HAKORIMANA](https://github.com/hakoemmy)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENCE.md) file for details

## Acknowledgments

- [Rwanda Social Security Board(RSSB)](https://www.rssb.rw/)
