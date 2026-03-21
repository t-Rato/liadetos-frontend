import { useState, useEffect } from "react"

export default function Aniversario() {
	const getTargetDate = () => {
		const now = new Date()
		const target = new Date(now.getFullYear(), 11, 27, 2, 45, 0)
		if (now >= target) {
			target.setFullYear(target.getFullYear() + 1)
		}
		return target
	}

	const calcularTempo = () => {
		const agora = new Date()
		const diff = getTargetDate() - agora
		return {
			dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
			horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
			minutos: Math.floor((diff / (1000 * 60)) % 60),
			segundos: Math.floor((diff / 1000) % 60)
		}
	}

	const [tempo, setTempo] = useState(calcularTempo())

	useEffect(() => {
		const interval = setInterval(() => {
			setTempo(calcularTempo())
		}, 1000)
		return () => clearInterval(interval)
	// eslint-disable-next-line	
	}, [])

	return (
		<div className="bg-gradient-to-b from-red-500 via-orange-500 to-yellow-500 my-10 mx-4 lg:mx-[200px] flex flex-col justify-start items-center pt-10 rounded-[50px] lg:rounded-[100px] shadow-xl gap-8">
			<div className="text-gray-50 text-3xl lg:text-7xl font-extrabold text-center px-6">
				ANIVERSÁRIO DOS LIADETOS
			</div>
			<div className="grid grid-cols-2 lg:flex lg:flex-row gap-6 lg:gap-10 justify-center items-center mb-10 text-gray-50 px-6">
				{[
					{ valor: tempo.dias, label: "DIAS" },
					{ valor: tempo.horas, label: "HORAS" },
					{ valor: tempo.minutos, label: "MINUTOS" },
					{ valor: tempo.segundos, label: "SEGUNDOS" }
				].map(({ valor, label }) => (
					<div key={label} className="flex flex-col justify-start items-center gap-2">
						<div className="backdrop-blur-xl bg-white/10 shadow-xl p-4 rounded-[80px] w-[110px] lg:w-[160px] text-center">
							<p className="text-4xl lg:text-7xl font-bold">{valor}</p>
						</div>
						<p className="text-base lg:text-xl font-bold">{label}</p>
					</div>
				))}
			</div>
		</div>
	)
}