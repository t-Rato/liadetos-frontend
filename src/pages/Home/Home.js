import Stats from "./components/Stats"
import Ranking from "./components/Ranking"
import ImagemGrupo from "./components/ImagemGrupo"
import Aniversario from "./components/Aniversario"

export default function Home() {
    
    return (
        <div className="text-white">
            <Stats />
            <Ranking />
            <ImagemGrupo />
            <Aniversario />
        </div>
    )
}