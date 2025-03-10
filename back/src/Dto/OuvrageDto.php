<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

readonly class OuvrageDto
{
    public function __construct(
        #[Assert\NotBlank]
        public string  $nom,

        public ?int    $position,

        #[Assert\NotBlank]
        public int     $typeBienId,

        #[Assert\NotBlank]
        public int     $siteId,
        public ?string $description,
        public ?string $image


    )
    {
    }
}