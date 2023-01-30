import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Header from './components/Header'
import Overview from './pages/Overview'

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
						</Routes>
					</div>
				</main>
			</Router>
			<ToastContainer />
		</>
	);
}

export default App;
