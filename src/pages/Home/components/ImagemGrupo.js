import imagemGrupo from "../images/UNGO.jpg"

export default function ImagemGrupo() {
	return (
		<div className="w-full h-auto mt-10">
			<img
				src={imagemGrupo}
				alt="Imagem UNGO"
				className="w-full h-[250px] lg:h-[500px] object-cover object-center"
			/>
		</div>
	)
}