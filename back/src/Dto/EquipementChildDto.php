<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

readonly class EquipementChildDto
{
    public function __construct(
        #[Assert\NotBlank]
        public string  $nom,

        public bool    $relevable,

        #[Assert\NotBlank]
        public int     $typeBienId,

        public ?string $description,
        public ?string $image


    )
    {
    }
}