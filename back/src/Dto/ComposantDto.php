<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

readonly class ComposantDto
{
    public function __construct(
        #[Assert\NotBlank]
        public string  $nom,

        #[Assert\NotBlank]
        public int     $typeBienId,

        #[Assert\NotBlank]
        public ?int    $equipementId,
        public ?string $description,
        public ?string $image


    )
    {
    }
}