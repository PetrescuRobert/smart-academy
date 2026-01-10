# SmartAcademy

## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve smart-academy
```

To create a production bundle:

```sh
npx nx build smart-academy
```

To see all available targets to run for a project, run:

```sh
npx nx show project smart-academy
```

## Local E2E setup 🔧

To run end-to-end tests locally, create a local `.env` for the E2E app from the example and set your database credentials:

```sh
cp apps/smart-academy-e2e/.env.example apps/smart-academy-e2e/.env
# then edit apps/smart-academy-e2e/.env and update DATABASE_URL accordingly
```

## Local app setup 🔧

To run the application locally, create a `.env` for the app from the example and set your database credentials:

```sh
cp apps/smart-academy/.env.example apps/smart-academy/.env
# then edit apps/smart-academy/.env and update DATABASE_URL accordingly
```
