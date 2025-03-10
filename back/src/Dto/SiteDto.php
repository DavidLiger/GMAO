<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

readonly class SiteDto
{
    public function __construct(
        #[Assert\NotBlank]
        public string  $nom,

        public float   $latitude,

        public float   $longitude,

        #[Assert\NotBlank]
        public int     $typeBienId,

        public ?int    $villeId,
        public ?string $description,
        public ?string $image


    )
    {
    }
}