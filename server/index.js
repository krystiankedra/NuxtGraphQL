const express = require('express')
const { graphql, buildSchema } = require('graphql')
const graphqlHTTP = require('express-graphql')
const cors = require('cors')
const User = require('../server/users')
const Book = require('../server/book')

const schema = buildSchema(`
  type Query {
    language: String
    getUsers: [User]
    getBooks: [Book]
    getBookById (id: Int!): Book
  }
  type Mutation {
    updateBook(id: Int!, title: String!, description: String!, subcategory: String!, category: String!) : Book
    deleteBook(id: Int!) : Book
    addBook(id: Int!, title: String!, description: String!, subcategory: String!, category: String!) : Book
  }
  type User {
    id: Int
    firstname: String
    lastname: String
  }
  type Book {
    id: Int
    title: String
    description: String
    subcategory: String
    category: String
  }
`)

const users = [
  new User(1,'Krystian', 'Junior'),
  new User(2,'Krystian2', 'Trainee'),
  new User(3,'Krystian3', 'Senior'),
  new User(4,'Krystian4', 'Nikt'),
  new User(5,'Krystian5', 'Vuejs'),
  new User(6,'Krystian6', 'Angular Banan'),
  new User(7,'Krystian7', 'Prawilny'),
  new User(8,'Krystian8', 'GIT'),
]

const books = [
  new Book(1,'Harry Potter', 'Czara Ognia', 'zagraniczne', 'fantasy'),
  new Book(2,'You dont know JS', 'Javascript book', 'IT', 'IT-Programing'),
  new Book(3,'Harry Potter', 'Horkruksy', 'przygodowe', 'fantasy'),
  new Book(4,'Harry Potter', 'Zakon Feniksa', 'przygodowe', 'fantasy'),
  new Book(5,'Title5', 'Description5', 'subcategory5', 'category5'),
  new Book(6,'Harry Potter', 'Kamien Filozoficzny', 'przygodowe', 'fantasy'),
  new Book(7,'Harry Potter', 'Komnata Tajemnic', 'zagraniczne', 'fantasy'),
  new Book(8,'Harry Potter', 'Wiezien Azkabanu', 'zagraniczne', 'fantasy'),
]



const rootValue = {
  language: () => 'GraphQL',

  getUsers: () => users,

  getBooks: () => books,

  getBookById: ({id}) => {
    return books.find(item => item.id == id)
  },

  updateBook: ({id,title,description,subcategory,category}) => {
    const updatedBook = books.find(item => item.id == id)
    updatedBook.title = title
    updatedBook.description = description
    updatedBook.category = category
    updatedBook.subcategory = subcategory

    return updatedBook
  },

  deleteBook: ({id}) => {
    books.some((item,index) => {
      if(item.id == id) {
        return books.splice(index, 1)
      }
    })
  },

  addBook: ({id,title,description,subcategory,category}) => {
    const book = {
      id: id,
      title: title,
      description: description,
      subcategory: subcategory,
      category: category
    }
    books.unshift(book)
    return book
  }
}

const app = express()

app.use(cors())
app.options('*', cors());
app.use('/graphql', graphqlHTTP({
  rootValue, schema, graphiql: true
}))

app.listen(4000, () => console.log('Listening on 4000'))