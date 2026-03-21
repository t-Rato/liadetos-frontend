import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Menu, X } from "lucide-react"

export default function Topbar() {
	const [scrolled, setScrolled] = useState(false)
	const [menuAberto, setMenuAberto] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 100)
		}
		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	const defaultStyle = `cursor-pointer transition-all duration-300 font-bold my-5 relative group ${scrolled ? 'text-2xl' : 'text-4xl'}`
	const underlineEffect = "absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-full transition-all duration-300"

	const handleNavegar = (rota) => {
		navigate(rota)
		setMenuAberto(false)
	}

	return (
		<div className={`fixed top-0 left-0 w-full z-50 py-5 transition-all duration-300 ${scrolled ? 'py-2 backdrop-blur-xl shadow-lg' : 'py-6 bg-transparent pt-20'}`}>

			{/* Desktop */}
			<div className="hidden lg:grid grid-cols-3 items-center px-10">
				<div className="flex flex-row justify-end gap-10">
					<p
						onClick={() => navigate('/criar')}
						className={`text-[#f43f5e] ${defaultStyle}`}
					>
						Criar
						<span className={`bg-[#f43f5e] ${underlineEffect}`} />
					</p>
				</div>
				<div className="flex justify-center">
					<p
						onClick={() => navigate('/')}
						style={{ backgroundImage: 'linear-gradient(to right, #f43f5e, #ec4899, #ef4444)' }}
						className={`relative cursor-pointer transition-all duration-300 bg-clip-text text-transparent font-bold group ${scrolled ? 'text-7xl' : 'text-8xl'}`}
					>
						LIADETOS
						<span
							style={{ backgroundImage: 'linear-gradient(to right, #f43f5e, #ec4899, #ef4444)' }}
							className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-full transition-all duration-500"
						/>
					</p>
				</div>
				<div className="flex flex-row justify-start gap-10">
					<p
						onClick={() => navigate('/lista')}
						className={`text-[#ef4444] ${defaultStyle}`}
					>
						Lista
						<span className={`bg-[#ef4444] ${underlineEffect}`} />
					</p>
				</div>
			</div>

			{/* Mobile */}
			<div className="flex lg:hidden items-center justify-between px-6">
				<p
					onClick={() => navigate('/')}
					style={{ backgroundImage: 'linear-gradient(to right, #f43f5e, #ec4899, #ef4444)' }}
					className="relative cursor-pointer bg-clip-text text-transparent font-bold text-4xl"
				>
					LIADETOS
				</p>
				<button
					onClick={() => setMenuAberto(!menuAberto)}
					className="text-[#f43f5e]"
				>
					{menuAberto ? <X size={32} /> : <Menu size={32} />}
				</button>
			</div>

			{/* Menu mobile aberto */}
			{menuAberto && (
				<div className="flex lg:hidden flex-col items-center gap-4 pt-4 pb-6 backdrop-blur-xl">
					<p
						onClick={() => handleNavegar('/criar')}
						className="cursor-pointer text-[#f43f5e] font-bold text-2xl"
					>
						Criar
					</p>
					<p
						onClick={() => handleNavegar('/lista')}
						className="cursor-pointer text-[#ef4444] font-bold text-2xl"
					>
						Lista
					</p>
				</div>
			)}
		</div>
	)
}