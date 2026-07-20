import Stripe from "stripe";

import config from "../config/index.js";

const stripe = config.stripeSecretKey ? new Stripe(config.stripeSecretKey) : null;

export { stripe };
