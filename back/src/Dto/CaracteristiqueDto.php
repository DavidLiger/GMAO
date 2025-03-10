<?php

namespace App\Dto;

use App\Library\Enum\EnumTypeChamp;
use Symfony\Component\Validator\Constraints as Assert;

readonly class CaracteristiqueDto
{
    public function __construct(
        #[Assert\NotBlank(message: "Le nom est requis.")]
        #[Assert\Type(type: "string", message: "Le nom doit être une chaîne de caractères.")]
        public string        $nom,

        #[Assert\NotBlank(message: "Le type est requis.")]
        #[Assert\NotNull(message: "Le type est requis.")]
        public EnumTypeChamp $typeChamp,

        #[Assert\Type(type: "string", message: "La valeur par défaut doit être une chaîne de caractères.")]
        public ?string       $valeurDefaut,

        #[Assert\Type(type: "array", message: "Les valeurs possibles doivent être un tableau.")]
        #[Assert\All(
            constraints: [new Assert\Type(type: "string", message: "Chaque valeur possible doit être une chaîne de caractères.")]
        )]
        public ?array        $listeValeurs,

        #[Assert\Type(type: "integer", message: "L'unité doit être un nombre entier.")]
        public ?int          $unite
    )
    {
    }
}