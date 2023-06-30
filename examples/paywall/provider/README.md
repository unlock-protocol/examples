# create-lock-paywall

This is an example to showcase how to use paywall provider to create a lock and charge users to access your content.

## Getting started

1. Clone this repository
2. Install dependencies: `yarn install`
3. Start the development server: `yarn dev`

## How it works

We use paywall js to add an authentication modal to the page, when the user is authenticated, it returns a paywall provider which follows EIP-1193. We use this provider inside wagmi to create a lock and charge users to access the content.

# License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
