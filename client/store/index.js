import Vuex from 'vuex'
import axios from 'axios'
import Vue from 'vue'

Vue.use(Vuex)

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      users: [],
      books: [],
      bookById: []
    }),
    mutations: {
      'SET_USERS': (state, payload) => {
        Vue.set(state, 'users', payload)
      },
      'SET_BOOKS': (state, payload) => {
        Vue.set(state, 'books', payload)
      },
      'SET_BOOK_BY_ID': (state, payload) => {
        Vue.set(state, 'bookById', payload)
      },
      'SET_UPDATE_BOOK': (state, payload) => {
        state.books.some((item, index) => {
          if(item.id == payload.id) {
            Vue.set(state.books[index], 'title', payload.title)
            Vue.set(state.books[index], 'category', payload.category)
            Vue.set(state.books[index], 'description', payload.description)
            Vue.set(state.books[index], 'subcategory', payload.subcategory)
          } else {
            return false
          }
        })
      },
      'ADD_NEW_BOOK': (state, payload) => {
        state.books.unshift(payload)
      },
      'DELETE_BOOK': (state, payload) => {
        state.books.some((item, index) => {
          if (item.id == payload.id) {
            return state.books.splice(index,1)
          }
        })
      }
    },
    getters: {
      users: state => {
        return state.users
      },
      books: state => {
        return state.books
      },
      bookById: state => {
        return state.bookById
      }
    },
    actions: {
      async 'GET_USERS' ({commit}) {
        try {
          const res = await axios.post('http://localhost:4000/graphql', {
            query: '{getUsers { id firstname lastname }}'
          })
          commit('SET_USERS', res.data.data.getUsers )
        } catch (e) {
          console.log(e)
        }  
      },
      async 'GET_BOOKS' ({commit}) {
          const res = await axios.post('http://localhost:4000/graphql', {
          query: `{
            getBooks {
              id
              title
              description
              category
              subcategory
            }
          }`
        })
        commit('SET_BOOKS', res.data.data.getBooks)
      },
      async 'GET_BOOK_BY_ID' ({commit}, payload) {
        try {
          const res = await axios.post('http://localhost:4000/graphql', {
          query: `
            {
              getBookById (id: ${payload.bookID}) {
                title
                description
                id
                subcategory
                category
              }
            }
          `
          })
          console.log(res.data.data)
          commit('SET_BOOK_BY_ID', res.data.data.getBookById)
        } catch (e) {
          console.log('err', e)
        }
      },
      async 'UPDATE_BOOK' ({commit}, payload) {
        try {
          const res = await axios.post('http://localhost:4000/graphql', {
            query: `
              mutation UpdateBook($id: Int!, $title: String!, $description: String!, $category: String!, $subcategory: String!) {
                updateBook(id: $id, title: $title, description: $description, category: $category, subcategory: $subcategory) {
                  id
                  title
                  description
                  category
                  subcategory
                }
              }`,
              variables: {
                id: payload.id,
                title: payload.title,
                description: payload.description,
                category: payload.category,
                subcategory: payload.subcategory
              }
          })
          commit('SET_UPDATE_BOOK', res.data.data.updateBook)
          console.log(res.data.data)
        } catch (e) {
          console.log('err', e)
        }
      },
      async 'DELETE_BOOK' ({commit}, payload) {
        try {
          await axios.post('http://localhost:4000/graphql', {
            query: `
            mutation DeleteBook($id: Int!) {
              deleteBook(id: $id) {
                  id
                }
              }`, 
              variables: {
                id: payload.id,
            }
          })
          
          commit('DELETE_BOOK', payload)
        } catch (e) {
          console.log('err', e)
        }
      },
      async 'ADD_NEW_BOOK' ({commit}, payload) {
        const newBook = await axios.post('http://localhost:4000/graphql', {
          query: `
            mutation AddBook($id: Int!, $title: String!, $description: String!, $category: String!, $subcategory: String!) {
              addBook(id: $id, title: $title, description: $description, category: $category, subcategory: $subcategory) {
                id
                title
                description
                category
                subcategory
              }
            }`,
            variables: {
              id: payload.id,
              title: payload.title,
              description: payload.description,
              category: payload.category,
              subcategory: payload.subcategory
            }
        })
        console.log(newBook.data.data.addBook)
        commit('ADD_NEW_BOOK', payload)
      }
    }
  })
}

export default createStore