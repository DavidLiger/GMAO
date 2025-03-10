<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

readonly class SiteCreateDto
{
    public function __construct(
        #[Assert\NotBlank]
        public string  $nom,

        #[Assert\NotBlank]
        public float   $latitude,

        #[Assert\NotBlank]
        public float   $longitude,

        public ?int    $typeBienId,

        public string  $nomVille,
        public string  $codePostal,
        public ?string $description,
        public ?string $image,
        public ?string $nomImage,
        
        public ?array  $caracteristiques
    )
    {
    }
}