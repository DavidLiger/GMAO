<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

readonly class UniteDto
{
    public function __construct(
        #[Assert\NotBlank]
        public string $nom,
        #[Assert\NotBlank]
        public string $libelle,
        #[Assert\NotBlank]
        public string $description,
    )
    {
    }
}