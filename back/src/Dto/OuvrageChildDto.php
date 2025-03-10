<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

readonly class OuvrageChildDto
{
    public function __construct(
        #[Assert\NotBlank]
        public string  $nom,

        public int     $position,

        #[Assert\NotBlank]
        public int     $typeBienId,

        public ?string $description,
        public ?string $image


    )
    {
    }
}