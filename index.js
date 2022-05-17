const express = require('express')
const app = express()
const port = 3000
const userData = require("./MOCK_DATA.json");
const graphql = require("graphql");
const {
    GraphQLObjectType, 
    GraphQLSchema, 
    GraphQLInt, 
    GraphQLString, 
    GraphQLList
} = graphql;
const { graphqlHTTP } = require("express-graphql");

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLInt },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    })
})

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllUsers: {
            type: new GraphQLList(UserType),
            args: { id: {type: GraphQLInt} },
            resolve(parent, args) {
                return userData
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createUser: {
            type: UserType,
            args: {
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve(parent, args){
                //db.
                userData.push({id: userData.length + 1, firstName: args.firstName, lastName: args.lastName, email: args.email, password: args.password})
                return args
            }
        }
    }
})


const schema = new GraphQLSchema({query: RootQuery, mutation: Mutation})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})