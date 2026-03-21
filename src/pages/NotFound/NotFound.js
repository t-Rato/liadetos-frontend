import { useNavigate } from "react-router-dom"

export default function NotFound() {
	const navigate = useNavigate()

	return (
		<div
			className="flex flex-col justify-center items-center min-h-screen gap-8 px-4 lg:px-0"
			style={{ background: 'linear-gradient(to top, #f87171, #fb923c, #facc15)' }}
		>
			<div className="flex flex-col items-center gap-2 text-center">
				<p className="text-white text-[80px] lg:text-[120px] font-extrabold leading-none">404</p>
				<p className="text-white text-2xl lg:text-[40px] font-bold">PÁGINA NÃO ENCONTRADA</p>
				<p className="text-white/70 font-semibold text-base lg:text-xl">Esta página não existe ou foi removida.</p>
			</div>
			<button
				onClick={() => navigate("/")}
				className="px-12 py-4 rounded-full font-bold text-xl transition-all duration-300 bg-black text-white hover:translate-y-[-5px] hover:shadow-lg"
			>
				VOLTAR AO INÍCIO
			</button>
		</div>
	)
}