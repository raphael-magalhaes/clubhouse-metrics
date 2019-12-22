# Clubhouse Metrics

The goal of this project is to extract valuable metrics, some of them currently not available through Clubhouse UI or API. The motivation to start this project was not being able to programmatically calculate individual story workflow state lead time, in other words, how much time each story card spent in each column.

## Getting Started

1. Clone the project
2. Run `yarn` on the root folder to install dependencies
3. Make a copy of `.env-example` and rename it to `.env`
4. Populate your `.env` file ([how to](#how-to-populate-your-.env))
5. Run `yarn start`
6. The retrieved data will be in the `data` folder on the project's root folder

### How to populate your .env

If you do not have the `.env` file yet, please refer to [Getting Started step #3](#getting-started).

The `.env` have two logical sections inside it, the first one is just the token to access the exposed [Clubhouse REST API](https://clubhouse.io/api/rest/v3/#Introduction) and the later refers to impersonating a valid user in order to collect data that is not exposed through the [Clubhouse REST API](https://clubhouse.io/api/rest/v3/#Introduction).

[Create an API Token](https://app.clubhouse.io/beacon-works/settings/account/api-tokens) and add the token to `CLUBHOUSE_API_TOKEN` in your `.env` file.

> Tip: The token will be displayed only one time, so be sure to store it in a safe place, however you can always delete the lost token and generate a new one.

To get the user credentials, you will need to log in into Clubhouse, once you are authenticated there are several network requests that will contain the values you need to add to your `.env` file. One way to get those values is going to your profile by clicking on your avatar on the top right of the screen, in your profile open the developer tools by pressing F12 and open the Network tab, after that simply save the changes you did not made by clicking on the blue save button. This action will send a `user` request, click on this request and search for the following values in the request's headers:

1. `clubhouse-company`: the value of this key should be added to `CLUBHOUSE_COMPANY` in `.env`.
2. `clubhouse-organization`: the value of this key should be added to `CLUBHOUSE_ORGANIZATION` in `.env`.
3. `cookie`: the value of this key may have several key-values, the one we want is the value of `clubhouse-session` key, add the value to `CLUBHOUSE_USER_SESSION_TOKEN` in `.env`.
4. You will also need the slug of your organization, you can find it on the Clubhouse URL when you are logged in. For example, in `https://app.clubhouse.io/my-organization/stories/` the slug will be `my-organization`, add your value to `CLUBHOUSE_ORGANIZATION_SLUG` in `.env`.

After adding your values to your `.env` file, it should look something like this:

```
# Refer to the README.md to see how to find these values.

# API Token
CLUBHOUSE_API_TOKEN=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# User Credentials
CLUBHOUSE_ORGANIZATION=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
CLUBHOUSE_COMPANY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
CLUBHOUSE_USER_SESSION_TOKEN=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
CLUBHOUSE_ORGANIZATION_SLUG=my-organization
```

And that is all you need to add to your `.env` file, please refer to [Getting Started step #5](#getting-started) to continue your setup.

### Running the tests

`yarn test`
