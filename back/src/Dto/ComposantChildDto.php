<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

readonly class ComposantChildDto
{
    public function __construct(
        #[Assert\NotBlank]
        public string  $nom,

        #[Assert\NotBlank]
        public int     $typeBienId,

        public ?string $description,
        public ?string $image


    )
    {
    }
}