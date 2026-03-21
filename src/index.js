import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import './index.css'
import Home from './pages/Home/Home'
import Criar from './pages/Criar/Criar'
import Lista from './pages/Lista/Lista'
import Login from './pages/Autenticacao/Login'
import AlterarSenha from './pages/Autenticacao/AlterarSenha'
import Topbar from './components/Topbar'
import RotaProtegida from './components/RotaProtegida'
import NotFound from './pages/NotFound/NotFound'

function ScrollToTop() {
	const { pathname } = useLocation()
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [pathname])
	return null
}

const semTopbar = ['/login', '/alterarsenha']

function Layout({ children }) {
	const { pathname } = useLocation()
	return (
		<>
			{!semTopbar.includes(pathname) && <Topbar />}
			{children}
		</>
	)
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<ScrollToTop />
			<Layout>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/alterarsenha" element={<AlterarSenha />} />
					<Route path="/" element={<RotaProtegida><Home /></RotaProtegida>} />
					<Route path="/criar" element={<RotaProtegida><Criar /></RotaProtegida>} />
					<Route path="/lista" element={<RotaProtegida><Lista /></RotaProtegida>} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Layout>
		</BrowserRouter>
	</React.StrictMode>
);