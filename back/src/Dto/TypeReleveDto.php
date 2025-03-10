<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

readonly class TypeReleveDto
{
    public function __construct(
        #[Assert\NotBlank]
        public string $nom,

        #[Assert\NotBlank(message: "L'identifiant de la société est requis.")]
        #[Assert\Type(type: "int", message: "L'identifiant de la société doit être un entier.")]
        public int $idSociete
    )
    {
    }
}