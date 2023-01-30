import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Header from './components/Header'
import Overview from './pages/Overview'
import Structures from './pages/Structures'
import Research from './pages/Research'
import Fleet from './pages/Fleet'

function App() {
	return (
		<>
			<Router>
				<Header />
				<main className='bodyWrapper'>
					<div className='container'>
						<Routes>
							<Route path='/' element={<Home/>} />
							<Route path='/login' element={<Login/>} />
							<Route path='/register' element={<Register/>} />
							<Route
								path='/overview'
								element={
									<PrivateRoute>
										<Overview />
									</PrivateRoute>
								}
							/>
							<Route
								path='/structures'
								element={
									<PrivateRoute>
										<Structures />
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
					</div>
				</main>
			</Router>
			<ToastContainer />
		</>
	);
}

export default App;
