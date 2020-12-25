const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const app = express();

const events = [];

const schema1 = buildSchema(`
    type RootQuery{
        username: [String!]!
    }
    type RootMutation {
        createUsername(name: String) : String
    }
    schema {
        query : RootQuery,
        mutation: RootMutation
    }
`);

const rootValue1 = {
  username: () => ["Muruks", "Bryan", "VR"],
  createUsername: (agrs) => {
    return agrs.name;
  },
};

const schema = buildSchema(`
    type Event {
        _id: ID!
        title: String!
        desc: String!
        price: Float!
        date: String!
    }
    input EventInput{
        title: String!
        desc: String!
        price: Float!
        date: String!
    }
    type RootQuery{
        bookDetails: [Event!]!
    }
    type RootMutation {
        createBookDetails(eventInput: EventInput) : Event
    }
    schema {
        query : RootQuery,
        mutation: RootMutation
    }
`);

const rootValue = {
  bookDetails: () => {
    return events;
  },
  createBookDetails: (args) => {
    const evt = {
      _id: Math.random().toString(),
      title: args.eventInput.title,
      desc: args.eventInput.desc,
      price: +args.eventInput.price,
      date: args.eventInput.date,
    };
    events.push(evt);
    return evt;
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  })
);

app.listen(8000, () => {
  console.log("the server is running on 8000");
});
