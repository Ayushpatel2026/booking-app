
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Layout from './layouts/Layout'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout>
          <h1>Home</h1>
        </Layout>}/>
        <Route path="/search" element={<Layout>
          <h1>Search Page</h1>
        </Layout>}/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
