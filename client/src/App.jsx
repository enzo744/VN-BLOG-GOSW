import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout/Layout'
import { RouteIndex, RouteProfile, RouteSignIn, RouteSignUp, RouteAddCategory, 
  RouteEditCategory, RouteCategoryDetails, RouteBlogAdd, RouteBlogEdit, 
  RouteBlog, RouteBlogDetails, 
  RouteBlogByCategory,
  RouteSearch,
  RouteCommentDetails,
  RouteUser} from './helpers/RouteName'
import Index from './pages/Index'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import AddCategory from './pages/Category/AddCategory'
import EditCategory from './pages/Category/EditCategory'
import CategoryDetails from './pages/Category/CategoryDetails'
import BlogDetails from './pages/Blog/BlogDetails'
import AddBlog from './pages/Blog/AddBlog'
import EditBlog from './pages/Blog/EditBlog'
import SingleBlogDetails from './pages/SingleBlogDetails'
import BlogByCategory from './pages/Blog/BlogByCategory'
import SearchResult from './pages/SearchResult'
import Comments from './pages/Comments'
import User from './pages/User'
import AuthRouteProtection from './components/AuthRouteProtection'
import OnlyAdminAllowed from './components/OnlyAdminAllowed'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RouteIndex} element={<Layout />} >
          <Route index element={<Index />} />
                   
          <Route path={RouteBlogDetails()} element={<SingleBlogDetails />} />
          <Route path={RouteBlogByCategory()} element={<BlogByCategory />} />
          <Route path={RouteSearch()} element={<SearchResult />} />
          

          <Route element={<AuthRouteProtection />}>
            <Route path={RouteProfile} element={<Profile />} /> 
            <Route path={RouteBlogAdd} element={<AddBlog />} />
            <Route path={RouteBlog} element={<BlogDetails />} />
            <Route path={RouteBlogEdit()} element={<EditBlog />} />
            <Route path={RouteAddCategory} element={<AddCategory />} />
            <Route path={RouteEditCategory()} element={<EditCategory />} />
          </Route>

          <Route element={<OnlyAdminAllowed />}>
            <Route path={RouteCommentDetails} element={<Comments />} />
            <Route path={RouteCategoryDetails} element={<CategoryDetails />} />
            <Route path={RouteUser} element={<User />} />
          </Route>

        </Route>

        <Route path={RouteSignIn} element={<SignIn />} />
        <Route path={RouteSignUp} element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
