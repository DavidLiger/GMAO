<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

readonly class ReleveDto
{
    public function __construct(
        #[Assert\NotBlank]
        public string $nom,

        #[Assert\NotBlank]
        public int    $equipementId,

        #[Assert\NotBlank]
        public int    $typeReleve,

        #[Assert\NotBlank]
        public string $valeur


    )
    {
    }
}