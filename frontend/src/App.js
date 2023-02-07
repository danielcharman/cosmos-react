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
import Technologies from './pages/Technologies'
import Vehicles from './pages/Vehicles'
import Universe from './pages/Universe'
import Missions from './pages/Missions'

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
								path='/technologies'
								element={
									<PrivateRoute>
										<Technologies />
									</PrivateRoute>
								}
							/>
							<Route
								path='/vehicles'
								element={
									<PrivateRoute>
										<Vehicles />
									</PrivateRoute>
								}
							/>
							<Route
								path='/universe'
								element={
									<PrivateRoute>
										<Universe />
									</PrivateRoute>
								}
							/>
							<Route
								path='/missions'
								element={
									<PrivateRoute>
										<Missions />
									</PrivateRoute>
								}
							/>
						</Routes>
					</div>
				</main>
			</Router>
			<ToastContainer />
		</>
	);
}

export default App;
