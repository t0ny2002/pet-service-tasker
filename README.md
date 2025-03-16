This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Installation and Use Manual
As a preface to the setup, it should be made clear that the Supabase database we have used is the same database connected to both the deployed website and any local instance of the frontend. The database is hosted separately by Supabase and, for simplicity, there is no distinction between which frontend is connecting to it. Instructions on access to the Supabase dashboard and online table editor are provided at the end of this section.

## Using the Platform
In order to actually use the frontend application, navigate to the following link.

https://3900-h13-b-burrito.vercel.app/

This is where our application is hosted by Vercel. Vercel are the makers of Next.js and also provide their own free hosting service, similar to other services like AWS and Google Firebase. Vercel was chosen since it very easily hosts a Next.js app without any further integrations.

Here, you are able to use the website that is connected to the Supabase database without any local setup required. This website contains the same repository that has been submitted.

## Running the Website Locally
The installation or setup of our application is very simple. Being a Next.js application there should be very little setup required to run the website locally.

1. First, download the code from our GitHub repository, either via HTTPS, SSH, or a GitHub CLI/app.

2. Navigate into the repository directory, with a terminal.

3. Next we have used `yarn` as our package manager, so ensure that `yarn` is installed on your machine (see https://classic.yarnpkg.com/lang/en/docs/install/) for basic installation instructions.

4. Then, from the root of the repo directory, run `yarn` to install all of the dependency packages required by the website.

5. In order to connect to the Supabase server from your local machine, you will need the following environment variables. Create a file in the root directory with the file name `.env.local`. Copy the values included in the final report document corresponding to this step.

    - Suabase and GitHub have collaborated to ensure that any supabase keys commited to a repository are invalidated. This is why we cannot include them within the repo.

6. Finally running `yarn build; yarn start` should start a local server. In the terminal, it should display the URL where the server is running locally, likely `localhost:3000`.

7. Navigating to this URL in a browser should now show our frontend.

If any of these instructions did not work, reach out to our team for any help, or use the hosted version at the URL in section 6.1.

## Description of Codebase
The following is a brief description of the codebase:

- (`/`) The root directory is where all of the configuration files for various packages are kept. None of these are really important to our specific implementation and are general configs, with exception to the `middleware.ts` file. This file is what allows cookies to be transferred between the server and the client while running the website. This is important for ensuring the user authentication token remains the same on both ends of the website.
- (`/public`) The public folder is where the publicly served images are kept.
- (`/app`) This folder is the Next.js route manager. Every `page.tsx` file within this directory is a unique route segment on the frontend. The route it corresponds to is identified by the parent folders up towards the `app` directory. For example `/app/admin/posts/page.tsx` corresponds to the `/admin/posts` page on the frontend.
- (`/components`) This folder is where we abstracted the individual components of our application to, as with any React based application. These components are imported into a page file in the app directory at some point to be rendered. The structure within this directory is not important, but is structured to group certain similar components together.
- (`/lib`) The library folder is just common Typescript files we used across our application that do not use React-style JSX. This was done in order to separate logic from components.
- (`/.vscode`) This is just some vscode settings we wanted to enforce during development and is unimportant to any implementations.
- (`/diaries`) Finally, this is just where our weekly individual diaries were kept.

## Supabase
Since we used Supabase to host our Postgresql database, it does not need to be run locally. It is also the same database used by our deployed website.

## Existing Accounts
There are some existing accounts on the platform that may be useful to use.

- Owner Account (Tony Stark)
  - Email: `tonystark@gmail.com`
  - Password: `testtest`
- Carer Account (Matt Carer)
  - Email: `matt@carer.com`
  - Password: `Qwerty12`
- Admin Account (Matt Admin)
  - Email: `matt@admin.com`
  - Password: `Qwerty12`

It is also possible to make new accounts, except you will need an admin account to create a new admin from the admin users page.
