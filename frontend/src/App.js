import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/Login'
import Logout from './pages/Logout'
import Register from './pages/Register'
import Header from './components/Header'
import Overview from './pages/Overview'
import Buildings from './pages/Buildings'
import Research from './pages/Research'
import Fleet from './pages/Fleet'
import { Link } from 'react-router-dom'

function App() {
	return (
		<>
			<Router>
				<Header />
				<main className='bodyWrapper'>
					<div className='container'>
						<Routes>
							<Route path='/' element={<Login/>} />
							<Route path='/register' element={<Register/>} />
							<Route
								path='/logout'
								element={
									<PrivateRoute>
										<Logout />
									</PrivateRoute>
								}
							/>
							<Route
								path='/overview'
								element={
									<PrivateRoute>
										<Overview />
									</PrivateRoute>
								}
							/>
							<Route
								path='/buildings'
								element={
									<PrivateRoute>
										<Buildings />
									</PrivateRoute>
								}
							/>
							<Route
								path='/research'
								element={
									<PrivateRoute>
										<Research />
									</PrivateRoute>
								}
							/>
							<Route
								path='/fleet'
								element={
									<PrivateRoute>
										<Fleet />
									</PrivateRoute>
								}
							/>
						</Routes>
						{
						// <Link to='/logout' className='btn btn-danger' style={{position: 'absolute', bottom: 15, right: 15}}>
						// 	Logout
						// </Link>
						}
					</div>
				</main>
			</Router>
			<ToastContainer />
		</>
	);
}

export default App;
