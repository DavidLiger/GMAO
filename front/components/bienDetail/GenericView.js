export default function GenericView({bien}) {
    return (
        <div>
            <h1>Site : {bien.nom}</h1>
            <p>Description : {bien.description}</p>
            {/* Autres champs spécifiques au site */}
        </div>
    );
}