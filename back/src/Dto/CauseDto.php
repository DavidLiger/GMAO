<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

readonly class CauseDto
{
    public function __construct(
        #[Assert\NotBlank(message: "Le nom est requis.")]
        #[Assert\Type(type: "string", message: "Le nom doit être une chaîne de caractères.")]
        public string $nom,

        #[Assert\NotBlank(message: "L'identifiant de la société est requis.")]
        #[Assert\Type(type: "int", message: "L'identifiant de la société doit être un entier.")]
        public int $idSociete
    ) {
    }
}