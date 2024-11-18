import './App.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthGuard from './auth/authGuard';
import SignIn from './pages/login';
import SignUp from './pages/signup';
import routes from './routes'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element= {<SignIn/>} />
        <Route path="/signup" element= { <SignUp/>} />
        {
          routes.map((route, index) => {
            return (
              <Route key={index}
                path={route.path}
                exact={route.exact}
                element={
                  <AuthGuard>
                     <route.component {...route} />
                  </AuthGuard>
                }
              />
            )
          })
        }
      </Routes>
    </BrowserRouter>
  )
}

export default App
