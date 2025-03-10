export default function OuvrageView({bien}) {
    return (
        <div>
            <h1>Ouvrage : {bien.nom}</h1>
            <p>Description : {bien.description}</p>
            {/* Autres champs spécifiques à l'ouvrage */}
        </div>
    );
}