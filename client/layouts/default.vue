<template>
  <div class="container-fluid">
    <div class="row">
      <div class="card col-md-8 offset-md-2">
        <div class="card-header background-span text-center">
          <h3>Navigation</h3>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 mt-5">
        <div class="row">
          <div class="card">
            <div class="card-header background-span text-center">
              <span>Application Nuxt.js With GraphQL</span>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="row">
                  <div>
                    <button class="btn btn-outline-danger" disabled>
                      Select Action
                    </button>
                  </div>
                </div>
                <div class="row">
                  <div>
                    <button class="btn btn-outline-primary" @click="getLanguage">Get Language</button>
                    <p>{{example1}}</p>
                  </div>
                </div>
                <div class="row">
                  <div>
                    <button class="btn btn-outline-primary" @click="getUsers">Get Users</button>
                  </div>
                </div>
                <div>
                  <button class="btn btn-outline-primary" @click="getDataByBookID">Search By User ID</button>
                  <select v-model="bookID" class="form-control">
                    <option disabled value="">Select Value</option>
                    <option v-for="book in Books" :key="book.id" :value="book.id">{{book.id}}</option>
                  </select>
                </div>
              </div>
              <div class="row mt-3">
                <div class="row">
                  <div class="card" v-if="bookById.id">
                    <div class="card-body">
                      <strong>ID: </strong>{{bookById.id}}
                      <strong>Title: </strong>{{bookById.title}}
                      <strong>Description: </strong>{{bookById.description}}
                      <strong>Category: </strong>{{bookById.category}}
                      <strong>Subcategory: </strong>{{bookById.subcategory}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6 mt-5">
        <div class="card">
          <div class="card-body">
            <div class="mt-3 row">
              <div class="col-md-6 offset-md-2">
                <div class="input-group mb-1">
                  <div class="input-group-prepend">
                    <span class="input-group-text background-span" id="basic-addon3">New Title</span>
                  </div>
                  <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3" v-model="newTitle">
                </div>
                <div class="input-group mb-1">
                  <div class="input-group-prepend">
                    <span class="input-group-text background-span" id="basic-addon3">New Description</span>
                  </div>
                  <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3" v-model="newDescription">
                </div>
                <div class="input-group mb-1">
                  <div class="input-group-prepend">
                    <span class="input-group-text background-span" id="basic-addon3">New Category</span>
                  </div>
                  <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3" v-model="newCategory">
                </div>
                <div class="input-group mb-1">
                  <div class="input-group-prepend">
                    <span class="input-group-text background-span" id="basic-addon3">New Subcategory</span>
                  </div>
                  <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3" v-model="newSubcategory">
                </div>
              </div>
              <div class="col-md-4">
                <button class="btn btn-outline-success" @click="addNewBook">Add New Book</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-3">
      <table class="table" v-if="Users.length > 0 && showUsers">
        <thead>
          <tr>
            <th>ID</th>
            <th>Titl</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in Users" :key="user.id">
            <th>{{user.id}}</th>
            <th v-if="user.firstname">{{user.firstname}}</th>
            <th>{{user.lastname}}</th>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="row mt-3">
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th>ID</th>
            <th>Titl</th>
            <th>Description</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in Books" :key="book.id">
            <th>{{book.id}}</th>
            <td>{{book.title}}</td>
            <td>{{book.description}}</td>
            <td>{{book.category}}</td>
            <td>{{book.subcategory}}</td>
            <td><button class="btn btn-outline-success" @click="showEdit">Edit Book</button></td>
            <td v-if="showEditBook">
              New Title: <input class="form-control" v-model="editBook.title">
              New Description: <input class="form-control" v-model="editBook.description">
              New Category: <input class="form-control" v-model="editBook.category">
              New Subcategory: <input class="form-control" v-model="editBook.subcategory">
              <button class="btn btn-outline-primary" @click="updateBook(book.id)">Save</button>
            </td>
            <td><button class="btn btn-outline-danger" @click="deleteBook(book.id)">Delete</button></td>
          </tr>
        </tbody>
      </table>
      <pie-chart :data="dataCollection"></pie-chart>
      <line-chart :data="dataColl2"></line-chart>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueChartkick from 'vue-chartkick'
  import Chart from 'chart.js'
  Vue.use(VueChartkick, {
    adapter: Chart
  })
  import axios from 'axios'
  export default {
    computed: {
      Users() {
        return this.$store.getters.users
      },
      Books() {
        return this.$store.getters.books
      },
      bookById() {
        return this.$store.getters.bookById
      }
    },
    data() {
      return {
        dataCollection: [
          ['Vue', 80],
          ['React', 60],
          ['Angular', 80],
          ['Electron', 60],
          ['Java', 60],
          ['C#', 20]
        ],
        dataColl2: [{
            name: 'Workout',
            data: {
              '2017-01-01': 3,
              '2017-01-02': 4
            }
          },
          {
            name: 'Call parents',
            data: {
              '2017-01-01': 5,
              '2017-01-02': 3
            }
          }
        ],
        example1: '',
        bookID: '',
        showEditBook: false,
        showUsers: false,
        editBook: {
          title: '',
          description: '',
          category: '',
          subcategory: '',
        },
        newTitle: '',
        newDescription: '',
        newCategory: '',
        newSubcategory: '',
      }
    },
    methods: {
      async getDataByBookID() {
        await this.$store.dispatch('GET_BOOK_BY_ID', {
          bookID: this.bookID
        })
      },
      async getLanguage() {
        try {
          const res = await axios.post('http://localhost:4000/graphql', {
            query: '{language}'
          })
          this.example1 = res.data.data.language
        } catch (e) {
          console.log('err', e)
        }
      },
      async getUsers() {
        this.showUsers = !this.showUsers
        await this.$store.dispatch('GET_USERS')
      },
      showEdit() {
        this.showEditBook = !this.showEditBook
      },
      async updateBook(bookID) {
        await this.$store.dispatch('UPDATE_BOOK', {
          id: bookID,
          title: this.editBook.title,
          description: this.editBook.description,
          subcategory: this.editBook.subcategory,
          category: this.editBook.category
        })
        this.showEditBook = !this.showEditBook
      },
      async deleteBook(bookID) {
        await this.$store.dispatch('DELETE_BOOK', {
          id: bookID,
        })
        await this.$store.dispatch('GET_BOOKS')
      },
      async addNewBook() {
        await this.$store.dispatch('ADD_NEW_BOOK', {
          id: Math.floor((Math.random() * 10000) + 1),
          title: this.newTitle,
          description: this.newDescription,
          category: this.newCategory,
          subcategory: this.newSubcategory
        })
        this.newTitle = null
        this.newDescription = null
        this.newCategory = null
        this.newSubcategory = null
      }
    },
    async mounted() {
      await this.$store.dispatch('GET_BOOKS')
    },
  }

</script>

<style scoped>
  .card {
    padding: 0;
  }

  .row {
    margin: 0px;
  }

  .background-span {
    background-color: rgb(34, 32, 32);
    color: white;
  }

</style>
