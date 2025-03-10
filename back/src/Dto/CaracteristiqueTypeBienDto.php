<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

readonly class CaracteristiqueTypeBienDto
{
    public function __construct(
        #[Assert\NotBlank]
        public int $caracteristiqueId,

        #[Assert\NotBlank]
        public int $typeBienId,

        public ?int $priorite = null,
    ) {
    }
}